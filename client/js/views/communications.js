var log = require('bows')('communications');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CommunicationView = require('client/js/views/communication');
var CommunicationForm = require('client/js/forms/communication');

module.exports = PageView.extend({
  template: templates.partials.communications.area,
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
  },
  subviews: {
    form: {
      container: '[data-hook~=new-commmunication]',
      prepareView: function (el) {
        var self = this;

        var form = new CommunicationForm({
          el: el,
          submitCallback: function (data) {
            var communication = {
              thread: self.parent.model.thread,
              event: data.event,
              kind: data.kind,
              text: data.text
            };

            self.collection.create(communication, {
              wait: true,
              success: function () {
                self.fetchCollection();
                log('new communication created', communication);
                form.reset();
              }
            });
          }
        });

        return form;
      }
    }
  }
});
