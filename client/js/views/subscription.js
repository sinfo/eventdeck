var log = require('bows')('subscription');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var $ = require('client/js/helpers/jquery');

module.exports = PageView.extend({
  template: templates.partials.subscription,
  initialize: function () {
    var self = this;
    self.setVisibility(false);
    $.get('/api/subscriptions?thread='+this.model.thread, function (data) {
      log(data);
      self.setVisibility(data.subscribed);
    });
  },
  render: function () {
    this.renderWithTemplate();
  },
  events: {
    'click [data-hook~=subscribe]': 'subscribe',
    'click [data-hook~=unsubscribe]': 'unsubscribe',
  },
  subscribe: function () {
    var self = this;
    log('click', this.model.thread);
    $.post('/api/subscriptions', { thread: this.model.thread }, function (data) {
      log('subscribed', data.thread);
      // self.queryByHook('message').innerHTML = 'subscribded to this thread';
      self.setVisibility(true);
    });
  },
  unsubscribe: function () {
    var self = this;
    log('click', this.model.thread);
    $.delete('/api/subscriptions', { thread: this.model.thread }, function (data) {
      log('unsubscribed', data.thread);
      // self.queryByHook('message').innerHTML = 'unsubscribded to this thread';
      self.setVisibility(false);
    });
  },
  setVisibility: function (isSubscribed){
    $(this.queryByHook('subscribe')).toggle(!isSubscribed);
    $(this.queryByHook('unsubscribe')).toggle(isSubscribed);
  }
});