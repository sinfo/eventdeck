'use strict';

theToolServices
  .factory('MessageFactory', function ($resource) {
    return $resource('/api/message/:id', null, {
        'getAll':    {method: 'GET', isArray: true}
      })
  })