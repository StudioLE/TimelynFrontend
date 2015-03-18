'use strict';

/*****************************************************************
*
* Declare app level module which depends on views, and components
*
******************************************************************/
angular.module('myApp', [
  'ngRoute',
  'navList',
  'myApp.404',
  'myApp.home',
  'myApp.login',
  'myApp.register',
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
  rest_url: 'http://localhost:7425/api',
  auth_url: 'http://localhost:7425/auth/local'
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
}]);
