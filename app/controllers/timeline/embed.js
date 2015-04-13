'use strict';

angular.module('timelyn.timeline.embed', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* TimelineEmbedController
*
******************************************************************/
.controller('TimelineEmbedController', function ($scope, $routeParams, Timeline, Event, action, Action, Breadcrumb, Path, Alert) {

  // ng-click="go(req, timelineId, eventId)"
  $scope.go = Path.go

  // href="route(req, timelineId, eventId)"
  $scope.route = Path.route

  $scope.embedCode = function(ssl) {
    var path
    if(ssl === 'https') {
      path = 'https://embed.timelyn.io/' + $scope.timeline.published.path
    }
    else {
      path = 'http://embed.timelyn.io/' + $scope.timeline.published.path
    }
    $scope.embed.code = '<iframe src="'+path+'" width="100%" height="650" frameborder="0"></iframe>'
  }

  $scope.embed = {
    ssl: 'ssl',
    code: null
  }

  $scope.timeline = Timeline.get({id: $routeParams.timelineId}, function(timeline) {
    console.log(timeline)
    $scope.embedCode('https')
  })

  Breadcrumb.set(action, $routeParams.timelineId)

})
