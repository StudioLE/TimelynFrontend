'use strict';

angular.module('myApp.auth', ['ngRoute'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'auth/login.html',
    controller: 'LoginCtrl'
  });
  $routeProvider.when('/register', {
    templateUrl: 'auth/register.html',
    controller: 'RegisterCtrl'
  });
}])

/*****************************************************************
*
* LoginCtrl controlller
*
******************************************************************/
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Config', function($scope, $http, $location, Config) {

  $scope.errors = []

  $scope.login = function () {
    // Send a POST request to the authController
    $http.post(Config.auth_url, $scope.user)
      // If success then...
      .success(function(data, status, headers, config) {
        if(status === 200 && data.user) {
          $location.path('/dashboard')
        }
        else {
          $scope.errors.push('Login appeared to succeed but something else has gone wrong')
        }
      })
      // If error then...
      .error(function(data, status, headers, config) {
        if(status === 401) {
          $scope.errors.push('Invalid credentials')
        }
        else {
          $scope.errors.push('Login failed for unknown reason')
        }
      });
  }

}])


/*****************************************************************
*
* RegisterCtrl controller
*
******************************************************************/
.controller('RegisterCtrl', ['$scope', '$http', '$location', 'Config', function($scope, $http, $location, Config) {

  $scope.errors = []

  $scope.register = function () {
    // Send a POST request to the authController
    $http.post(Config.auth_url + '/register', $scope.user)
      // If success then...
      .success(function(data, status, headers, config) {
        if(status === 200 && data.user) {
          $location.path('/dashboard')
        }
        else {
          $scope.errors.push('Register appeared to succeed but something else has gone wrong')
        }
      })
      // If error then...
      .error(function(data, status, headers, config) {
        if(status === 401) {
          $scope.errors.push('Invalid credentials')
        }
        else {
          $scope.errors.push('Register failed for unknown reason')
        }
      });
  }

}]);