'use strict';

var theToolServices = angular.module('theTool.services', ['ngResource']);

theToolServices
  .factory('CompanyFactory', function ($resource) {
    return {
      Company: $resource('/api/company/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource('/api/member/:id/companies', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    };
  })

  .factory('SpeakerFactory', function ($resource) {
    return {
      Speaker: $resource('/api/speaker/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource('/api/member/:id/speakers', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    };
  })

  .factory('MemberFactory', function ($resource) {
    return {
      Member: $resource('/api/member/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Role: $resource('/api/role/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })

  .factory('CommentFactory', function ($resource) {
    return {
      Comment: $resource('/api/comment/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource('/api/company/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Topic: $resource('/api/topic/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })

  .factory('EmailFactory', function ($resource) {
    return {
      Company: $resource('/api/company/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      }),
      Speaker: $resource('/api/speaker/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      })
    }
  })

  .factory('NotificationFactory', function ($resource) {
    return {
      Notification: $resource('/api/notification/:id', null, {
        'getAll': {method: 'GET', isArray: true},
      }),
      Company: $resource('/api/company/:id/notifications', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/notifications', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Topic: $resource('/api/topic/:id/notifications', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })

  .factory('TopicFactory', function ($resource) {
    return {
      Topic: $resource('/api/topic/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'create': {method: 'POST'},
        'update': {method: 'PUT'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource('/api/member/:id/topics', null, {
        'getAll': { method: 'GET', isArray: true }
      })
    }
  })

  .factory('MeetingFactory', function ($resource) {
    return $resource('/api/meeting/:id', null, {
      'get': {method: 'GET', isArray: true},
      'create': {method: 'POST'},
      'update': {method: 'PUT'},
      'delete': {method: 'DELETE'}
    })
  })

  .factory('CommunicationFactory', function ($resource) {
    return {
      Communication: $resource('/api/communication/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'},
        'approve': {method: 'POST'}
      }),
      Company: $resource('/api/company/:id/communications', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/communications', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })

  .factory('SessionFactory', function ($resource) {
    return {
      Session: $resource('/api/session/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource('/api/company/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })

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

  .factory('MessageFactory', function ($resource) {
    return $resource('/api/message/:id', null, {
        get:    {method: 'GET'},
        create: {method: 'POST'}
      })
  })

  .factory('RoleFactory', function ($resource) {
    return {
      Role: $resource('/api/role/:id', null, {
        'getAll': {method: 'GET', isArray: true},
      }),
      Member: $resource('/api/role/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })

  .factory('TagFactory', function ($resource) {
    return {
      Tag: $resource('/api/tag/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Topic: $resource('/api/tag/:id/topics', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })

  .factory('SocketFactory', function ($resource, $location, $rootScope) {
    var socket = io.connect('/chat');
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });
