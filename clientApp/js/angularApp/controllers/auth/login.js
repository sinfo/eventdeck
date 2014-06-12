"use strict";

theToolController.controller("LoginController", function ($scope, $location) {

  //================================INITIALIZATION================================

  $.ajaxSetup({cache: true});
  $.getScript("//connect.facebook.net/pt_PT/all.js", function () {
    FB.init({appId: "457207507744159"});
  });

  var lock = false;
  $scope.redirecting = false;
  
  $scope.banana = false;


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

      $.ajax(url_prefix + "/login/facebook", {
        type: "GET",
        data: {
          id: response.authResponse.userID,
          token: response.authResponse.accessToken
        },
        complete: function (response, status) {
          if ($scope.redirecting) {
            return;
          }

          if (status !== "success") {
            $scope.loginInfo.firstRow = "There was an error with your request.";
            $scope.loginInfo.secondRow = "Please try again.";
            $scope.redirecting = false;

            lock = false;
          }
          else if (response.responseJSON.success) {
            $scope.redirecting = true;

            $scope.loginInfo.firstRow = "Success!";
            $scope.loginInfo.secondRow = "Redirecting...";

            $location.path('/');
          }
          else {
            $scope.loginInfo.firstRow = "You are not authorized to log in.";
            $scope.redirecting = false;

            lock = false;
          }
        }
      });
    }
  };

});
