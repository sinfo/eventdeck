theToolController.config(function ($httpProvider) {
  $httpProvider.interceptors.push(['$injector', function ($injector) {
    return $injector.get('AuthInterceptor');
  }]);
});

theToolController.factory('AuthInterceptor', function ($location) {
  return {
    responseError: function (response) {
      if (response.status === 401) {
        $location.redirect('/');
      }
    }
  };
});
