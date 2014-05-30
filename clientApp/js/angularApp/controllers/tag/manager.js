"use strict";

theToolController.controller("TagManagerController", function ($scope, TagFactory) {

  $scope.loading = true;

  $scope.newTag = {};

  $scope.lightColors = ['#f7c6c7', '#fad8c7', '#fef2c0', '#bfe5bf', '#bfdadc', '#c7def8', '#bfd4f2', '#d4c5f9'];
  $scope.colors = ['#e11d21', '#eb6420', '#fbca04', '#009800', '#006b75', '#207de5', '#0052cc', '#5319e7'];

  $scope.changeColor = function(color) {
    $scope.newTag.color = color;
    console.log("COLOR", color);
  }

  $scope.createTag = function(newTag) {
    console.log("CREATE", newTag);

    TagFactory.Tag.create(newTag, function(response) {
      if(response.success) {
        $scope.tags.push(response.tag);
      }
    });
  }

  $scope.deleteTag = function(tag) {
    console.log("DELETE", tag);

    TagFactory.Tag.delete({id:tag.id}, function(response) {
      console.log("RESPONSE", response);
      if(response.success) {
        var index = $scope.tags.indexOf(tag);
        $scope.tags.splice(index, 1);
      }
    });
  }

});
