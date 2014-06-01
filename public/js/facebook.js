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
      $("#loading").show();
      $.ajax(location.href + "/facebook", {
        type: "GET",
        data: {
          id: response.authResponse.userID,
          token: response.authResponse.accessToken
        },
        complete: function (response, status) {
          if (status === "success" && response.responseJSON.success) {
            location.assign(location.href.split("/")[0]);
          }
        }
      });
    }
  });

});
