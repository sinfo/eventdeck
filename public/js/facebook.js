$(document).ready(function () {

  $.ajaxSetup({ cache: true });
  $.getScript("//connect.facebook.net/pt_PT/all.js", function(){
    FB.init({
      appId: "457207507744159"
    });
  });

  $("#facebook").click(function() {
    FB.getLoginStatus(function(response) {
      if (response.status === "connected") {
        connected(response);
      }
      else {
        FB.login();
        FB.Event.subscribe("auth.statusChange", function(response) {
          if (response.status === "connected"){
            connected(response);
          }
        });
      }
    });

    function connected(response) {
      var loginInfo = $("#login");

      loginInfo.find("p:eq(0)").text("Logging in...");
      loginInfo.find("p:eq(1)").text("");
      loginInfo.find("i").show();

      loginInfo.show();

      $.ajax(location.origin + "/login/facebook", {
        type: "GET",
        data: {
          id: response.authResponse.userID,
          token: response.authResponse.accessToken
        },
        complete: function (response, status) {
          if (status !== "success") {
            loginInfo.find("p:eq(0)").text("There was an error with your request.");
            loginInfo.find("p:eq(1)").text("Please try again.");
            loginInfo.find("i").hide();
          }
          else if (response.responseJSON.success) {
            loginInfo.find("p:eq(0)").text("Success!");
            loginInfo.find("p:eq(1)").text("Redirecting...");

            location.reload(true);
          }
          else {
            loginInfo.find("p:eq(0)").text("You are not authorized to log in.");
            loginInfo.find("i").hide();
          }
        }
      });
    }
  });

});
