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
  // Set edit defaults
  if($routeParams.timelineId) {
    $scope.timeline = Timeline.get({id: $routeParams.timelineId}, function(timeline, response) {
      Action.renderTimeline(timeline)
      $scope.timeline.asset.type = 'unchanged'
    })
    Breadcrumb.set(action, $routeParams.timelineId)
    $scope.edit = true
  }
  // Set create defaults
  else {
    Breadcrumb.set(action)
    $scope.create = true
    $scope.timeline = { asset: { type: 'none' } }
    Action.renderTimeline({})
  }

})
