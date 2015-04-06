'use strict';

angular.module('timelyn.timeline.event', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* EventController
*
******************************************************************/
.controller('EventController', function ($scope, $routeParams, Timeline, Event, action, Action, Breadcrumb, Path, Alert) {

  // ng-click="saveTimeline()"
  $scope.saveTimeline = function() {
    Action.saveTimeline($scope.timeline, action, function(err, timeline) {
      if( ! err) {
        Alert.set('Timeline created: ' + timeline.headline, 'success')
        // Redirect & update scope
        Path.go([timeline.id])
        $scope.timeline = Timeline.get({id: $routeParams.timelineId})
      }
    })
  }

  // ng-click="saveEvent()"
  $scope.saveEvent = function() {
    Action.saveEvent($scope.event, action, function(err, timeline) {
      if( ! err) {
        // @todo this should be event.headline
        Alert.set('Event created for timeline: ' + timeline.headline, 'success')
        // Redirect & update scope
        Path.go([timeline.id])
        $scope.timeline = Timeline.get({id: $routeParams.timelineId})
      }
    })
  }

  // ng-change="renderTimeline(timeline)"
  $scope.renderTimeline = Action.renderTimeline

  // If there is an event fetch it
  // Set edit defaults
  if($routeParams.eventId) {
    $scope.event = Event.get({id: $routeParams.eventId})
    Breadcrumb.set(action, $routeParams.timelineId, $routeParams.eventId)
    $scope.edit = true
  }
  if($routeParams.timelineId) {
    $scope.edit = true
  }
  // Set create defaults
  else {
    Breadcrumb.set(action, $routeParams.timelineId)
    $scope.create = true
    $scope.event = { asset: { type: 'none' } }
    // Action.renderTimeline({})
  }
  
  // Fetch timeline
  $scope.timeline = Timeline.get({id: $routeParams.timelineId}, function(timeline, response) {
    // @todo Slide to current event using setpos
    Action.renderTimeline(timeline)
    if(action == 'editEvent') {
      // $scope.timeline.asset.type = 'unchanged'
    }
  })

})
