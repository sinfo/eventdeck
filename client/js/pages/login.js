/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var $ = require('jquery');

module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.login,

  events: {
    'click #loginId': 'loginId',
    'click #loginCode': 'loginCode'
  },

  loginId: function () {
    var id = this.id = $('#id input').val();

    if (id) {
      $.get('/api/auth/login/' + id, function () {
        $('#id').hide();
        $('#code').show();
      });
    }
  },

  loginCode: function () {
    var code = $('#code input').val();

    if (code) {
      app.login(this.id, code);
    }
  }
});
