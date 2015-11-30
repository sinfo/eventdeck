/*global app*/
var View = require('ampersand-view');
var templates = require('client/js/templates');
var Company = require('client/js/models/company');
var AmpersandRestCollection = require('ampersand-rest-collection');

module.exports = View.extend({
  template: templates.cards.memberCompanies,
  bindings: {
    'model.name': '[data-hook~=user-name]',
    'model.img': {
      type: 'attribute',
      hook: 'user-img',
      name: 'src'
    },
    'model.viewUrl': {
      type: 'attribute',
      hook: 'user-url',
      name: 'href'
    }
  },
  initialize: function() {
    var self = this;
    this.collection = null;

    var companiesCollection = AmpersandRestCollection.extend({
      url: '/api/companies?event=' + app.me.selectedEvent + '&member=' + self.model.id,
      model: Company
    });
    companiesCollection = new companiesCollection();

    var options = {
      success: function () {
        self.collection = companiesCollection;
        self.render();
      }
    }

    companiesCollection.fetch(options);
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, MemberCompaniesRow, this.queryByHook('companiesContainer'));
  },
});

var MemberCompaniesRow = View.extend({
  template: templates.cards.memberCompaniesRow,
  bindings: {
    'model.name': '[data-hook~=company-name]',
    'model.img': {
      type: 'attribute',
      hook: 'company-img',
      name: 'src'
    },
    'model.viewUrl': {
      type: 'attribute',
      hook: 'company-url',
      name: 'href'
    },
    'model.statusDetails.style': {
      type: 'attribute',
      hook: 'status',
      name: 'style'
    }
  },
});

