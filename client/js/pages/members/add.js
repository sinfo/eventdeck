/*global app*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberForm = require('client/js/forms/member');
var _ = require('client/js/helpers/underscore');
var log = require('bows')('members');

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
            data = _.compactObject(data);

            var aux = {
              main: data['mails.main'],
              institutional: data['mails.institutional'],
              dropbox: data['mails.dropbox'],
              google: data['mails.google'],
              microsoft: data['mails.microsoft']
            };

            data.mails = aux;

            log(data);

            app.members.create(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/members/'+model.id);
                app.members.fetch();
              }
            });
          }
        });
      }
    }
  }
});
