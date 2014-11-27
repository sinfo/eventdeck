/*global app, alert*/
var log = require('bows')('companies');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CompanyView = require('client/js/views/company');
var CommunicationsView = require('client/js/views/communications');
var Communications = require('client/js/models/communications');
var CommentsView = require('client/js/views/comments');
var Comments = require('client/js/models/comments');
var ParticipationsView = require('client/js/views/participations');


module.exports = PageView.extend({
  pageTitle: 'View company',
  template: templates.pages.companies.view,
  bindings: {
    'model.name': {
      hook: 'name'
    },
    'model.storedImg': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.status': {
      hook: 'status'
    },
    'model.history': {
      hook: 'history'
    },
    'model.contacts': {
      hook: 'contacts'
    },
    'model.area': {
      hook: 'area'
    },
    'model.description': {
      hook: 'description'
    },
    'model.access': {
      hook: 'access'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'edit',
      name: 'href'
    },
    'model.templateUrl': {
      type: 'attribute',
      hook: 'view-template',
      name: 'href'
    },
    'model.startupTemplateUrl': {
      type: 'attribute',
      hook: 'view-startup-template',
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
      log('Got company', model.name);
    });
  },
  subviews: {
    participations: {
      container: '[data-hook=company-participations]',
      waitFor: 'model.participations',
      prepareView: function (el) {
        return new ParticipationsView({
          el: el,
          collection: this.model.participations
        });
      }
    },
    comments:{
      container: '[data-hook=company-comments]',
      waitFor: 'model.commentsApi',
      prepareView: function (el) {
        var Comms = new Comments(this.model.commentsApi);
        return new CommentsView({
          el: el,
          collection: new Comms()
        });
      }
    },
    communications: {
      container: '[data-hook=company-communications]',
      waitFor: 'model.communicationsApi',
      prepareView: function (el) {
        var Comms = new Communications(this.model.communicationsApi);
        return new CommunicationsView({
          el: el,
          collection: new Comms()
        });
      }
    },
  },
  handleDeleteClick: function () {
    this.model.destroy({success: function () {
      app.navigate('companies');
    }});
  }
});