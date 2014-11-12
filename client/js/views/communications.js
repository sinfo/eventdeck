var log = require('bows')('communications');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CommunicationView = require('client/js/views/communication');


module.exports = PageView.extend({
  template: templates.partials.communications,
  events: {
    'click [data-hook~=fetch]': 'fetchCollection',
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, CommunicationView, this.queryByHook('communications-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    log('Fetching communications');
    this.collection.fetch();
    return false;
  }
});
