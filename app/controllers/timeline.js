'use strict'

angular.module('timelyn.timeline', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/timeline', {
    templateUrl: 'views/timeline/timeline-index.html',
    controller: 'TimelineIndexController'
  })
  $routeProvider.when('/timeline/table', {
    templateUrl: 'views/timeline/timeline-index-table.html',
    controller: 'TimelineIndexController'
  })
  $routeProvider.when('/timeline/:timelineId/event/create', {
    templateUrl: 'views/timeline/event-form.html',
    controller: 'EventController',
    resolve: { 
      action: function() { return 'createEvent' }
    }
  })
  $routeProvider.when('/timeline/:timelineId/event/:eventId', {
    templateUrl: 'views/timeline/event-form.html',
    controller: 'EventController',
    resolve: { 
      action: function() { return 'editEvent' }
    }
  })
  $routeProvider.when('/timeline/:timelineId/delete/:eventId', {
    templateUrl: 'views/timeline/confirm-delete.html',
    controller: 'DeleteController',
    resolve: { 
      action: function() { return 'deleteEvent' }
    }
  })
  $routeProvider.when('/timeline/:timelineId/delete', {
    templateUrl: 'views/timeline/confirm-delete.html',
    controller: 'DeleteController',
    resolve: { 
      action: function() { return 'deleteTimeline' }
    }
  })
  $routeProvider.when('/timeline/create', {
    templateUrl: 'views/timeline/timeline-form.html',
    controller: 'TimelineSettingsController',
    resolve: {
      action: function() { return 'createTimeline' }
    }
  })
  $routeProvider.when('/timeline/:timelineId/edit', {
    templateUrl: 'views/timeline/timeline-form.html',
    controller: 'TimelineSettingsController',
    resolve: {
      action: function() { return 'editTimeline' }
    }
  })
  $routeProvider.when('/timeline/:timelineId/publish', {
    templateUrl: 'views/timeline/timeline-publish.html',
    controller: 'TimelinePublishController',
    resolve: {
      action: function() { return 'publishTimeline' }
    }
  })
  $routeProvider.when('/timeline/:timelineId/embed', {
    templateUrl: 'views/timeline/timeline-embed.html',
    controller: 'TimelineEmbedController',
    resolve: {
      action: function() { return 'embedTimeline' }
    }
  })
  $routeProvider.when('/timeline/:timelineId', {
    templateUrl: 'views/timeline/events-index.html',
    controller: 'TimelineDefaultController',
    resolve: {
      action: function() { return 'previewTimeline' }
    }
  })
}])
