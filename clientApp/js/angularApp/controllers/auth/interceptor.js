theToolController.config(function ($httpProvider) {
  $httpProvider.interceptors.push(['$injector', function ($injector) {
    return $injector.get('AuthInterceptor');
  }]);
});

theToolController.factory('AuthInterceptor', function ($rootScope, $location, $window) {
  return {
    responseError: function (response) {
      $rootScope.nextPath = '#';
      if (response.status === 401) {
        if($location.path().indexOf('/login') == -1) {
          if($location.path() !== '/login'){
            $rootScope.nextPath += $location.path();
          }
          $location.path('/login');
        }
      }
    }
  };
});
