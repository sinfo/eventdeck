'use strict';

eventdeckServices
  .factory('MemberFactory', function ($resource) {
    return {
      Member: $resource(url_prefix+'/members/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Role: $resource(url_prefix+'/roles/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Me: $resource(url_prefix+'/members/me', null, {
        'get': {method: 'GET', isArray: false}
      })
    };
  })