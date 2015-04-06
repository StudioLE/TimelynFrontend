'use strict';

angular.module('timelyn.timeline.settings', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* TimelineSettingsController
*
******************************************************************/
.controller('TimelineSettingsController', function ($scope, $routeParams, Timeline, Event, action, Action, Breadcrumb, Path, Alert) {

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

  // If there is a timeline fetch it
  if($routeParams.timelineId) {
    $scope.timeline = Timeline.get({id: $routeParams.timelineId})
    $scope.renderTimeline($scope.timeline)
    Breadcrumb.set(action, $routeParams.timelineId)
  }
  else {
    Breadcrumb.set(action)
    // $scope.timeline = null
  }

})
