'use strict';

angular.module('timelyn.timeline.default', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* TimelineSettingsController
*
******************************************************************/
.controller('TimelineDefaultController', function ($scope, $routeParams, Timeline, Event, action, Action, Breadcrumb, Path, Alert) {

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

  // ng-change="renderTimeline(timeline)"
  $scope.renderTimeline = Action.renderTimeline

  $scope.partial = 'events-index'

  $scope.timeline = Timeline.get({id: $routeParams.timelineId}, function(timeline, response) {
    $scope.renderTimeline(timeline)
  })
  
  Breadcrumb.set([$routeParams.timelineId])

})