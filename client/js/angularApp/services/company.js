'use strict';

eventdeckServices
  .factory('CompanyFactory', function ($resource) {
    return {
      Company: $resource(url_prefix+'/companies/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource(url_prefix+'/members/:id/companies', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    };
  })