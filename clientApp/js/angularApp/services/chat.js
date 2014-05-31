'use strict';

theToolServices
  .factory('ChatFactory', function ($resource) {
    return {
      Chat: $resource('/api/chat/:id', null, {
        'update': {method: 'POST'},
        'getAll': {method: 'GET', isArray:true}
      }),
      Message: $resource('/api/chat/:id/messages', null, {
        'getAll': {method: 'GET',isArray:true}
      })
    }
  })