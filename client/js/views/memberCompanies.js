var View = require('ampersand-view');
var templates = require('client/js/templates');
var Company = require('client/js/models/company');
var MemberCompaniesRow = require('client/js/views/memberCompaniesRow');
var AmpersandCollection = require('ampersand-collection'); 

module.exports = View.extend({
  template: templates.cards.memberCompanies,
  bindings: {
    'model.name': '[data-hook~=name]',
    'model.img': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.viewUrl': {
        type: 'attribute',
        hook: 'name',
        name: 'href'
    }
  },
  initialize: function() {
    var self = this;
    this.collection = null;
    var companies = app.companies.filter(function(company){
      console.log("FILTER", company.participation.member, self.model.id);
      return company.participation && company.participation.member == self.model.id;
    });
    this.collection = new AmpersandCollection(companies, {model: Company});
    console.log("COMPANIES", companies);
    console.log("MODEL", self.model);
    console.log("MODEL ID", self.model.id);
    console.log("INITIALIZE", this.collection.serialize());
    this.render();
  },
  render: function () {
    this.renderWithTemplate();
    console.log(this.collection.serialize());
    this.renderCollection(this.collection, MemberCompaniesRow, this.queryByHook('companiesContainer'));
    if (!this.collection.length) {
      //this.fetchCollection();
    }
  },
});


