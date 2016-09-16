/* global app */
var PageView = require('client/js/pages/base')
var templates = require('client/js/templates')
var TopicForm = require('client/js/forms/topic')
var _ = require('client/js/helpers/underscore')
var async = require('async')

module.exports = PageView.extend({
  pageTitle: 'Add topic',
  template: templates.pages.topics.add,
  initialize: function (spec) {
    var self = this

    async.parallel([
      function (cb) {
        if (app.members.length) {
          return cb()
        }
        app.members.fetch({ success: function () {
          cb()
        }})
      },
      function (cb) {
        if (app.tags.length) {
          return cb()
        }
        app.tags.fetch({ success: function () {
          cb()
        }})
      }
    ],
      function (err) {
        if (err) throw err
        self.model = {}
      })
  },
  subviews: {
    form: {
      container: 'form',
      prepareView: function (el) {
        return new TopicForm({
          el: el,
          submitCallback: function (data) {
            data = _.compactObject(data)

            if (data['poll-kind'] || data['poll-options']) {
              data.poll = {
                kind: data['poll-kind'],
                options: data['poll-options'] && data['poll-options'].map(function (o) { return { content: o } })
              }
              delete data['poll-kind']
              delete data['poll-options']
            }

            app.topics.create(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/topics/' + model.id)
              }
            })
          }
        })
      }
    }
  }
})
