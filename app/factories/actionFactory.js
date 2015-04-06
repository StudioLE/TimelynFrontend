'use strict';

angular.module('timelyn.actionFactory', ['ngSanitize'])

/*****************************************************************
*
* Action factory
*
******************************************************************/
.factory('Action', function($http, $window, Timeline, Media, Event, Alert, Config, $upload) {
  return {

    /**
     * Go to previous page
     *
     * @return void
     */
    back: function() {
      $window.history.back()
    },

    /**
     * Failure callback [deprecated]
     *
     * @param {Object|String} Error object
     * @param {Function} callback
     */
    failure: function(err, callback) {
      callback(Alert.error(err))
    },

    /**
     * Save timeline
     *
     * @param {Object} timeline
     * @param {String} action
     * @param {Function} callback
     * @return void
     */
    saveTimeline: function(timeline, action, callback) {
      var self = this
      Alert.clear()

      if(action === 'editTimeline') {
        var method = 'edit'
      }
      else if(action === 'createTimeline') {
        var method = 'save'
      }
      else {
        // This shouldn't happen
        console.error('saveTimeline() called in unknown context')
        return false
      }

      async.waterfall([
        function(cb) { // Upload media
          // Delete things we do not need
          delete timeline.era
          delete timeline.date

          if( ! timeline) {
           cb('No data submitted')
          }
          else if(timeline.asset.type === 'upload') {
            // Remove the dataUrl before upload
            console.log(timeline.asset)
            delete timeline.asset.media
            console.log(timeline.asset)
            self.uploadMedia(timeline.asset, function(err, media) {
              if(err) cb(err)
              // Add the id to the timeline
              timeline.asset = media.id
              cb(null, timeline)
            })
          }
          else if(timeline.asset.type === 'url') {
            timeline.asset.media = timeline.asset.url
            Media.save(timeline.asset, function(media, response) {
              // Add the id to the timeline
              timeline.asset = media.id
              // Success so proceed
              cb(null, timeline)
            }, cb)
          }
          else if(action === 'editTimeline' && timeline.asset.type === 'none') {
            // @todo If this is an edit and the user has specifically chosen 'none' then we made need to delete an existing media item
            // For the moment we'll just unattach the item
            timeline.asset = null
            cb(null, timeline)
          }
          else {
            delete timeline.asset
            console.log(timeline)
            cb(null, timeline)
          }
        },
        function(timeline, cb) { // Save/edit timeline
          Timeline[method](timeline, function(timeline, response) {
            // Success so proceed
            cb(null, timeline)
          }, cb)
          // @todo Need to update media with timeline ID
        },
        function(timeline, cb) { // Save first event
          // Skip this if edit
          if(action === 'editTimeline') {
            cb(null, timeline)
          }
          else {
            Event.save({
              "timeline": timeline.id,
              "startDate": timeline.createdAt,
              "endDate": "",
              "headline": "I created my first Timeline using Timelyn",
              "text": "<p>You can put some text here. Why, isn't that pretty...</p>",
              "tag": "",
              "classname": ""
            }, function(event, response) {
              // Success so proceed
              cb(null, timeline)
            }, cb)
          }
        }
      ], function (err, timeline) {
          if(err) Alert.error(err, timeline)
          else callback(null, timeline)
      })
    },

    /**
     * Save event
     *
     * @param {Object} event
     * @param {String} action
     * @param {Function} callback
     * @return void
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
        callback(Alert.error(err))
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
     *
     * @param {Integer} timeline id
     * @param {Function} callback
     * @return void
     */
    deleteTimeline: function(id, callback) {
      Timeline.delete({ id: id }, function(response) {
        // REST success callback
        // @todo add mechanism to delete linked events
        callback(null, response)
      }, Alert.error)
    },

    /**
     * Delete event
     *
     * @param {Integer} timeline id
     * @param {Integer} event id
     * @param {Function} callback
     * @return void
     */
    deleteEvent: function(timelineId, eventId, callback) {
      Event.delete({ id: eventId, timeline: timelineId }, function(response) {
        // REST success callback
        callback(null, response)
      }, Alert.error)
    },

    /**
     * Upload media
     * 
     * @param {Object} media
     * @param {Function} callback
     * @return void
     */
    uploadMedia: function(media, callback) {
      var self = this

      // https://github.com/danialfarid/ng-file-upload
      $upload.upload({
          url: Config.app('/media/upload'),
          fields: media,
          file: media.file
      }).progress(function(evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
      }).error(function(data, status, headers, config) {
        if(_.isNull(data)) Alert.error(null)
        else Alert.error({ data: data.error })
         //callback({ data: data, status: status, headers: headers, config: config})
      }).success(function(data, status, headers, config) {
        callback(null, data)
      });
    },

    /**
     * Render timeline
     * 
     * @param {Object} timeline
     * @return void
     */
    renderTimeline: function(data) {
      var timeline = data;

      // console.debug(timeline)

      // If we've been sent media use it
      if(timeline && timeline.media) timeline.asset = timeline.media

      // Assign defaults to undefined variables
      timeline = _.assign({
        date: [{
            "startDate": "2013-12-10T00:00:00.000Z",
            "headline": "The first event",
            "text": "<p>You can edit the events after the timeline has been saved.</p>",
            "tag": "",
            "classname": ""
          }],
        headline: "Your timeline headline",
        type: "default",
        text: "Some text to introduce your timeline",
        asset: {
          media: "img/placeholder.png",
          credit: "Credit for image author",
          caption: "A short description of the image"
        },
        era: []
      }, timeline)
      
      // Check if there is a file upload
      if(timeline.asset.file) {
        var file = timeline.asset.file[0]
        // If there is an upload and it's and image
        if(file != null && file.type.indexOf('image') > -1) {
          var fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = function(e) {
            // Preview the image by dataURL
            file.dataUrl = e.target.result
            // I can't believe this works
            // Seriously, this may be the coolest code I've ever written
            timeline.asset.media = file.dataUrl
          }
        }
      }

      // console.debug(timeline)

      // Remove existing story from DOM
      var existing = document.getElementById('storyjs-timeline')
      if(existing) existing.parentNode.removeChild(existing)

      // Create new story
      createStoryJS({
        type: 'timeline',
        width: '100%',
        height: '450',
        source: {
          'timeline': timeline
        },
        // embed_id: 'timeline-embed', //OPTIONAL USE A DIFFERENT DIV ID FOR EMBED
        // start_at_end: false, //OPTIONAL START AT LATEST DATE
        // start_at_slide: '4', //OPTIONAL START AT SPECIFIC SLIDE
        // start_zoom_adjust: '3', //OPTIONAL TWEAK THE DEFAULT ZOOM LEVEL
        // hash_bookmark: true, //OPTIONAL LOCATION BAR HASHES
        // font: 'Bevan-PotanoSans', //OPTIONAL FONT
        // debug: true, //OPTIONAL DEBUG TO CONSOLE
        // lang: 'fr', //OPTIONAL LANGUAGE
        // maptype: 'watercolor', //OPTIONAL MAP STYLE
        // css: 'path_to_css/timeline.css', //OPTIONAL PATH TO CSS
        // js: 'path_to_js/timeline-min.js' //OPTIONAL PATH TO JS
      })
    }

  }
})
