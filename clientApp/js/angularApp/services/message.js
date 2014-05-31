'use strict';

theToolServices
  .factory('MessageFactory', function ($resource) {
    return $resource('/api/message/:id', null, {
        get:    {method: 'GET'},
        create: {method: 'POST'}
      })
  })