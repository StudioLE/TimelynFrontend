'use strict';

angular.module('timelyn.auth', ['ngRoute', 'LocalStorageModule'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/logout', {
    templateUrl: 'views/auth/login.html',
    controller: 'LogoutCtrl'
  });
  $routeProvider.when('/login', {
    templateUrl: 'views/auth/login.html',
    controller: 'LoginCtrl'
  });
  $routeProvider.when('/register', {
    templateUrl: 'views/auth/register.html',
    controller: 'RegisterCtrl'
  });
}])

/*****************************************************************
*
* LogoutCtrl controlller
*
******************************************************************/
.controller('LogoutCtrl', function($scope, $location, User) {

  $scope.errors = []

  $scope.logout = function () {
    User.token.unset()
    User.guest()
    $location.path('/login')
  }

  $scope.logout()

})

/*****************************************************************
*
* LoginCtrl controlller
*
******************************************************************/
.controller('LoginCtrl', function($scope, $http, $location, User, Alert) {

  $scope.errors = []

  $scope.login = function () {
    Alert.clear()

    // Send a POST request to the authController
    $http.post(User.url('login'), $scope.user)
    .success(function(data, status, headers, config) {
      Alert.set('You\'ve been logged in', 'success')
      User.token.set(data.token)
      User.fetch()
      $location.path('/dashboard')
    })
    .error(function(data, status, headers, config) {
      Alert.set(data.error, 'warning')
    })
  }

})

/*****************************************************************
*
* RegisterCtrl controller
*
******************************************************************/
.controller('RegisterCtrl', function($scope, $http, $location, User, Alert) {

  $scope.register = function () {
    Alert.clear()
    
    // Send a POST request to the authController
    $http.post(User.url('register'), $scope.user)
    .success(function(data, status, headers, config) {
      Alert.set('You\'ve been registered', 'success')
      // If successful then
      User.token.set(data.token)
      User.fetch()
      $location.path('/dashboard')
    })
    .error(function(data, status, headers, config) {
      Alert.error({ data: data })
    })
  }

});
