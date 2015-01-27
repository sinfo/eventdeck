/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SessionForm = require('client/js/forms/session');
var _ = require('client/js/helpers/underscore');
var moment = require('moment');


module.exports = PageView.extend({
  pageTitle: 'Edit session',
  template: templates.pages.sessions.edit,
  initialize: function (spec) {
    var self = this;
    app.sessions.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        return alert('couldnt find a model with id: ' + spec.id);
      }
      self.model = model;
    });
  },
  subviews: {
    form: {
      container: '[data-hook=session-form]',
      waitFor: 'model',
      bindings:{
        'model.img': {
          type: 'attribute',
          hook: 'session-img',
          name: 'background'
        }
      },
      prepareView: function (el) {
        var self = this;
        var model = this.model;
        return new SessionForm({
          el: el,
          model: this.model,
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

            data.duration = data.end - data.date;
            delete data.end;

            var changedAttributes = self.model.changedAttributes(data) || {};

            if(data['session-speakers']) {
              changedAttributes.speakers = data['session-speakers'] && data['session-speakers'].map(function(s) {return {id: s};});
              delete data['session-speakers'];
            }

            if(!changedAttributes) {
              return app.navigate('/sessions/'+model.id);
            }

            self.model.save(changedAttributes, {
              patch: true,
              wait: false,
              success: function (model, response, options) {
                app.navigate('/sessions/'+model.id);
              },
              error: function (model, response, options) {
                console.log('error', response.statusCode, response.response);
              }
            });
          }
        });
      }
    }
  }
});