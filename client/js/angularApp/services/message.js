'use strict';

eventdeckServices
  .factory('MessageFactory', function ($resource) {
    return $resource(url_prefix+'/messages/:id', null, {
        'getAll':    {method: 'GET', isArray: true}
      })
  })