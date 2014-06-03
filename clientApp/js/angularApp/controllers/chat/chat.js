'use strict';

theToolController.controller('ChatController', function ($rootScope, $scope, $http, $routeParams, $sce, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.loading  = true;
  $scope.messages = [];
  $scope.online   = [];

  SocketFactory.connect('/chat');

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

      for(var i = 0; i < $scope.chat.members.length; i++){
        $scope.online.push({member: $scope.chat.members[i], on: false});
        if(result.online.indexOf($scope.chat.members[i]) != -1){
          $scope.online[i].on = true;
        }
        $scope.online[i].name = $scope.getMember($scope.online[i].member).name;
      }
      console.log($scope.online);

    }
    else{
      console.log(result.message);
    }
    $scope.loading  = false;
  });

  SocketFactory.on('user:connected', function (data) {
    console.log("User connected: " + data.id);
    for(var i = 0; i < $scope.online.length; i++){
      if($scope.online[i].member === data.id){
        $scope.online[i].on = true;
        break;
      }
    }
  });

  SocketFactory.on('user:disconnected', function (data) {
    console.log("User connected: " + data.id);
    for(var i = 0; i < $scope.online.length; i++){
      if($scope.online[i].member === data.id){
        $scope.online[i].on = false;
        break;
      }
    }
  });

  SocketFactory.on('message', function (message) {
    console.log(message.date);
    $scope.messages.push(message);
  });

  $scope.submit = function() {
    if ($scope.text == ""){
      //$scope.empty = true;
      return;
    }

    var messageData = {
      text   : $scope.text,
      chatId : $routeParams.id,
      member : $scope.me.id,
    }
    console.log(messageData);

    SocketFactory.emit('send', {room: $scope.room, message: messageData }, function() {
      console.log('Message sent');
      $scope.text = "";
    });
  };
});