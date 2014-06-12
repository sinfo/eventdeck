'use strict';

theToolServices
  .factory('MeetingFactory', function ($resource) {
    return $resource(url_prefix+'/api/meeting/:id', null, {
      'getAll': {method: 'GET', isArray: true},
      'create': {method: 'POST'},
      'update': {method: 'PUT'},
      'delete': {method: 'DELETE'}
    });
  })
