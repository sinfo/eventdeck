'use strict';
 
theToolController
  .controller('MemberController', function ($scope, $http, $routeParams, $sce, $location, MemberFactory) {
    $scope.getClassFromKind = function(participation) {
      if(!participation) { return "nope"; }
      if(!participation.kind) { return "sponsor"; }
      var kind = participation.kind.toLowerCase();

      if(kind.indexOf("bronze") != -1) { return "bronze"; } 
      else if(kind.indexOf("prata") != -1) { return "silver"; }
      else { return "sponsor"; }
    }
    
    MemberFactory.Member.get({id: $routeParams.id}, function(response) {
      if($routeParams.id == "me") {
        var newPath = "/member/"+response.id;
        console.log("going to", newPath);
        $location.path(newPath);        
      }
      $scope.member = response;
    });

    MemberFactory.Companies.getAll({id: $routeParams.id}, function(response) {
      $scope.companies = response;
    });
  });