'use strict';

angular.module('timelyn.actionFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('Action', function($http, $window, Timeline, Event, Config, $upload) {
  return {

    /**
     *
     */
    back: function() {
      $window.history.back()
    },

    error: function(response) {
      if(response.data.error === 'E_VALIDATION') {
        console.error(response.data.invalidAttributes)
        return response.data.summary
      }
      else {
        console.error(response.data)
        return response.data
      }
    },
    
    /**
     * Save timeline
     *
     * @return {Object} user
     */
    saveTimeline: function(timeline, action, callback) {
      var self = this

      // REST success callback
      var success = function(timeline, response) {
        
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
          }, function(event, response) {
            // Redirect on success
            callback(null, timeline)
          }, failure)
        }
        // Else this is edit
        else {
          // Redirect on success
          callback(null, timeline)
        }
      }

      // REST failure callback
      var failure = function(err) {
        callback(self.error(err))
      }

      // If action is edit
      if(action === 'editTimeline') {
        Timeline.edit(timeline, success, failure);
      }
      // Else action is create
      else if(action === 'createTimeline') {
        Timeline.save(timeline, success, failure);
      }
      else {
        // This shouldn't happen
        console.error('saveTimeline() called in unknown context')
      }
      
    },
    
    /**
     * Save event
     *
     * @param {Object} user
     * @return {Object} user
     */
    saveEvent: function(event, action, callback) {
      var self = this

      // REST success callback
      var success = function(value, responseHeaders) {
        // Redirect on success
        $scope.previewTimeline($scope.timeline.id)
        // Update the model
        $scope.timeline = Timeline.get({id: $routeParams.timelineId})
      }

      // REST failure callback
      var failure = function(err) {
        callback(self.error(err))
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
    },

    /**
     * Delete timeline
     */
    deleteTimeline: function(id, callback) {
      var self = this

      Timeline.delete({ id: id }, function(value, response) {
        // REST success callback
        // @todo add mechanism to delete linked events
        callback(null, response)
      }, function(err) {
        // REST failure callback
        callback(self.error(err))
      })
    },

    /**
     * Upload media
     */
    uploadMedia: function(media, callback) {
      console.log('actionFactory called')
      // var self = this
      // https://github.com/danialfarid/ng-file-upload
      $upload.upload({
          url: Config.app('/media/upload'),
          fields: {
            'credit': media.credit,
            'caption': media.caption
          },
          file: media.file
      }).progress(function(evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
      }).error(function(data, status, headers, config) {
        console.log('File upload error')
        callback(data)
      }).success(function(data, status, headers, config) {
        // .error() doesn't seem to work so check success here
        if(status === 200) {
          callback(null, data)
        }
        else {
          // @todo better errors
          console.error('File upload error')
          console.log(data)
          console.log(status)
          console.log(headers)
          console.log(config)
          callback(data)
        }
      });
    }

  }
});
