'use strict';

describe('timelyn.auth module', function() {

  beforeEach(module('timelyn.auth'));

  beforeEach(inject(function($rootScope, $controller, $http, $location, Config, User, localStorageService) {
    var $scope = $rootScope.$new()
    $controller('LoginCtrl', {
      $rootScope: $rootScope,
      $scope: $scope,
      $http: $http,
      $location: $location,
      Config: Config,
      User: User,
      localStorageService: localStorageService
    });
  }))

  it(' should bleed ', function() {
    expect($scope.valueForTest == 'bleed')
  });
});