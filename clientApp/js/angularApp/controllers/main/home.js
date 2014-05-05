'use strict';

theToolController.controller('home', function ($scope, $http, $sce, NotificationFactory, MemberFactory) {
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.loading = true;
  $scope.notifications = [];

  MemberFactory.Member.get({id: "me"}, function(me){

    MemberFactory.Member.getAll(function(members){

      NotificationFactory.getAll(function(response){
        for (var i = 0, j = response.length; i < j; i++){
          //if (response[i].member != me.id){ //uncomment to hide self-events
          var date = new Date(response[i].posted);
          $scope.notifications.unshift({
            path: response[i].thread.replace("-", "/"),
            text: date.toLocaleDateString("pt-PT") + " - " + date.getHours() + ":" + date.getMinutes() + " -> " + response[i].description,
            member: members.filter(function(o){
                      return response[i].member == o.id;
                    })[0].facebook,
            color: (response[i].unread.indexOf(me.id) != -1 ? "green" : "grey")
          });
          //}
        }

        $scope.loading = false;
      });
    });
  });
});
