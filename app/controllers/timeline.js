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
.controller('TimelineCtrl', function ($scope, $routeParams, Timeline, Event, $location, $window, action, Breadcrumb, Path) {
	
	if($scope[action] !== undefined) {
		$scope.initialise = true
	}

	/*************************************************************
	* 	
	* Views
	* 	
	**************************************************************/

	// ng-click="createTimeline()"
	$scope.createTimeline = function() {
		action = 'createTimeline'
		if( ! $scope.initialise) {
			path.go(['create'])
		}
		$routeParams.action = 'create'
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
	$scope.back = function(timelineId, eventId) {
		$window.history.back();
	};

	// ng-click="deleteTimeline(id)"
	$scope.deleteTimeline = function(id) {
		Timeline.delete({ id: id }, function(value, responseHeaders) {
			// REST success callback
			// Update scope on success
			$scope.timelines = Timeline.query();
			// @todo add mechanism to delete linked events
			
		}, function(httpResponse){
			// REST failure callback
			// Send errors to scope
			if($scope.errors === undefined) {
				$scope.errors = []
			}
			$scope.errors.push(httpResponse)
		})
	};

	// ng-click="saveTimeline()"
	$scope.saveTimeline = function() {

		// REST success callback
		var success = function(timeline, responseHeaders) {
			
			// If new timeline then create the first event on it
			if(action === 'createTimeline') {
				Event.save({
					"timeline": timeline.id,
					"startDate": timeline.createdAt,
					"endDate": "",
					"headline": "I created my first Timeline using Timelyn",
					"text": "<p>You can put some text here. Why, isn't that pretty...</p>",
					"tag": "",
					"classname": "",
					"asset": {
						"media": "",
						"thumbnail": "http://lorempixel.com/32/32/",
						"credit": "Credit Name Goes Here",
						"caption": "Caption text goes here"
					}
				})
			}

			// Redirect on success
			$location.path('/timeline/' + timeline.id, true);
		}

		// REST failure callback
		var failure = function(httpResponse) {
			if($scope.errors === undefined) {
				$scope.errors = []
			}
			// Error
			$scope.errors.push(httpResponse);
		}

		// If action is edit
		if(action === 'editTimeline') {
			Timeline.edit($scope.timeline, success, failure);
		}
		// Else action is create
		else if(action === 'createTimeline') {
			Timeline.save($scope.timeline, success, failure);
		}
		else {
			// This shouldn't happen
			console.error('saveTimeline() called in unknown context')
		}
		
	};

	// ng-click="saveEvent()"
	$scope.saveEvent = function(event) {

		// REST success callback
		var success = function(value, responseHeaders) {
			// Redirect on success
			$scope.previewTimeline($scope.timeline.id)
			// Update the model
			$scope.timeline = Timeline.get({id: $routeParams.timelineId})
		}

		// REST failure callback
		var failure = function(httpResponse){
			if($scope.errors === undefined) {
				$scope.errors = []
			}
			// Error
			$scope.errors.push(httpResponse);
		}

		// If action is edit
		if(action === 'editEvent') {
			Event.edit(event, success, failure);
		}
		// Else action is create
		else if(action === 'createEvent') {
			// Link the new event with the timeline
			event.timeline = $scope.timeline.id
			Event.save(event, success, failure)
		}
		else {
			// This shouldn't happen
			console.error('saveEvent() called in unknown context')
		}

	};

	/*************************************************************
	*
	* Initialise
	* 
	**************************************************************/
	

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
		Timeline.delete({ id: id }, function(value, responseHeaders) {
			// REST success callback
			// Update scope on success
			$scope.timelines = Timeline.query();
			// @todo add mechanism to delete linked events

		}, function(httpResponse){
			// REST failure callback
			// Send errors to scope
			if($scope.errors === undefined) {
				$scope.errors = []
			}
			$scope.errors.push(httpResponse)
		})
	};

	// ng-click="create()"
	$scope.create = function() {
		console.log('fucks sake')
		Path.go(['create'])
	};

	Breadcrumb.default()

})
