'use strict';

angular.module('timelyn.timeline.index', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* TimelineSettingsController
*
******************************************************************/
.controller('TimelineIndexController', function($scope, $routeParams, Config, Timeline, Breadcrumb, Path) {

  // ng-click="go(req, timelineId, eventId)"
  $scope.go = Path.go

  // href="route(req, timelineId, eventId)"
  $scope.route = Path.route

  // href="route(req, timelineId, eventId)"
  $scope.getImage = function(asset) {
    if(asset && asset.type === 'upload') {
      return Config.embed_url + asset.media.substr(6)
    }
    return 'img/placeholder.png'
  }

  // Get all Timelines for list
  $scope.timelines = Timeline.query()

  Breadcrumb.default()

})
