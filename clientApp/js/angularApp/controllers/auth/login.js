"use strict";

theToolController.controller("LoginController", function ($scope, $location, $http) {

  //================================INITIALIZATION================================
  $scope.banana = true;

  $.ajaxSetup({cache: true});
  $.getScript("//connect.facebook.net/pt_PT/all.js", function () {
    FB.init({appId: "457207507744159"});
  });

  var lock = false;
  $scope.redirecting = false;
  

  //===================================FUNCTIONS===================================

  $scope.login = function () {
    $scope.banana = true;

  	if (lock) {
      return;
    }

    lock = true;

    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        connected(response);
      }
      else {
        FB.login(function () {}, {display: "popup"});
        FB.Event.subscribe("auth.statusChange", function (response) {
          if (response.status === "connected") {
            connected(response);
          }
        });

        lock = false;
      }
    });

    function connected(response) {
      $scope.connected = true;
      $scope.redirecting = true;
      $scope.loginInfo = {};

      $scope.loginInfo.firstRow = "Logging in...";
      $scope.loginInfo.secondRow = "";

      $http.get(url_prefix + '/login/facebook?id='+response.authResponse.userID+'&token='+response.authResponse.accessToken).
        success(function(data, status, headers, config) {
          $location.path('/');
        }).
        error(function(data, status, headers, config) {
          $scope.redirecting = false;
          console.log("ERROR", data);
        });
    }
  };

});
