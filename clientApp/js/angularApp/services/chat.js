'use strict';

theToolServices
  .factory('ChatFactory', function ($resource) {
    return {
      Chat: $resource('/api/chat/:id', null, {
        'update': {method: 'POST'},
        'get':    {method: 'GET'}
      }),
      Chats: $resource('/api/chat', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Messages: $resource('/api/chat/:id/messages', null, {
        'get': {method: 'GET',isArray:true}
      })
    }
  })