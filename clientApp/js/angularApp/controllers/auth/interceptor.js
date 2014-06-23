theToolController.config(function ($httpProvider) {
  $httpProvider.interceptors.push(['$injector', function ($injector) {
    return $injector.get('AuthInterceptor');
  }]);
});

theToolController.factory('AuthInterceptor', function ($location, $window) {
  return {
    responseError: function (response) {
      if (response.status === 401) {
        $location.path('/login');
        //$window.location.assign('/#/login');
      }
    }
  };
});
