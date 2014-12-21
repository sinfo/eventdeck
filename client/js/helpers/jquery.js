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

$.each(['put','delete'], function( i, method ) {
  $[ method ] = function( url, data, callback, type ) {
    if ( $.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return $.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

module.exports = $;