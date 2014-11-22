var Hoek = require('hoek');
var Path = require('path');
var Boom = require('boom');
var Joi = require('joi');
var fs = require('fs');
var Request = require('request');

var properties = require('./package.json');

exports = module.exports = {};
exports.name = properties.name;
exports.version = properties.version;

// Declare internals
var internals = {
  defaults: {
    prefix: '/api/images',
    directory: Path.join(__dirname, 'downloads')
  }
};

exports.register = function (plugin, options, next) {

  var settings = Hoek.applyToDefaults(internals.defaults, options || {});

  plugin.route({
    method: 'GET',
    path: [settings.prefix, '{encodedUrl}'].join('/'),
    config: {
      validate: {
        params: {
          encodedUrl: Joi.string().required().description('URL of the image encoded in base64.')
        },
      },
      handler: function (request, reply) {
        var filePath = Path.join(settings.directory, request.params.encodedUrl);

        // console.log('filePath', filePath);
        var url = new Buffer(request.params.encodedUrl, 'base64').toString('ascii');

        if(url.indexOf('data:image/jpeg;base64') != -1) {
          // var image = new Buffer(request.params.encodedUrl, 'base64');
          // request.raw.res.writeHead(200, {
          //   'Access-Control-Allow-Origin': '*',
          //   'Content-Type': 'image/jpeg',
          //   'Cache-Control': 'no-cache, no-store, must-revalidate',
          //   'Pragma': 'no-cache',
          //   'Content-Length': image.length
          // });
          // request.raw.res.write(image, 'binary');

          // return request.raw.res.end();

          return reply(Boom.badRequest('Malformed image url'));
        }

        fs.exists(filePath, function (exists) {
          if(exists) {
            return reply.file(filePath).type('image');
          }

          console.log('download file', url, '\n\n\n');

          try {
            Request
              .get(url)
              .on('error', function(err) {
                console.log('ERROR!');
                reply(Boom.notFound(err.message));
              })
              .on('end', function(response) {
                return reply.file(filePath).type('image');
              })
              .on('error', function(err) {
                console.log('ERROR!');
                return reply(Boom.notFound(err.message));
              })
              .pipe(fs.createWriteStream(filePath))
              .on('error', function(err) {
                console.log('ERROR!');
                return reply(Boom.badRequest('Make sure the directory `'+settings.directory+'` exists'));
              });

            } catch (err) {
              return reply(Boom.notFound(err));
            }
        });
      }
    }
  });

  next();
};

exports.register.attributes = {
  pkg: properties
};
