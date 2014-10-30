'use strict';

eventdeckServices
  .factory('MeetingFactory', function ($resource) {
    return $resource(url_prefix+'/meetings/:id', null, {
      'getAll': {method: 'GET', isArray: true},
      'create': {method: 'POST'},
      'update': {method: 'PUT'},
      'delete': {method: 'DELETE'}
    });
  })
