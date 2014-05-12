'use strict';

theToolController.controller('MessageController', function ($scope, $http, $routeParams, $sce, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.loading = true;

  ChatFactory.Chat.get({id: $routeParams.id}, function(result) {
    console.log(result);
    $scope.chat = result;
    $scope.loading = false;
  });

  ChatFactory.Messages.get({id: $routeParams.id}, function(response) {
    console.log(response);
    if(response.error) {
      $scope.error = response.error;
    } else {
      $scope.messages = response.message;
    }

  });

  $scope.submit = function() {
    if ($scope.messageText == ""){
      //$scope.empty = true;
      return;
    }

    var messageData = {
      text   : $scope.messageText,
      chatId : $routeParams.id,
      member : $scope.me.id,
    }

    MessageFactory.create(messageData, function(response){

      console.log(response);
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.message = response.message;
      }
    });

    console.log($scope.message);
    ChatFactory.Chat.update({ id:$routeParams.id }, {message:$scope.message._id}, function(response) {
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
