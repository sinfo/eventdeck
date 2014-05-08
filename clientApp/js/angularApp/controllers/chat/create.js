'use strict';

/*theToolController.controller('ChatController', function ($scope, $http, $routeParams, $sce, MessageFactory, ChatFactory, MemberFactory) {
  $scope.newChat = function() {
    if ($scope.chatData == ""){
      //$scope.empty = true;
      return;
    }

    var chatData = this.chatData;
    $scope.members = [];
    chatData.messages = $scope.messages = [];
    MemberFactory.Member.getAll(function(response) {
      $scope.members = chatData.members = response;
    });

    ChatFactory.Chat.create(chatData, function(response){
      
      console.log(response);
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.chat = response.chat;
      }
    });
  };

  //$scope.emptyComment = false;
});*/