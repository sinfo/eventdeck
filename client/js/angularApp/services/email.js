'use strict';

eventdeckServices
  .factory('EmailFactory', function ($resource) {
    return {
      Company: $resource(url_prefix+'/companies/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      }),
      Speaker: $resource(url_prefix+'/speakers/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      })
    }
  })