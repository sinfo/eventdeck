'use strict';

theToolServices
  .factory('SocketFactory', function ($resource, $location, $rootScope) {
    var socket;
    return {
      connect: function(nsp) {
/*        console.log($rootScope.socket);
        if($rootScope.socket){
          console.log($rootScope.socket.connected);
          $rootScope.socket.disconnect();
        }
        $rootScope.socket = socket = io.connect(nsp);*/
        socket = io.connect(nsp);
      },
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
      },
      disconnect: function () {
        socket.disconnect();
      }
    };
  });
