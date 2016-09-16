/* global app, alert */
var log = require('bows')('members')
var PageView = require('client/js/pages/base')
var templates = require('client/js/templates')
var populate = require('client/js/helpers/populate')
var MemberForm = require('client/js/forms/member')

module.exports = PageView.extend({
  pageTitle: 'Edit person',
  template: templates.pages.members.edit,
  initialize: function (spec) {
    var self = this
    app.members.getOrFetch(spec.id, function (err, model) {
      if (err) {
        return alert('couldnt find a model with id: ' + spec.id)
      }
      self.model = model
    })
  },
  subviews: {
    form: {
      // this is the css selector that will be the `el` in the
      // prepareView function.
      container: 'form',
      // this says we'll wait for `this.model` to be truthy
      waitFor: 'model',
      prepareView: function (el) {
        var self = this
        var model = this.model

        return new MemberForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            populate(data, ['facebook.id', 'facebook.username', 'mails.main', 'mails.institutional', 'mails.dropbox', 'mails.google', 'mails.microsoft'])

            if (!model.mails.main) {
              model.mails.main = ''
            }
            if (!model.mails.dropbox) {
              model.mails.dropbox = ''
            }
            if (!model.mails.institutional) {
              model.mails.institutional = ''
            }
            if (!model.mails.google) {
              model.mails.google = ''
            }
            if (!model.mails.microsoft) {
              model.mails.microsoft = ''
            }
            if (!model.facebook.username) {
              model.facebook.username = ''
            }

            if (data.img === '') {
              delete data.img
            }
            if (data.skype === '') {
              delete data.skype
            }
            if (data.twitter === '') {
              delete data.twitter
            }
            if (data.github === '') {
              delete data.github
            }

            var mails = {
              main: data['mails.main'],
              institutional: data['mails.institutional'],
              dropbox: data['mails.dropbox'],
              google: data['mails.google'],
              microsoft: data['mails.microsoft']
            }

            var facebook = {
              username: data['facebook.username']
            }

            data.mails = mails
            data.facebook = facebook

            mails = model.mails.changedAttributes(data.mails)
            facebook = model.facebook.changedAttributes(data.facebook)

            var aux = self.model.changedAttributes(data)

            if (!aux && !mails && !facebook) {
              return app.navigate('/members/' + model.id)
            }

            if (!aux) {
              aux = {}
            }

            if (mails) {
              aux.mails = mails
            }

            if (facebook) {
              aux.facebook = facebook
            }

            model.save(aux, {
              patch: true,
              wait: false,
              success: function (model, response, options) {
                app.navigate('/members/' + model.id)
              },
              error: function (model, response, options) {
                log.error(response.statusCode + ' ' + response.response)
              }
            })
          }
        })
      }
    }
  }
})
