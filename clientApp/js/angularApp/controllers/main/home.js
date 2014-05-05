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
        for (var notification in response){
          if (response[notification].thread/* && response[notification].member != me.id*/){ //uncomment to hide self-events
            $scope.notifications.unshift({
              path: response[notification].thread.replace("-", "/"),
              text: response[notification].description,
              member: members.filter(function(o){
                        return response[notification].member == o.id;
                      })[0].facebook,
              color: (response[notification].unread.indexOf(me.id) != -1 ? "green" : "grey")
            });
          }
        }

        $scope.loading = false;
      });
    });
  });
});
