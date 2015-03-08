'use strict';

function actionDefaults($scope, action) {
	if(action == 'editTimeline') {
		$scope.partial = 'timeline-form'
		$scope.edit = true
		$scope.create = false
	}
	else if(action == 'createTimeline') {
		$scope.partial = 'timeline-form'
		$scope.edit = false
		$scope.create = true
	}
	else if(action == 'previewTimeline') {
		$scope.partial = 'events-list'
	}
	else if(action == 'editEvent') {
		$scope.partial = 'event-form'
		$scope.edit = true
		$scope.create = false
	}
	else if(action == 'createEvent') {
		$scope.partial = 'event-form'
		$scope.edit = false
		$scope.create = true
	}
}

angular.module('myApp.timeline', ['ngRoute', 'ngResource'])


/*****************************************************************
*
* Route provider
*
******************************************************************/

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/timeline/:action/:eventId?/:timelineId', {
		templateUrl: 'timeline/timeline.html',
		controller: 'TimelineCtrl'
	});
	$routeProvider.when('/timeline/:timelineId', {
		templateUrl: 'timeline/timeline.html',
		controller: 'TimelineCtrl'
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
.controller('TimelineCtrl', ['$scope', '$routeParams', 'Timeline', 'Event', '$location', '$window', function ($scope, $routeParams, Timeline, Event, $location, $window) {

	/*************************************************************
	*
	* Load models
	* 
	**************************************************************/

	// If a timeline is specified
	if($routeParams.timelineId !== 'create') {
		// Get the timeline by routeParam
		$scope.timeline = Timeline.get({id: $routeParams.timelineId})
	}

	/*************************************************************
	* 	
	* Router
	* 	
	**************************************************************/

	// Edit Event
	if($routeParams.action === 'event' && $routeParams.eventId) {
		$scope.event = Event.get({id: $routeParams.eventId});
		actionDefaults($scope, 'editEvent')
	}
	// Edit Timeline
	else if($routeParams.action === 'edit' && $routeParams.timelineId) {
		actionDefaults($scope, 'editTimeline')
	}
	// Create Timeline
	else if($routeParams.action === 'create') {
		actionDefaults($scope, 'createTimeline')
	}
	// List Events
	else if($routeParams.action === undefined) {
		actionDefaults($scope, 'previewTimeline')
	}
	// 404
	else {
		console.error('Unknown Timeline action')
	}

	/*************************************************************
	* 	
	* Button actions
	* 	
	**************************************************************/

	// ng-click="back()"
	$scope.back = function(timelineId, eventId) {
		$window.history.back();
	};

	// ng-click="createTimeline()"
	$scope.createTimeline = function() {
		$location.path('/timeline/create', false);
		actionDefaults($scope, 'createTimeline')
	};

	// ng-click="previewTimeline(id)"
	$scope.previewTimeline = function(id) {
		$location.path('/timeline/' + id, false);
		actionDefaults($scope, 'previewTimeline')
	};

	// ng-click="editTimeline(id)"
	$scope.editTimeline = function(id) {
		$location.path('/timeline/edit/' + id, false);
		actionDefaults($scope, 'editTimeline')
	};

	// ng-click="deleteTimeline(id)"
	$scope.deleteTimeline = function(id) {
		Timeline.delete({ id: id });
		$scope.timelines = Timeline.query();
	};

	// ng-click="createEvent(id)"
	$scope.createEvent = function(timelineId) {
		$location.path('/timeline/event/create/' + timelineId, false);
		actionDefaults($scope, 'createEvent')
	};

	// ng-click="editEvent(id)"
	$scope.editEvent = function(timelineId, eventId) {
		$location.path('/timeline/event/' + eventId + '/' + timelineId, false);
		actionDefaults($scope, 'editEvent')
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