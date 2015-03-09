'use strict';

angular.module('myApp.timeline', ['ngRoute', 'ngResource', 'ui.bootstrap'])


/*****************************************************************
*
* Route provider
*
******************************************************************/

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/timeline/create', {
		templateUrl: 'timeline/timeline-form.html',
		controller: 'TimelineCtrl',
		resolve: {
			action: function() { return 'createTimeline' }
		}
	});
	$routeProvider.when('/timeline/edit/:timelineId', {
		templateUrl: 'timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: { 
			action: function() { return 'editTimeline' }
		}
	});
	$routeProvider.when('/timeline/event/create/:timelineId', {
		templateUrl: 'timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: { 
			action: function() { return 'createEvent' }
		}
	});
	$routeProvider.when('/timeline/event/:eventId/:timelineId', {
		templateUrl: 'timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: { 
			action: function() { return 'editEvent' }
		}
	});
	$routeProvider.when('/timeline/:timelineId', {
		templateUrl: 'timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: {
			action: function() { return 'previewTimeline' }
		}
	});
	$routeProvider.when('/timeline', {
		templateUrl: 'timeline/timeline-list.html',
		controller: 'TimelineListCtrl'
	});
}])

/*****************************************************************
*
* Timeline factory
*
******************************************************************/
.factory('Timeline', function($resource) {
	return $resource('http://localhost:7425/api/timeline/:id', {}, {
		edit: { method: 'PUT', params: {id: '@id'} }
	});
})

/*****************************************************************
*
* TimelineCtrl controller
*
******************************************************************/
.controller('TimelineCtrl', ['$scope', '$routeParams', 'Timeline', 'Event', '$location', '$window', 'action', function ($scope, $routeParams, Timeline, Event, $location, $window, action) {
	
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
		if( ! $scope.initialise) {
			$location.path('/timeline/create')
		}
		$routeParams.action = 'create'
		$routeParams.timelineId = null
		$scope.edit = false
		$scope.create = true
	};

	// ng-click="previewTimeline(id)"
	$scope.previewTimeline = function(id) {
		if( ! $scope.initialise) {
			$location.path('/timeline/' + id, false);
		}
		$scope.partial = 'events-list'
	};

	// ng-click="editTimeline(id)"
	$scope.editTimeline = function(id) {
		if( ! $scope.initialise) {
			$location.path('/timeline/edit/' + id, false);
		}
		$scope.partial = 'timeline-form'
		$scope.edit = true
		$scope.create = false
	};

	// ng-click="createEvent(id)"
	$scope.createEvent = function(timelineId) {
		if( ! $scope.initialise) {
			$location.path('/timeline/event/create/' + timelineId, false);
		}
		$scope.partial = 'event-form'
		$scope.edit = false
		$scope.create = true
	};

	// ng-click="editEvent(id)"
	$scope.editEvent = function(timelineId, eventId) {
		if( ! $scope.initialise) {
			$location.path('/timeline/event/' + eventId + '/' + timelineId, false);
		}
		$scope.partial = 'event-form'
		$scope.edit = true
		$scope.create = false
		$scope.event = Event.get({id: eventId})
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

		// REST success callback
		var success = function(value, responseHeaders) {
			// Update model on success
			//$scope.timelines.splice(id, 1)
			$scope.timelines = Timeline.query();
			console.log(Timeline.query())
			console.log(value)
			console.log(responseHeaders)
		}

		// REST failure callback
		var failure = function(httpResponse){
			if($scope.errors === undefined) {
				$scope.errors = []
			}
			// Error
			$scope.errors.push(httpResponse);
			console.log('ffs')
		}

		console.log('cunt')

		Timeline.delete({ id: id }, success, failure)
	};

	// ng-click="saveTimeline()"
	$scope.saveTimeline = function() {

		// REST success callback
		var success = function(timeline, responseHeaders) {
			
			// If new timeline then create the first event on it
			if($routeParams.action === 'create') {
				Event.save({
					"timeline": timeline.id,
					"startDate": timeline.createdAt,
					"endDate": "",
					"headline": "I created my first Timeline using SailsTimeline",
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
			$location.path('/timeline/' + timeline.id);
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
		if($routeParams.action === 'edit') {
			Timeline.edit($scope.timeline, success, failure);
		}
		// Else action is create
		else if($routeParams.action === 'create') {
			Timeline.save($scope.timeline, success, failure);
		}
		else {
			// This shouldn't happen
			console.error('saveTimeline() called in unknown context')
		}
		
	};

	// ng-click="saveEvent()"
	$scope.saveEvent = function() {

		// REST success callback
		var success = function(value, responseHeaders) {
			// Redirect on success
			$scope.previewTimeline($scope.timeline.id)
		}

		// REST failure callback
		var failure = function(httpResponse){
			if($scope.errors === undefined) {
				$scope.errors = []
			}
			// Error
			$scope.errors.push(httpResponse);
		}

		// Link the new event with the timeline
		$scope.event.timeline = $scope.timeline.id

		// If action is edit
		if($routeParams.timelineId !== 'create') {
			Event.edit($scope.event, success, failure);
		}
		// Else action is create
		else {
			Event.save($scope.event, success, failure);
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

}])


/*****************************************************************
*
* TimelineListCtrl controller
*
******************************************************************/
.controller('TimelineListCtrl', function($scope, Timeline, $location, $log) {

	// Get all Timelines for list
	$scope.timelines = Timeline.query()

	// ng-click="preview(id)"
	$scope.preview = function(id) {
		$location.path('/timeline/' + id);
	};

	// ng-click="edit(id)"
	$scope.edit = function(id) {
		$location.path('/timeline/edit/' + id);
	};

	// ng-click="delete(id)"
	$scope.delete = function(id) {
		Timeline.delete({ id: id });
		$scope.timelines = Timeline.query();
	};

	// ng-click="create()"
	$scope.create = function() {
		$location.path('/timeline/create');
	};

})
