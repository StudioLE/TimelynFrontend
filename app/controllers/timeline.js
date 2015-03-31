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
	$routeProvider.when('/timeline/edit/:timelineId', {
		templateUrl: 'views/timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: { 
			action: function() { return 'editTimeline' }
		}
	});
	$routeProvider.when('/timeline/event/create/:timelineId', {
		templateUrl: 'views/timeline/timeline.html',
		controller: 'TimelineCtrl',
		resolve: { 
			action: function() { return 'createEvent' }
		}
	});
	$routeProvider.when('/timeline/event/:eventId/:timelineId', {
		templateUrl: 'views/timeline/timeline.html',
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
}])

/*****************************************************************
*
* Timeline factory
*
******************************************************************/
.factory('Timeline', function($resource, Config) {
	return $resource(Config.url('/timeline/:id'), {}, {
		edit: { method: 'PUT', params: {id: '@id'} }
	});
})

/*****************************************************************
*
* Timeline factory
*
******************************************************************/
.factory('Event', function($resource, Config) {
	return $resource(Config.url('/event/:id'), {}, {
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
		action = 'createTimeline'
		if( ! $scope.initialise) {
			$location.path('/timeline/create')
		}
		$routeParams.action = 'create'
		$routeParams.timelineId = null
		$scope.edit = false
		$scope.create = true
	};

	// ng-click="previewTimeline(id)"
	$scope.previewTimeline = function(timelineId) {
		action = 'previewTimeline'
		if( ! $scope.initialise) {
			$location.path('/timeline/' + timelineId, false);
		}
		$scope.partial = 'events-index'
	};

	// ng-click="listTimeline()"
	$scope.listTimelines = function() {
		$location.path('/timeline')
	};

	// ng-click="editTimeline(id)"
	$scope.editTimeline = function(timelineId) {
		action = 'editTimeline'
		if( ! $scope.initialise) {
			$location.path('/timeline/edit/' + timelineId, false);
		}
		$scope.partial = 'timeline-form'
		$scope.edit = true
		$scope.create = false
	};

	// ng-click="createEvent(id)"
	$scope.createEvent = function(timelineId) {
		action = 'createEvent'
		if( ! $scope.initialise) {
			$location.path('/timeline/event/create/' + timelineId, false);
		}
		$scope.partial = 'event-form'
		$scope.edit = false
		$scope.create = true
	};

	// ng-click="editEvent(id)"
	$scope.editEvent = function(timelineId, eventId) {
		action = 'editEvent'
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
		$location.path('/timeline/create');
	};

})
