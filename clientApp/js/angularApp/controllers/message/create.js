'use strict';

theToolController.controller('MessageController', function ($scope, $http, $routeParams, $sce, MessageFactory, ChatFactory, MemberFactory) {
  $scope.submit = function() {
    if ($scope.messageData == ""){
      //$scope.empty = true;
      return;
    }

    var messageData = this.messageData;
    var messages;

    MemberFactory.Member.get({id: "me"}, function(me) {
      messageData.member = $scope.author = me;
    });

    MessageFactory.create(messageData, function(response){

      console.log(response);
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.message = response.message;
      }
    });


    ChatFactory.Messages.get({ id:messageData.chatId }, function(response) {
      console.log(response);

      if(response.error) {
        $scope.error = response.error;
      } else {
        chatData.messages = response.message;
      }

    });

    ChatFactory.Chat.update({ id:messageData.chatId }, {messages:chatData.messages}, function(response) {
      // if successful, we'll need to refresh the chat list
      console.log(response);

      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.chat = response.message;
      }
    });
  };

  //$scope.emptyComment = false;
});
