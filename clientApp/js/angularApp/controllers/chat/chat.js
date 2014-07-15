'use strict';

theToolController.controller('ChatController', function ($rootScope, $scope, $http, $routeParams, $sce, ngAudio, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.updating = false;
  $scope.loading  = true;
  $scope.messages = [];
  $scope.online   = [];
  $scope.history  = function () {
    setTimeout(function() {$scope.history()}, 3000);
  }

  console.log($scope.scroll);

  console.log("Connecting");

  SocketFactory.connect('/chat');

  SocketFactory.on('connected', function () {
    console.log(SocketFactory.socket);
    SocketFactory.emit('auth', {id: $routeParams.id, user: $scope.me.id}, function () {
      console.log('Auth success');
    });
  });

  SocketFactory.on('validation', function (response){
    console.log(response);
    if(!response.err){
      $scope.chat     = response.chatData;
      $scope.messages = response.messages;
      $scope.room     = response.room;

      for(var i = 0; i < $scope.chat.members.length; i++){
        $scope.online.push({member: $scope.chat.members[i], on: false});
        if(response.online.indexOf($scope.chat.members[i]) != -1){
          $scope.online[i].on = true;
        }
        $scope.online[i].name = $scope.getMember($scope.online[i].member).name;
      }
      console.log($scope.online);
      $scope.history = history;
/*      $scope.$watch('scroll', function(newValue, oldValue, scope) {
        if (!newValue) {history();}
      });*/
    }
    else{
      console.log(response.message);
    }
    $scope.loading  = false;
  });

  SocketFactory.on('user:connected', function (response) {
    console.log("User connected: " + response.id);
    for(var i = 0; i < $scope.online.length; i++){
      if($scope.online[i].member === response.id){
        $scope.online[i].on = true;
        break;
      }
    }
  });

  SocketFactory.on('user:disconnected', function (response) {
    console.log("User connected: " + response.id);
    for(var i = 0; i < $scope.online.length; i++){
      if($scope.online[i].member === response.id){
        $scope.online[i].on = false;
        break;
      }
    }
  });

  SocketFactory.on('message', function (response) {
    var message = response.message
    $scope.messages.push(message);
    if(message.member != $scope.me.id) {
      ngAudio.play("audio/message.mp3");
    }
  });

  SocketFactory.on('history-send', function (response) {
    $scope.messages = $scope.messages.concat(response.messages);
    $scope.updating = false;
  });

  $scope.$on('$locationChangeStart', function(){
    console.log("On location change");
    console.log(SocketFactory);
    SocketFactory.disconnect();
    delete SocketFactory.socket;
  });

  $scope.submit = function() {
    if ($scope.text == ""){
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

  function history () {
    console.log('Start history request');
    if(!$scope.updating){
      $scope.updating = true;
      SocketFactory.emit('history-get', {room: $scope.room, date: $scope.messages[$scope.messages.length-1].date }, function() {
        console.log('Sent history request');
      });
    }
  }
});