/*global app*/
var View = require('ampersand-view');
var templates = require('client/js/templates');
var Company = require('client/js/models/company');
var AmpersandCollection = require('ampersand-collection');

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
    app.companies.on('sync', function() {
      var companies = app.companies.filter(function(company){
        return company.participation && company.participation.member == self.model.id;
      });
      
      self.collection = new AmpersandCollection(companies, {model: Company});
      self.render();
    });

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

