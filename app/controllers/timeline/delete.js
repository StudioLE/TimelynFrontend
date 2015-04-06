'use strict';

angular.module('timelyn.timeline.delete', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* DeleteController
*
******************************************************************/
.controller('DeleteController', function ($scope, $routeParams, Timeline, Event, action, Action, Breadcrumb, Path, Alert) {

  // ng-click="deleteTimeline(id)"
  $scope.deleteTimeline = function(id) {
    Action.deleteTimeline(id, function(err, timeline) {
      if( ! err) {
        Alert.set('Timeline deleted: ' + timeline.headline, 'info')
        // Redirect & update scope
        Path.go([null])
        $scope.timelines = Timeline.query();
      }
    })
  }
  // ng-click="deleteEvent(timelineId, eventId)"
  $scope.deleteEvent = function(timelineId, eventId) {
    // Alert.set('deleteEvent not yet configured.')
    Action.deleteEvent(timelineId, eventId, function(err, event) {
      if( ! err) {
        Alert.set('Event deleted: ' + event.headline, 'info')
        // Redirect & update scope
        Path.go([timelineId])
        // $scope.timelines = Timeline.query();
      }
    })
  }

  // ng-change="renderTimeline(timeline)"
  $scope.renderTimeline = Action.renderTimeline

  // ng-click="go(req, timelineId, eventId)"
  $scope.go = Path.go

  // href="route(req, timelineId, eventId)"
  $scope.route = Path.route

  // ng-click="back()"
  $scope.back = Action.back

  if(action === 'deleteTimeline') {
    $scope.deleteMode = 'timeline'
    $scope.timeline = Timeline.get({id: $routeParams.timelineId}, function(timeline, response) {
      Action.renderTimeline(timeline)
    })
  }
  else if(action === 'deleteEvent') {
    $scope.deleteMode = 'event'
    $scope.timeline = Timeline.get({id: $routeParams.timelineId}, function(timeline, response) {
      $scope.event = Event.get({id: $routeParams.eventId}, function(event, response) {
        Action.renderTimeline(timeline, event)
      })
    })
  }

  Breadcrumb.set(action, $routeParams.timelineId, $routeParams.eventId)

})
