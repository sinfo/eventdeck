/*global app*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberForm = require('client/js/forms/member');


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
            app.members.create(data, {
              wait: true,
              success: function () {
                app.navigate('/members');
                app.members.fetch();
              }
            });
          }
        });
      }
    }
  }
});
