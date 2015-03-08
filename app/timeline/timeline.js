'use strict';

angular.module('myApp.timeline', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/timeline', {
    templateUrl: 'timeline/timeline-list.html',
    controller: 'TimelineCtrl'
  });
  $routeProvider.when('/timeline/:id', {
    templateUrl: 'timeline/timeline-preview.html',
    controller: 'TimelinePreviewCtrl'
  });
  $routeProvider.when('/timeline/edit/:id', {
    templateUrl: 'timeline/timeline-form.html',
    controller: 'TimelineSaveCtrl'
  });
}])

.factory('Timeline', function($resource) {
  return $resource('http://localhost:7425/api/timeline/:id', {}, {
    edit: { method: 'PUT', params: {id: '@id'} }
  });
})

.controller('TimelineCtrl', function($scope, Timeline, $location, $log) {

  // Get all Timelines for list
  $scope.timelines = Timeline.query()

  console.log($scope.timelines)

  // ng-click="preview(id)"
  $scope.preview = function(id) {
    $location.path('/timeline/' + id);
  };

  // ng-click="edit(id)"
  $scope.edit = function(id) {
    $location.path('/timeline/edit/' + id);
  };

  // ng-click="delete(id)"
  $scope.delete = function(id) {
    Timeline.delete({ id: id });
    $scope.timelines = Timeline.query();
  };

  // ng-click="create()"
  $scope.create = function() {
    $location.path('/timeline/create');
  };

})

.controller('TimelinePreviewCtrl', ['$scope', '$routeParams', 'Timeline', 'Event', '$location', function ($scope, $routeParams, Timeline, Event, $location) {
    $scope.timeline = Timeline.get({id: $routeParams.id});
    $scope.events = Event.query();
    $scope.partial = 'events-list'

}])

.controller('TimelineSaveCtrl', ['$scope', '$routeParams', 'Timeline', 'Event', '$location', function ($scope, $routeParams, Timeline, Event, $location) {

  // If action is edit get Timeline
  if($routeParams.id !== 'create') {
    $scope.timeline = Timeline.get({id: $routeParams.id});
    $scope.edit = true
  }
  // Else action is create
  else {
    $scope.create = true
  }

  // ng-click="save()"
  $scope.save = function() {

    // REST success callback
    var success = function(timeline, responseHeaders){
      
      // If new timeline then create the first event on it
      if($routeParams.id === 'create') {
        Event.save({
          "timeline": timeline.id,
          "startDate": timeline.createdAt,
          "endDate": "",
          "headline": "I created my first Timeline using SailsTimeline",
          "text": "<p>You can put some text here. Why, isn't that pretty...</p>",
          "tag": "",
          "classname": "",
          "asset": {
            "media": "",
            "thumbnail": "http://lorempixel.com/32/32/",
            "credit": "Credit Name Goes Here",
            "caption": "Caption text goes here"
          }
        })
      }

      // Redirect on success
      $location.path('/timeline/preview/' + timeline.id);
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
      Timeline.edit($scope.timeline, success, failure);
    }
    // Else action is create
    else {
      Timeline.save($scope.timeline, success, failure);
    }
    
  };

}]);