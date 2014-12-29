/*global app*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SessionForm = require('client/js/forms/session');
var _ = require('client/js/helpers/underscore');
var moment = require('moment');

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
            
            if (data['session-date']) {
              data.date = data['session-date'];
              delete data['session-date'];
              
              if (data['session-date-hours']) {
                data.date.setHours(data['session-date-hours']);
                delete data['session-date-hours'];
              }
              if (data['session-date-minutes']) {
                data.date.setMinutes(data['session-date-minutes']);
                delete data['session-date-minutes'];
              }
            }
            
            if (data['session-duration']) {
              data.duration = data['session-duration'];
              delete data['session-duration'];
              
              if (data['session-duration-hours']) {
                data.duration.setHours(data['session-duration-hours']);
                delete data['session-duration-hours'];
              }
              if (data['session-duration-minutes']) {
                data.duration.setMinutes(data['session-duration-minutes']);
                delete data['session-duration-minutes'];
              }
            }

            if(data['session-speakers']) {
              data.speakers = data['session-speakers'] && data['session-speakers'].map(function(s) {return {id: s};});
              delete data['session-speakers'];
            }

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