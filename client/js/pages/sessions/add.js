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

            if(data['session-date']) {
              data.date = moment(data['session-date'], 'DD-MM-YYYY').toDate();
              delete data['session-date'];
            }

            if(data['session-duration']) {
              data.duration = moment(data['session-duration'], 'DD-MM-YYYY').toDate();
              delete data['session-duration'];
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