'use strict';

angular.module('timelyn.timeline.publish', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* TimelinePublishController
*
******************************************************************/
.controller('TimelinePublishController', function ($scope, $routeParams, Timeline, Event, action, Action, Breadcrumb, Path, Alert) {

  // ng-click="deleteTimeline(id)"
  $scope.publishTimeline = function(id) {
    Action.publishTimeline(id, function(err, timeline) {
      if( ! err) {
        Alert.set('Timeline published: ' + timeline.headline, 'info')
        // Redirect & update scope
        Path.go([timeline.id, 'embed'])
        $scope.timelines = Timeline.query();
      }
    })
  }

  // ng-click="go(req, timelineId, eventId)"
  $scope.go = Path.go

  // href="route(req, timelineId, eventId)"
  $scope.route = Path.route

  // ng-click="back()"
  $scope.back = Action.back

  $scope.timeline = Timeline.get({id: $routeParams.timelineId})

  Breadcrumb.set(action, $routeParams.timelineId)

})
