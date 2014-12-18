/*global app*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SessionForm = require('client/js/forms/session');
var _ = require('client/js/helpers/underscore');

module.exports = PageView.extend({
  pageTitle: 'Add session',
  template: templates.pages.sessions.add,
  subviews: {
    form: {
      container: 'form',
      prepareView: function (el) {
        return new SessionForm({
          el: el,
          submitCallback: function (data) {
            data = _.compactObject(data);

            app.sessions.create(data, {
              wait: true,
              success: function () {
                app.navigate('/sessions');
                app.members.fetch();
              }
            });
          }
        });
      }
    }
  }
});