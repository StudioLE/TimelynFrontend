'use strict';

angular.module('timelyn.timeline.event', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* EventController
*
******************************************************************/
.controller('EventController', function ($scope, $routeParams, Timeline, Event, action, Action, Breadcrumb, Path, Alert) {

  // ng-click="saveEvent()"
  $scope.saveEvent = function() {
    Action.saveEvent($scope.event, action, $scope.timeline.id, function(err, event) {
      if( ! err) {
        // @todo this should be event.headline
        // @todo check whether create or edit
        Alert.set('Event created: ' + event.headline, 'success')
        // Redirect & update scope
        Path.go([$routeParams.timelineId, event.id])
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
  // Set create defaults
  else {
    $scope.event = { asset: { type: 'none' } }
    Breadcrumb.set(action, $routeParams.timelineId)
    $scope.create = true
    // Action.renderTimeline({})
  }

  // Fetch timeline
  $scope.timeline = Timeline.get({id: $routeParams.timelineId}, function(timeline, response) {
    // @todo Slide to current event using setpos
    Action.renderTimeline(timeline)
    console.log(timeline)
    if(action == 'editEvent') {
      // $scope.timeline.asset.type = 'unchanged'
    }
  })

})
