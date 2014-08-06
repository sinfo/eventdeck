'use strict';

theToolController
  .controller('SpeakersController', function ($rootScope, $scope, $http, $sce, SpeakerFactory) {
  
    $rootScope.update.timeout(runController);

    function runController(){

      $scope.limit = 20;

      $scope.statuses = ['Suggestion','Selected','Approved','Contacted','In Conversations','Accepted','Rejected','Give Up'];

      $scope.speakerPredicate = 'updated';
      $scope.reverse = 'true';
      
      SpeakerFactory.Speaker.getAll(function(response) {
        $scope.speakers = response;
      });

      console.log($scope.activeEvent);

      $scope.scroll = function() {
        if ($scope.limit <= $scope.speakers.length)
          $scope.limit += 8;
      };

      $scope.checkPermission = function (member) {
        var roles = $scope.me.roles.filter(function(o) {
          return o.id == 'development-team' || o.id == 'coordination';
        });

        if(roles.length === 0 && member.id != $scope.me.id) {
          return false;
        }

        return true;
      };

      $scope.addSpeaker = function(member, newSpeaker) {
        console.log(newSpeaker);
        var speakerData = newSpeaker;
        
        if(newSpeaker.id) {
          SpeakerFactory.Speaker.update({ id: speakerData.id }, { member: member.id }, function(response) {
            if(response.error) {
              console.log(response);
              $scope.error = response.error;
            } else {
              $scope.message = response.success;

              SpeakerFactory.Speaker.getAll(function (speakers) {
                $scope.speakers = speakers;
              });
            }
          });
        } else {
          speakerData.status = 'Selected';
          speakerData.member = member.id;

          SpeakerFactory.Speaker.create(speakerData, function(response) {
            if(response.error) {
              $scope.error = response.error;
            } else {
              $scope.message = response.message;

              SpeakerFactory.Speaker.getAll(function (speakers) {
                $scope.speakers = speakers;
              });
            }
          });
        }
      };
    }
  });
  