/* global app */
var PageView = require('../base')
var templates = require('../../templates')
var MemberForm = require('../../forms/member')
var _ = require('../../helpers/underscore')

module.exports = PageView.extend({
  pageTitle: 'Add member',
  template: templates.pages.members.add,
  subviews: {
    form: {
      container: 'form',
      prepareView: function (el) {
        return new MemberForm({
          el: el,
          submitCallback: function (data) {
            data = _.compactObject(data)

            var aux = {
              main: data['mails.main'],
              institutional: data['mails.institutional'],
              dropbox: data['mails.dropbox'],
              google: data['mails.google'],
              microsoft: data['mails.microsoft']
            }

            data.mails = aux

            app.members.create(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/members/' + model.id)
                app.members.fetch()
              },
              error: function (response) {
                window.alert('This member already exists.')
                app.navigate('')
              }
            })
          }
        })
      }
    }
  }
})
