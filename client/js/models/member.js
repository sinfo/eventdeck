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
  }
});