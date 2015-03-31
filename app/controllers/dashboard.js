'use strict';

angular.module('timelyn.dashboard', ['ngRoute'])


/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'views/dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])

/*****************************************************************
*
* DashboardCtrl controlller
*
******************************************************************/
.controller('DashboardCtrl', function($scope, User, Breadcrumb) {
  
  $scope.user = function() {
    return User.get()
  }

  $scope.errors = []

  Breadcrumb.default()

});
