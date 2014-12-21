var $ = require('jquery');

$.extend({
  hook: function(hookName) {
    var selector;
    if(!hookName || hookName === '*') {
      // select all data-hooks
      selector = '[data-hook]';
    } else {
      // select specific data-hook
      selector = '[data-hook~="' + hookName + '"]';
    }
    return $(selector);
  }
});

module.exports = $;