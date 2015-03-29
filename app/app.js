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
  user_path: 'https://app.timelyn.io/user',
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
}]);
