'use strict';

theToolController.controller('ChatsController', function ($scope, ChatFactory) {

  $scope.loading = true;

  ChatFactory.Chat.getAll(function(chats) {
    $scope.chats = chats;
    $scope.loading = false;
  });

});
