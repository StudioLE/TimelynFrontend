'use strict';

/*****************************************************************
*
* Declare app level module which depends on views, and components
*
******************************************************************/
angular.module('myApp', [
  'ngRoute',
  'LocalStorageModule',
  'navList',
  'myApp.404',
  'myApp.home',
  'myApp.auth',
  'myApp.dashboard',
  'myApp.timeline',
  'myApp.version'
])

/*****************************************************************
*
* Configuration
*
******************************************************************/
.constant('Config', {
  rest_url: 'https://app.timelyn.io',
  auth_url: 'https://app.timelyn.io/auth',
  user_url: 'https://app.timelyn.io/user',
  jwt_path: 'https://app.timelyn.io/user/jwt'
})

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/404'});
}])

/*****************************************************************
*
* Location override
*
******************************************************************/
.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])

/*****************************************************************
*
* HTTP interceptor
*
******************************************************************/
.config(function ($httpProvider) {
  $httpProvider.interceptors.push(['$q', '$location', 'localStorageService', function($q, $location, localStorageService) {
    return {
      request: function(config) {
        config.params = config.params || {};
        // config.headers = config.headers || {};
        if (localStorageService.get('jwt')) {
          config.params.access_token = localStorageService.get('jwt')
          // config.headers.access_token = localStorageService.get('jwt')
        }
        return config;
      },
      // responseError: function(response) {
      //   if(response.status === 401 || response.status === 403) {
      //     $location.path('/signin');
      //   }
      //   return $q.reject(response);
      // }
    };
  }]);
})

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('User', function() {
  return {
    user: false,
    get: function() {
      return this.user
    },
    set: function(user) {
      this.user = user
    }
  }
});

