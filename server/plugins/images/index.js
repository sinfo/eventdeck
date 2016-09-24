var Hoek = require('hoek')
var Path = require('path')
var Boom = require('boom')
var Joi = require('joi')
var fs = require('fs')
var Request = require('request')
var log = require('../../helpers/logger')
var crypto = require('crypto')

var properties = require('./package.json')

exports = module.exports = {}
exports.name = properties.name
exports.version = properties.version

var internals = {
  defaults: {
    prefix: '/api/images',
    directory: Path.join(__dirname, 'downloads')
  }
}

var settings = {}

exports.register = function (plugin, options, next) {
  settings = Hoek.applyToDefaults(internals.defaults, options || {})

  plugin.route({
    method: 'GET',
    path: [settings.prefix, '{encodedUrl}'].join('/'),
    config: {
      validate: {
        params: {
          encodedUrl: Joi.string().required().description('URL of the image encoded in base64.')
        }
      },
      handler: function (request, reply) {
        getResource(request.params.encodedUrl, function (err, filePath) {
          if (err && err.isBoom) {
            return reply(err)
          }

          return reply.file(filePath).type('image')
        })
      }
    }
  })

  next()
}

function getResource (id, cb) {
  getLocal(id, function (err, filePath) {
    if (err) {
      return getRemote(id, cb)
    }
    return cb(null, filePath)
  })
}

function getLocal (id, cb) {
  var filePath = getLocalFilePath(id)

  fs.exists(filePath, function (exists) {
    if (!exists) {
      return cb(Boom.notFound('file is not on disk'))
    }

    return cb(null, filePath)
  })
}

function getRemote (id, cb) {
  var filePath = getLocalFilePath(id)
  var url = new Buffer(id, 'base64').toString('ascii')

  if (url.indexOf('data:image/jpeg;base64') !== -1) {
    return cb(Boom.badRequest('Malformed image url'))
  }

  try {
    Request
      .get(url)
      .on('error', function (err) {
        return cb(Boom.notFound(err.message))
      })
      .on('end', function (response) {
        return cb(null, filePath)
      })
      .on('error', function (err) {
        return cb(Boom.notFound(err.message))
      })
      .pipe(fs.createWriteStream(filePath))
      .on('error', function (err) {
        log.error({ url: url, err: err }, 'Error saving file, make sure the directory `' + settings.directory + '` exists')
        return cb(Boom.badRequest('Make sure the directory `' + settings.directory + '` exists'))
      })
  } catch (err) {
    return cb(Boom.notFound(err))
  }
}

function getLocalFilePath (id) {
  var md5sum = crypto.createHash('md5')
  md5sum.update(id)
  return Path.join(settings.directory, md5sum.digest('hex'))
}

exports.register.attributes = {
  pkg: properties
}
