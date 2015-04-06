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
  'angularFileUpload',
  'alertModule',
  'timelyn.config',
  'timelyn.pages',
  'timelyn.auth',
  'timelyn.dashboard',
  'timelyn.timeline',
  'timelyn.timeline.default',
  'timelyn.timeline.settings',
  'timelyn.actionFactory',
  'timelyn.alertFactory',
  'timelyn.breadcrumbFactory',
  'timelyn.eventFactory',
  'timelyn.mediaFactory',
  'timelyn.pathFactory',
  'timelyn.timelineFactory',
  'timelyn.userFactory'
])

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
* Lodash
*
******************************************************************/
.constant('_', window._)

/*****************************************************************
*
* Location override
*
******************************************************************/
// Implemented to reduce flickr on timeline routes
// disabled because it's causing more problems than it solves

// .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
//     var original = $location.path;
//     $location.path = function (path, reload) {
//         if (reload === false) {
//             var lastRoute = $route.current;
//             var un = $rootScope.$on('$locationChangeSuccess', function () {
//                 $route.current = lastRoute;
//                 un();
//             });
//         }
//         return original.apply($location, [path]);
//     };
// }])

/*****************************************************************
*
* HTTP interceptor
*
******************************************************************/
.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function($q, $location, localStorageService, Config) {
    return {
      request: function(req) {
        // If the request is to the app server
        // Add the JSON Web Token as a param
        if(_.contains(req.url, Config.app_url)) {
          req.params = req.params || {};
          // req.headers = req.headers || {};
          if (localStorageService.get('jwt')) {
            req.params.access_token = localStorageService.get('jwt')
            // req.headers.access_token = localStorageService.get('jwt')
          }
        }
        return req
      }
    }
  })
})
