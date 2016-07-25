/*global app*/
var PageView = require('client/js/pages/base')
var templates = require('client/js/templates')
var SpeakerForm = require('client/js/forms/speaker')
var _ = require('client/js/helpers/underscore')

module.exports = PageView.extend({
  pageTitle: 'Add speaker',
  template: templates.pages.speakers.add,
  subviews: {
    form: {
      container: 'form',
      prepareView: function (el) {
        return new SpeakerForm({
          el: el,
          submitCallback: function (data) {
            data = _.compactObject(data)

            app.speakers.create(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/speakers/' + model.id)
                app.speakers.fetch()
              },
              error: function (response) {
                window.alert('This speaker already exists.')
                app.navigate('')
              }
            })
          }
        })
      }
    }
  }
})
