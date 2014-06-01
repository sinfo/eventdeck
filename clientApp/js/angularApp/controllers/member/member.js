"use strict";

theToolController.controller("MemberController", function ($scope, $http, $routeParams, $sce, $location, MemberFactory) {

  $scope.loading = true;

  if ($routeParams.id === "me") {
    $location.path("/member/" + $scope.me.id);
    return;
  }

  $scope.member = $scope.getMember($routeParams.id);

  MemberFactory.Member.get({id:$routeParams.id}, function(result) { 
    if(!result.error) {
      $scope.member = result;
      getMemberStuff();
    } 
  });

  getMemberStuff();

  function getMemberStuff() {
    $scope.member.companies = $scope.companies.filter(function(e) {
      return e.member == $scope.member.id;
    })

    $scope.member.speakers = $scope.speakers.filter(function(e) {
      return e.member == $scope.member.id;
    })

    $scope.member.comments = $scope.comments.filter(function(e) {
      return e.member == $scope.member.id;
    })

    if($scope.companies.length > 0 && $scope.speakers.length > 0) {
      $scope.loading = false;
    } else {
      setTimeout(getMemberStuff, 1000);
    }
  }

});
