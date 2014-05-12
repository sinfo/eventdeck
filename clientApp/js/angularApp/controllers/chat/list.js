'use strict';

theToolController.controller('ChatController', function ($scope, $http, $routeParams, $sce, MessageFactory, ChatFactory, MemberFactory) {
    $scope.loading = true;

  ChatFactory.Chats.getAll(function(chats) {
    $scope.chats = chats;
    $scope.loading = false;
  });

});