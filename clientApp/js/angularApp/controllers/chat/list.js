'use strict';

theToolController.controller('ChatController', function ($scope, ChatFactory) {

  $scope.loading = true;

  ChatFactory.Chats.getAll(function(chats) {
    $scope.chats = chats;
    $scope.loading = false;
  });

});
