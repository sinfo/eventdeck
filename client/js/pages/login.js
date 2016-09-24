/* global app, FB */
var log = require('bows')('auth')
var PageView = require('./base')
var templates = require('../templates')
var config = require('../helpers/clientconfig')
var $ = require('jquery')

module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.login,

  initialize: function () {
    $.getScript('//connect.facebook.net/pt_PT/all.js', function () {
      log('loaded facebook connect', arguments)
      FB.init({
        appId: config.facebook.appId,
        xfbml: true,
        status: true,
        cookie: true
      })
    })
  },

  events: {
    'click #loginId': 'loginId',
    'click [data-hook~=login-facebook]': 'loginWithFacebook',
    'click #loginCode': 'loginCode'
  },

  loginId: function () {
    var id = this.id = $('#id input').val()

    if (id) {
      $.get('/api/auth/login/' + id, function () {
        $('#id').hide()
        $('#code').show()
      })
    }
  },

  loginWithFacebook: function () {
    FB.login(function (loginDetails) {
      log('facebook login', loginDetails)

      if (loginDetails.authResponse) {
        app.loginWithFacebook(loginDetails.authResponse.userID, loginDetails.authResponse.accessToken)
      }
    })
  },

  loginCode: function () {
    var code = $('#code input').val()

    if (code) {
      app.login(this.id, code)
    }
  }
})
