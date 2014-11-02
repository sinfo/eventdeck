// Member Model - member.js
var AmpModel = require('ampersand-model');


module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    img: ['string'],
    roles: ['array'],
    facebook: ['object'],
    skype: ['string'],
    phones: ['array'],
    mails: ['object']
  },
  session: {
    selected: ['boolean', true, false]
  },
  derived: {
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/members/' + this.id + '/edit';
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/members/' + this.id;
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