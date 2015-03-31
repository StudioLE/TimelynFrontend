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
  'timelyn.timeline'
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

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('User', function($http, localStorageService, Config) {
  var User = {
    user: null,
    token: localStorageService.get('jwt'),
    get: function() {
      return this.user
    },
    set: function(user) {
      this.user = user
    },
    fetch: function() {
      $http.get(this.url('current'), {cache: true}).then(function(response) {
        if(response.status === 200) {
          User.user = response.data
        }
        else {
          console.error('JWT not accepted by server')
          console.error(response.data)
          User.user = false
        }
      })
    },
    url: function(req) {
      var path = Config.app_url
      if(req === 'current') {
        return path + '/user/current'
      }
      else if(req === 'register') {
        return path + '/user/register'
      }
      else if(req === 'login') {
        return path + '/auth/login'
      }
      else {
        console.error('Unknown request User.url("' + req + '")')
        return null
      }
    }
  }
  /**
   * Check to see whether a JWT is present in local storage
   * if it is then fetch the user data from the server
   * @return object User 
   */
  var init = function() {
    // If no token then user is not logged in
    if( ! User.token) {
      User.user = false
    }
    else {
      User.fetch()
    }
    return User
  }
  return init()
});