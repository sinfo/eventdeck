'use strict';

theToolController
  .controller('SpeakersController', function ($scope, $http, $sce, SpeakerFactory, MemberFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.getClassFromKind = function(status) {
      if(!status) { return "suggestion"; }
      var kind = status.toLowerCase();

      if(kind.indexOf("contactado") != -1) { return "contacted"; } 
      else if(kind.indexOf("aceitou") != -1) { return "accepted"; }
      else if(kind.indexOf("rejeitou") != -1) { return "rejected"; }
      else if(kind.indexOf("conversações") != -1) { return "conversations"; }
      else if(kind.indexOf("desistir") != -1) { return "giveup"; }
      else { return "suggestion"; }
    }

    SpeakerFactory.getAll(function(response) {
      $scope.predicate = 'participation';
      $scope.reverse = false;
      $scope.speakers = response;
    });
  });
  