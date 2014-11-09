/*global app, alert*/
var log = require('bows')('companies');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CompanyView = require('client/js/views/company');
var CommunicationView = require('client/js/views/communication');

var Communications = require('client/js/models/communications');


module.exports = PageView.extend({
  pageTitle: 'View company',
  template: templates.pages.companies.view,
  bindings: {
    'model.name': {
      hook: 'name'
    },
    'model.img': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'edit',
      name: 'href'
    }
  },
  events: {
    'click [data-hook~=delete]': 'handleDeleteClick'
  },
  initialize: function (spec) {
    var self = this;
    app.companies.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        log.error('couldnt find a company with id: ' + spec.id);
      }

      self.model = model;

      log('Got company', model.name)

      var Comms = Communications(model.communicationsApi);
      self.communications = new Comms();

      self.communications.fetch({ 
        success: function(collection, response, options) {
          self.communications = collection;
          log('got communications', self.model.communications);
        }
      });

    });
  },
  handleDeleteClick: function () {
    this.model.destroy({success: function () {
      app.navigate('companies');
    }});
  }
});
