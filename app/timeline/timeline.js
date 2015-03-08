'use strict';

angular.module('myApp.timeline', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/timeline/edit/:timelineId/event/:eventId', {
		templateUrl: 'timeline/timeline-preview.html',
		controller: 'TimelinePreviewCtrl'
	});
	$routeProvider.when('/timeline/:action/:timelineId', {
		templateUrl: 'timeline/timeline-preview.html',
		controller: 'TimelinePreviewCtrl'
	});
	$routeProvider.when('/timeline/:timelineId', {
		templateUrl: 'timeline/timeline-preview.html',
		controller: 'TimelinePreviewCtrl'
	});
	$routeProvider.when('/timeline', {
		templateUrl: 'timeline/timeline-list.html',
		controller: 'TimelineCtrl'
	});
}])

.factory('Timeline', function($resource) {
	return $resource('http://localhost:7425/api/timeline/:id', {}, {
		edit: { method: 'PUT', params: {id: '@id'} }
	});
})

.controller('TimelineCtrl', function($scope, Timeline, $location, $log) {

	// Get all Timelines for list
	$scope.timelines = Timeline.query()

	console.log($scope.timelines)

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

.controller('TimelinePreviewCtrl', ['$scope', '$routeParams', 'Timeline', 'Event', '$location', function ($scope, $routeParams, Timeline, Event, $location) {

	// Get the timeline by routeParam
	$scope.timeline = Timeline.get({id: $routeParams.timelineId});

	// Get all events
	$scope.events = Event.query();

	console.log($routeParams)

	// If action is edit get Timeline
	if($routeParams.timelineId !== 'create') {
		$scope.timeline = Timeline.get({id: $routeParams.timelineId});
		$scope.edit = true
	}
	// Else action is create
	else {
		$scope.create = true
	}

	// Edit Event
	if($routeParams.timelineId && $routeParams.eventId) {
		$scope.event = Event.get({id: $routeParams.eventId});
		$scope.edit = true
		$scope.partial = 'event-form'
	}
	// Edit Timeline
	else if($routeParams.action === 'edit' && $routeParams.timelineId) {
		$scope.edit = true
		$scope.partial = 'timeline-form'
	}
	// Create Timeline
	else if($routeParams.action === 'create') {
		$scope.create = true
		$scope.partial = 'timeline-form'
	}
	// List Events
	else if($routeParams.action === undefined) {

		// Load the event list partial
		$scope.partial = 'events-list'
	}
	// 404
	else {
		console.error('Unknown Timeline action')
	}

	// ng-click="createTimeline()"
	$scope.createTimeline = function() {
		$location.path('/timeline/create');
	};

	// ng-click="previewTimeline(id)"
	$scope.previewTimeline = function(id) {
		$location.path('/timeline/' + id);
	};

	// ng-click="editTimeline(id)"
	$scope.editTimeline = function(id) {
		$location.path('/timeline/edit/' + id);
	};

	// ng-click="deleteTimeline(id)"
	$scope.deleteTimeline = function(id) {
		Timeline.delete({ id: id });
		$scope.timelines = Timeline.query();
	};

	// ng-click="editEvent(id)"
	$scope.editEvent = function(timelineId, eventId) {
		$location.path('/timeline/edit/' + timelineId + '/event/' + eventId);
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
			$location.path('/event');
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
		if($routeParams.timelineId !== 'create') {
			Event.edit($scope.event, success, failure);
		}
		// Else action is create
		else {
			Event.save($scope.event, success, failure);
		}

	};

}])

.controller('TimelineSaveCtrl', ['$scope', '$routeParams', 'Timeline', 'Event', '$location', function ($scope, $routeParams, Timeline, Event, $location) {
		$scope.partial = 'events-form'

	// ng-click="saveTimeline()"
	$scope.saveTimeline = function() {

		// REST success callback
		var success = function(timeline, responseHeaders){
			
			// If new timeline then create the first event on it
			if($routeParams.timelineId === 'create') {
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
		var failure = function(httpResponse){
			if($scope.errors === undefined) {
				$scope.errors = []
			}
			// Error
			$scope.errors.push(httpResponse);
		}

		// If action is edit
		if($routeParams.timelineId !== 'create') {
			Timeline.edit($scope.timeline, success, failure);
		}
		// Else action is create
		else {
			Timeline.save($scope.timeline, success, failure);
		}
		
	};

}]);