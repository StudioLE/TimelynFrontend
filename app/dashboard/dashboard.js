'use strict';

angular.module('myApp.dashboard', ['ngRoute'])


/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])

/*****************************************************************
*
* DashboardCtrl controlller
*
******************************************************************/
.controller('DashboardCtrl', ['$scope', '$http', '$location', 'Config', function($scope, $http, $location, Config) {
  
  $scope.user = {
    username: 'guest',
    id: null,
    email: null
  }

  $scope.errors = []

  $scope.check = function () {

    $http.defaults.cache = false

    // Send a GET request to the authController
    $http.get(Config.user_url)
      // If success then...
      .success(function(data, status, headers, config) {
        console.log(data)
        console.log(status)
        if(status === 200 && data.user) {
          $location.path('/dashboard')
        }
        else {
          $scope.errors.push('Login appeared to succeed but something else has gone wrong')
        }
      })
      // If error then...
      .error(function(data, status, headers, config) {
        console.log(data)
        console.log(status)
        if(status === 401) {
          $scope.errors.push('Invalid credentials')
        }
        else {
          $scope.errors.push('Login failed for unknown reason')
        }
      });
  }

  $scope.check()

}]);