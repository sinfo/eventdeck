'use strict';

eventdeckServices.factory('SubscriptionFactory', function ($resource) {
  return {
    Company: $resource(url_prefix + '/companies/:id/subscription', null, {
      'get': {method: 'GET'},
      'add': {method: 'POST'},
      'remove': {method: 'DELETE'}
    }),
    Speaker: $resource(url_prefix + '/speakers/:id/subscription', null, {
      'get': {method: 'GET'},
      'add': {method: 'POST'},
      'remove': {method: 'DELETE'}
    }),
    Topic: $resource(url_prefix + '/topics/:id/subscription', null, {
      'get': {method: 'GET'},
      'add': {method: 'POST'},
      'remove': {method: 'DELETE'}
    })
  };
});
