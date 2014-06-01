'use strict';

theToolController.controller('ChatController', function ($scope, $http, $routeParams, $sce, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.loading = true;
  $scope.messages = [];

  SocketFactory.on('connected', function (message) {
    SocketFactory.emit('auth', {id: $routeParams.id, user: $scope.me.id}, function () {
      console.log('Auth success');
    });
  });

  SocketFactory.on('validation', function (result){
    console.log(result);
    if(!result.err){
      $scope.chat     = result.chatData;
      $scope.messages = result.messages;
      $scope.room     = result.room;
    }
    else{
      console.log(result.message);
    }
  });

  SocketFactory.on('message', function (message) {
    $scope.messages.push(message);
  });

  $scope.submit = function() {
    if ($scope.messageText == ""){
      //$scope.empty = true;
      return;
    }

    var messageData = {
      text   : $scope.text,
      chatId : $routeParams.id,
      member : $scope.me.id,
    }
    console.log(messageData);

    SocketFactory.emit('send', {room: $scope.room, message: messageData }, function() {console.log('emited')});
  };
});
