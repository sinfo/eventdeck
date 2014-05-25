'use strict';

var theToolServices = angular.module('theTool.services', ['ngResource']);

theToolServices
  .factory('CompanyFactory', function($resource) {
    return $resource('/api/company/:id', null, {
      'getAll': {method: 'GET', isArray:true},
      'update': {method: 'PUT'},
      'create': {method: 'POST'},
      'delete': {method: 'DELETE'}
    });
  })

  .factory('SpeakerFactory', function($resource) {
    return $resource('/api/speaker/:id', null, {
      'getAll': {method: 'GET', isArray:true},
      'update': {method: 'PUT'},
      'create': {method: 'POST'},
      'delete': {method: 'DELETE'}
    });
  })

  .factory('MemberFactory', function($resource) {
    return {
      Member: $resource('/api/member/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Companies: $resource('/api/member/:id/companies', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Speakers: $resource('/api/member/:id/speakers', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Topics: $resource('/api/member/:id/topics', null, {
        'getAll': { method: 'GET', isArray: true }
      })
    }
  })

  .factory('CommentFactory', function($resource) {
    return {
      Comment: $resource('/api/comment/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource('/api/company/:id/comments', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Speaker: $resource('/api/speaker/:id/comments', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Topic: $resource('/api/topic/:id/comments', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    }
  })

  .factory('EmailFactory', function($resource) {
    return {
      Company: $resource('/api/company/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      }),
      Speaker: $resource('/api/speaker/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      })
    }
  })

  .factory('NotificationFactory', function($resource) {
    return {
      Notification: $resource('/api/notification', null, {
        'getAll': {method: 'GET', isArray:true},
      }),
      Company: $resource('/api/company/:id/notifications', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Speaker: $resource('/api/speaker/:id/notifications', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Topic: $resource('/api/topic/:id/notifications', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    }
  })

  .factory('TopicFactory', function($resource) {
    return {
      Topic: $resource('/api/topic/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'create': {method: 'POST'},
        'update': {method: 'PUT'},
        'delete': {method: 'DELETE'}
      })
    }
  })

  .factory('MeetingFactory', function($resource) {
    return $resource('/api/meetings', null, {
      'getAll': {method: 'GET', isArray:true},
      'create': {method: 'POST'},
      'update': {method: 'PUT'},
      'delete': {method: 'DELETE'}
    })
  })

  .factory('ChatFactory', function($resource) {
    return {
      Chat: $resource('/api/chat/:id', null, {
        'update': {method: 'POST'},
        'get':    {method: 'GET'}
      }),
      Chats: $resource('/api/chats', null, {
        'getAll': {
          method: 'GET',
          isArray:true
        }
      }),
      Messages: $resource('/api/chat/:id/messages', null, {
        'get': {
          method: 'GET',
          isArray:true
        }
      })
    }
  })

  .factory('MessageFactory', function($resource) {
    return $resource('/api/message/:id', null, {
        get:    {method: 'GET'},
        create: {method: 'POST'}
      })
  });
