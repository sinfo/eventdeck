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

            if (data['session-end']) {
              data.end = data['session-end'];
              delete data['session-end'];

              if (data['session-end-hours']) {
                data.end.setHours(data['session-end-hours']);
                delete data['session-end-hours'];
              }
              if (data['session-end-minutes']) {
                data.end.setMinutes(data['session-end-minutes']);
                delete data['session-end-minutes'];
              }
            }

            var tickets = {
              needed : data['tickets.needed'],
              start: new Date(data['tickets.start']),
              end: new Date(data['tickets.end']),
              max: parseInt(data['tickets.max'])
            };
            delete data['tickets.needed'];
            delete data['tickets.start'];
            delete data['tickets.end'];
            delete data['tickets.max'];

            data.tickets = tickets;

            data.duration = data.end - data.date;
            delete data.end;

            if(data['session-speakers']) {
              data.speakers = data['session-speakers'] && data['session-speakers'].map(function(s) {return {id: s};});
              delete data['session-speakers'];
            }
            console.log(data);

            app.sessions.create(data, {
              wait: true,
              success: function (model, response, options) {
                console.log(model);
                app.navigate('/sessions/'+model.id);
                app.sessions.fetch();
              }
            });
          }
        });
      }
    }
  }
});