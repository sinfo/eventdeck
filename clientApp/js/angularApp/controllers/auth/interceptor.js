theToolController.config(function ($httpProvider) {
  $httpProvider.interceptors.push(['$injector', function ($injector) {
    return $injector.get('AuthInterceptor');
  }]);
});

theToolController.factory('AuthInterceptor', function ($location, $window) {
  return {
    responseError: function (response) {
      if (response.status === 401) {
        if($location.path().indexOf('/login') == -1) {
          $location.path('/login');
        }
      }
    }
  };
});
