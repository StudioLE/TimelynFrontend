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
    console.log(asset)
    if(asset[0] && asset[0].type === 'upload') {
      return Config.embed_url + asset[0].media.substr(6)
    }
    return 'img/placeholder.png'
  }

  // Get all Timelines for list
  $scope.timelines = Timeline.query(function(timelines) {
    console.log(timelines)
  })

  Breadcrumb.default()

})
