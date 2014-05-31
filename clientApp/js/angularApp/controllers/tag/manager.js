"use strict";

theToolController.controller("TagManagerController", function ($scope, TagFactory) {

  $scope.loading = true;

  $scope.tag = {};

  $scope.lightColors = ["#f7c6c7", "#fad8c7", "#fef2c0", "#bfe5bf", "#bfdadc", "#c7def8", "#bfd4f2", "#d4c5f9"];
  $scope.colors = ["#e11d21", "#eb6420", "#fbca04", "#009800", "#006b75", "#207de5", "#0052cc", "#5319e7"];

  $scope.changeColor = function (color) {
    console.log(color);
    $scope.tag.color = color;
  };

  $scope.createTag = function (tag) {
    TagFactory.Tag.create(tag, function (response) {
      if (response.success) {
        $scope.tags.push(response.tag);
      }
    });
  };

  $scope.deleteTag = function (tag) {
    TagFactory.Tag.delete({id: tag.id}, function (response) {
      if (response.success) {
        $scope.tags.splice($scope.tags.indexOf(tag), 1);
      }
    });
  };

});
