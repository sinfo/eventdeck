'use strict';

eventdeckServices
  .factory('SessionFactory', function ($resource) {
    return {
      Session: $resource(url_prefix+'/sessions/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource(url_prefix+'/companies/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource(url_prefix+'/speakers/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })