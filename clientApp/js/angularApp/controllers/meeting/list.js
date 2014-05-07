'use strict';

theToolController.controller('MeetingsController', function ($scope, MeetingFactory) {

  MeetingFactory.getAll(function(result) {
  	console.log(result);
  	$scope.meetings = result;
  });

});
