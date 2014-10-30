'use strict';

eventdeckServices
  .factory('ChatFactory', function ($resource) {
    return {
      Chat: $resource(url_prefix+'/chats/:id', null, {
        'update': {method: 'POST'},
        'getAll': {method: 'GET', isArray:true}
      }),
      Message: $resource(url_prefix+'/chats/:id/messages', null, {
        'getAll': {method: 'GET',isArray:true}
      })
    }
  })