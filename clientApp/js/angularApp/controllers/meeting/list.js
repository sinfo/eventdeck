'use strict';

theToolController.controller('MeetingsController', function ($scope, MeetingFactory, MemberFactory) {

  MeetingFactory.getAll(function(meetings) {
  	$scope.meetings = meetings;

  	MemberFactory.Member.getAll(function(members) {
    	$scope.members = members;

    	for (var i = 0, j = $scope.meetings.length; i < j; i++) {
    		$scope.meetings[i].facebook = $scope.members.filter(function(o) {
          return $scope.meetings[i].author == o.id;
        })[0].facebook;
    	}
	 });
  });

  $scope.time = function(date) {
    return $scope.timeSince(new Date(date));
  };

});
