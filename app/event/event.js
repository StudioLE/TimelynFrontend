'use strict';

angular.module('myApp.event', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/event', {
    templateUrl: 'event/event-list.html',
    controller: 'EventCtrl'
  });
  $routeProvider.when('/event/:id', {
    templateUrl: 'event/event-form.html',
    controller: 'EventSaveCtrl'
  });
}])

.factory('Event', function($resource) {
  return $resource('http://localhost:7425/api/event/:id', {}, {
    edit: { method: 'PUT', params: {id: '@id'} }
  });
})

.controller('EventCtrl', function($scope, Event, $location, $log) {

  // Get all Events for list
  $scope.events = Event.query();

  // ng-click="edit(id)"
  $scope.edit = function(id) {
    $location.path('/event/' + id);
  };

  // ng-click="delete(id)"
  $scope.delete = function(id) {
    Event.delete({ id: id });
    $scope.events = Event.query();
  };

  // ng-click="create()"
  $scope.create = function() {
    $location.path('/event/create');
  };

})

.controller('EventSaveCtrl', ['$scope', '$routeParams', 'Event', '$location', function ($scope, $routeParams, Event, $location) {

  // If action is edit get Event
  if($routeParams.id !== 'create') {
    $scope.event = Event.get({id: $routeParams.id});
  }
  // Else action is create
  else {
    $scope.create = true
  }

  // ng-click="save()"
  $scope.save = function() {

    // REST success callback
    var success = function(value, responseHeaders){
      // Redirect on success
      $location.path('/event');
    }

    // REST failure callback
    var failure = function(httpResponse){
      if($scope.errors === undefined) {
        $scope.errors = []
      }
      // Error
      $scope.errors.push(httpResponse);
    }

    // If action is edit
    if($routeParams.id !== 'create') {
      Event.edit($scope.event, success, failure);
    }
    // Else action is create
    else {
      Event.save($scope.event, success, failure);
    }
    
  };

}]);