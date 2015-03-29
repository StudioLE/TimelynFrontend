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

    // GET JWT
    $http.get(Config.user_url)
      .then(function(response) {
        console.log(response)
        if(response.status === 200) {
          console.log('Recieved JWT')
        }
        else {
          // $scope.errors.push('Login appeared to succeed but something else has gone wrong')
        }
      })
  }

  $scope.check()

}]);