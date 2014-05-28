'use strict';

theToolController.controller('MessageController', function ($scope, $http, $routeParams, $sce, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.loading = true;
  $scope.messages = [];

 /* setInterval(function(){
    ChatFactory.Messages.get({id: $routeParams.id}, function(response) {
      if(response.error) {
        $scope.error = response.error;
      } else {
        if($scope.messages.length < response.length){
          for(var i= $scope.messages.length; i < response.length; i++){
            $scope.messages[i] = response[i];
          }  
        } 
      }
    });
  },4000);*/

  SocketFactory.emit('auth', {id: $routeParams.id}, function (result) {
      if (!result) {
        console.log('Error on authentication');
      }
      else {
        console.log('Auth success');
      }
  });

  SocketFactory.on('init', function (data) {
    console.log('Chat running');
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

    SocketFactory.emit('send:message', { message: 'welcome to the chat' }, function() {console.log('emited')});
    /*MessageFactory.create(messageData, function(response){
      if(response.error) {
        $scope.error = response.error;
      } else {
        messageData.id = response.messageId;

        console.log(messageData.id);
        ChatFactory.Chat.update({ id:$routeParams.id }, {message:messageData.id}, function(response) {
          // if successful, we'll need to refresh the chat list
          console.log(response);

          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.chat = response.message;
          }
        });
      }
    });*/
  };
});
