'use strict';

angular.module('timelyn.timeline', ['ngRoute', 'ngResource', 'ui.bootstrap'])

/*****************************************************************
*
* Route provider
*
******************************************************************/
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/timeline', {
		templateUrl: 'views/timeline/timeline-index.html',
		controller: 'TimelineListCtrl'
	});
	$routeProvider.when('/timeline/table', {
		templateUrl: 'views/timeline/timeline-index-table.html',
		controller: 'TimelineListCtrl'
	});
	$routeProvider.when('/timeline/create', {
		templateUrl: 'views/timeline/timeline-form.html',
		controller: 'TimelineCtrl',
		resolve: {
			action: function() { return 'createTimeline' }
		}
	});
	$routeProvider.when('/timeline/:timelineId/edit', {
		templateUrl: 'views/timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: { 
			action: function() { return 'editTimeline' }
		}
	});
	$routeProvider.when('/timeline/:timelineId/event/create', {
		templateUrl: 'views/timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: { 
			action: function() { return 'createEvent' }
		}
	});
	$routeProvider.when('/timeline/:timelineId/event/:eventId', {
		templateUrl: 'views/timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: { 
			action: function() { return 'editEvent' }
		}
	});
	$routeProvider.when('/timeline/:timelineId', {
		templateUrl: 'views/timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: {
			action: function() { return 'previewTimeline' }
		}
	});
}])

/*****************************************************************
*
* TimelineCtrl controller
*
******************************************************************/
.controller('TimelineCtrl', function ($scope, $routeParams, Timeline, Event, action, Action, Breadcrumb, Path) {

	/*************************************************************
	* 	
	* Views
	* 	
	**************************************************************/

	// ng-click="createTimeline()"
	$scope.createTimeline = function() {
		action = 'createTimeline'
		if( ! $scope.initialise) {
			Path.go(['create'])
		}
		$routeParams.timelineId = null
		$scope.edit = false
		$scope.create = true
		Breadcrumb.set(['create'])
	};

	// ng-click="previewTimeline(id)"
	$scope.previewTimeline = function(timelineId) {
		action = 'previewTimeline'
		if( ! $scope.initialise) {
			Path.go([timelineId])
		}
		$scope.partial = 'events-index'
		Breadcrumb.set([timelineId])
	};

	// ng-click="listTimeline()"
	$scope.listTimelines = function() {
		Path.go([null])
		Breadcrumb.set([null])
	};

	// ng-click="editTimeline(id)"
	$scope.editTimeline = function(timelineId) {
		action = 'editTimeline'
		if( ! $scope.initialise) {
			Path.go([timelineId, 'edit'])
		}
		$scope.partial = 'timeline-form'
		$scope.edit = true
		$scope.create = false
		Breadcrumb.set([timelineId, 'edit'])
	};

	// ng-click="createEvent(id)"
	$scope.createEvent = function(timelineId) {
		action = 'createEvent'
		if( ! $scope.initialise) {
			Path.go([timelineId, 'event', 'create'])
		}
		$scope.partial = 'event-form'
		$scope.edit = false
		$scope.create = true
		Breadcrumb.set([timelineId, 'event', 'create'])
	};

	// ng-click="editEvent(id)"
	$scope.editEvent = function(timelineId, eventId) {
		action = 'editEvent'
		if( ! $scope.initialise) {
			Path.go([timelineId, 'event', eventId])
		}
		$scope.partial = 'event-form'
		$scope.edit = true
		$scope.create = false
		$scope.event = Event.get({id: eventId})
		Breadcrumb.set([timelineId, 'event', eventId])
	};

	/*************************************************************
	* 	
	* Actions
	* 	
	**************************************************************/

	// ng-click="back()"
	$scope.back = function() {
		Action.back()
	};

	// ng-click="deleteTimeline(id)"
	$scope.deleteTimeline = function(id) {
		Action.deleteTimeline(id, function(err, timeline) {
			if(err) {
				$scope.errors.push(err)
			}
			else {
	      // Redirect & update scope
      	Path.go([null])
        $scope.timelines = Timeline.query();
      }
		})
	};

	// ng-click="saveTimeline()"
	$scope.saveTimeline = function() {
		Action.saveTimeline($scope.timeline, action, function(err, timeline) {
			if(err) {
				$scope.errors.push(err)
			}
			else {
	      // Redirect & update scope
	      Path.go([timeline.id])
	      $scope.timeline = Timeline.get({id: $routeParams.timelineId})
      }
		})
	};

	// ng-click="saveEvent()"
	$scope.saveEvent = function(event) {
		Action.saveEvent(event, action, function(err, timeline) {
			if(err) {
				$scope.errors.push(err)
			}
			else {
	      // Redirect & update scope
	      Path.go([timeline.id])
	      $scope.timeline = Timeline.get({id: $routeParams.timelineId})
      }
    })
	};

	/*************************************************************
	*
	* Initialise
	* 
	**************************************************************/
	
	$scope.errors = []

	if($scope[action] !== undefined) {
		$scope.initialise = true
	}

	// If a timeline is specified
	if($routeParams.timelineId) {
		// Get the timeline by routeParam
		$scope.timeline = Timeline.get({id: $routeParams.timelineId})
	}

	// Call the function defined in $routeProvider
	$scope[action]($routeParams.timelineId, $routeParams.eventId)
	$scope.initialise = false

})


/*****************************************************************
*
* TimelineListCtrl controller
*
******************************************************************/
.controller('TimelineListCtrl', function($scope, Timeline, Path, Breadcrumb) {

	// Get all Timelines for list
	$scope.timelines = Timeline.query()

	// ng-click="preview(timelineId)"
	$scope.preview = function(timelineId) {
		Path.go([timelineId])
	};

	// ng-click="edit(timelineId)"
	$scope.edit = function(timelineId) {
		Path.go([timelineId, 'edit'])
	};

	// ng-click="delete(id)"
	$scope.delete = function(id) {
		Action.deleteTimeline(id, function(err, timeline) {
			if(err) {
				$scope.errors.push(err)
			}
			else {
	      // Redirect & update scope
      	Path.go([null])
        $scope.timelines = Timeline.query();
      }
		})
	};

	// ng-click="create()"
	$scope.create = function() {
		Path.go(['create'])
	};

	Breadcrumb.default()

})
