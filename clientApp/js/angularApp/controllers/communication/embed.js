"use strict";

theToolController.controller("CommunicationEmbedController", function ($scope, CommunicationFactory) {

  //================================INITIALIZATION================================

  $scope.success     = "";
  $scope.error       = "";

  $scope.communication = JSON.parse($scope.communicationJson);
  $scope.communication.editing = false;
  $scope.communication.deleted = false;

  $scope.me = JSON.parse($scope.meJson);
  $scope.members = JSON.parse($scope.membersJson);
  $scope.roles = JSON.parse($scope.rolesJson);


  $scope.saveCommunication = function (communication) {
    if (communication.buffer === "") {
      return;
    }

    communication.text = communication.buffer;
    communication.updated = Date.now();

    CommunicationFactory.Communication.update({id: communication._id}, communication, function (response) {
      communication.editing = false;
    });
  }

  $scope.deleteCommunication = function (communication) {
    CommunicationFactory.Communication.delete({id: communication._id}, function () {
      $scope.communication.deleted = true;
    });
  };

  $scope.approveCommunication = function (communication) {
    CommunicationFactory.Communication.approve({id: communication._id}, null, function (response) {
      $scope.communication.approved = true;
    });
  };

  $scope.getMember = function (memberId) {
    return $scope.members.filter(function(o) {
      return o.id == memberId;
    })[0];
  };

  $scope.checkPermission = function (communication) {
    var roles = $scope.me.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(roles.length == 0 && communication.member != $scope.me.id) {
      return false;
    }

    return true;
  }

  $scope.timeSince =function (date) {
    date = new Date(date);
    var seconds = Math.floor((Date.now() - date) / 1000);

    var suffix = 'ago';
    if(seconds < 0){
      seconds = Math.abs(seconds);
      suffix = 'to go';
    }

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years " + suffix;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months " + suffix;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days " + suffix;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours " + suffix;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes " + suffix;
    }
    return Math.floor(seconds) + " seconds " + suffix;
  };

  $scope.convertURLs = function(text) {
    var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    
    return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>");
  }
});