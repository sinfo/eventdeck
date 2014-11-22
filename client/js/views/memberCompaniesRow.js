var View = require('ampersand-view');
var templates = require('client/js/templates');
var Companies = require('client/js/models/company');
var MemberCompaniesRow = require('client/js/views/memberCompaniesRow');


module.exports = View.extend({
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
    }
  },
});


