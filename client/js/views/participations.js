var log = require('bows')('participations');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var ParticipationView = require('client/js/views/participation');

module.exports = PageView.extend({
  template: templates.partials.participations,
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, ParticipationView, this.queryByHook('participations-list'));
    log(this.collection.length);
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    log('Fetching participations');
    this.collection.fetch();
    return false;
  }
});