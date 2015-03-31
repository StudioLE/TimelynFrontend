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
.controller('LoginCtrl', function($scope, $http, $location, User) {

  $scope.errors = []

  $scope.login = function () {
    // Send a POST request to the authController
    $http.post(User.url('login'), $scope.user)
      .then(function(response) {
        // If successful then
        if(response.status === 200) {
          // Store the JSON Web Token in local storage
          User.token.set(response.data.token)
          User.fetch()
          $location.path('/dashboard')
        }
        // If errors
        else {
          $scope.errors.push('Invalid credentials')
        }
      })
  }

})

/*****************************************************************
*
* RegisterCtrl controller
*
******************************************************************/
.controller('RegisterCtrl', function($scope, $http, $location, User) {

  $scope.errors = []

  $scope.register = function () {
    // Send a POST request to the authController
    $http.post(User.url('register'), $scope.user)
    .success(function(data, status, headers, config) {
      // If successful then
      if(status === 200) {
        User.token.set(data.token)
        User.fetch()
        $location.path('/dashboard')
      }
      else {
        $scope.errors.push('Register appeared to succeed but something else has gone wrong')
      }
    })
    .error(function(data, status, headers, config) {
      if(data.error === 'E_VALIDATION') {
        $scope.errors.push('2 attributes are invalid')
        console.error(data.invalidAttributes)
      }
      else {
        $scope.errors.push('Registration failed due to unknown error')
        console.error(data)
      }
    })
  }

});
