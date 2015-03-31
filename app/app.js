'use strict';

/*****************************************************************
*
* Declare app level module which depends on views, and components
*
******************************************************************/
angular.module('timelyn', [
  'ngRoute',
  'LocalStorageModule',
  'navList',
  'timelyn.404',
  'timelyn.home',
  'timelyn.auth',
  'timelyn.dashboard',
  'timelyn.timeline',
  'timelyn.eventFactory',
  'timelyn.timelineFactory',
  'timelyn.userFactory'
])

/*****************************************************************
*
* Configuration
*
******************************************************************/
.constant('Config', {
  app_url: 'https://app.timelyn.io',
  app: function(req) {
    return this.app_url + req
  }
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
