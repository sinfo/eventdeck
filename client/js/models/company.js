// company Model - company.js
var AmpModel = require('ampersand-model');


module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    img: ['string'],
    url:['string'],
    contacts:['string'],
    history:['string'],
    participations:['array'],
    items:['array'],
    area:['string'],
    accesses:['array'],
    updated:['string']
  },
 
  session: {
    selected: ['boolean', true, false]
  },
  derived: {
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/companies/' + this.id + '/edit';
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/companies/' + this.id;
      }
    },
    background: {
      deps: ['img'],
      fn: function () {
        return 'background-image:url('+this.img+'?width=200);';
      }
    }
  }

 });