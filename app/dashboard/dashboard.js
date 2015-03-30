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
.controller('DashboardCtrl', ['$scope', '$http', '$location', 'Config', 'localStorageService', function($scope, $http, $location, Config, localStorageService) {
  
  $scope.user = {
    username: 'guest',
    id: null,
    email: null
  }

  $scope.errors = []

  $scope.check = function () {

    // Send a get request to test whether the JSON Web Token in local storage is valid
    $http.get(Config.rest_url + '/test/jwt')
      .then(function(response) {
        console.log(response)
        if(response.status === 200) {
          console.log('JWT was accepted')
        }
        else {
          console.log('JWT was not accepted')
        }
      })
  }

  $scope.check()

}]);