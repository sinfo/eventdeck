"use strict";

theToolController.controller("MemberController", function ($scope, $http, $routeParams, $sce, $location, MemberFactory) {
  $scope.getClassFromKind = function(participation) {
    if(!participation) { return "nope"; }
    if(!participation.kind) { return "sponsor"; }
    var kind = participation.kind.toLowerCase();

    if(kind.indexOf("bronze") != -1) { return "bronze"; }
    else if(kind.indexOf("prata") != -1) { return "silver"; }
    else { return "sponsor"; }
  }

  $scope.loading = true;

  if ($routeParams.id === "me") {
    $location.path("/member/" + $scope.me.id);
    return;
  }

  $scope.member = $scope.members.find(function (o) {
    return o.id === $routeParams.id;
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
