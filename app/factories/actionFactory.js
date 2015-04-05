'use strict';

angular.module('timelyn.actionFactory', ['ngSanitize'])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('Action', function($http, $window, Timeline, Media, Event, Alert, Config, $upload) {
  return {

    /**
     *
     */
    back: function() {
      $window.history.back()
    },

    failure: function(err, callback) {
      callback(Alert.error(err))
    },
    
    /**
     * Save timeline
     *
     * @param {Object} timeline
     * @param {String} action
     * @param {Function} callback
     * @return {Object} user
     */
    saveTimeline: function(timeline, action, callback) {
      var self = this
      Alert.clear()

      // If action is edit
      if(action === 'editTimeline') {
        Timeline.edit(timeline, function(timeline, response) {
          // Success callback
          callback(null, timeline)
        }, failure)
      }
      // Else action is create
      else if(action === 'createTimeline') {
        // If create then we have a series of things to do
        async.waterfall([
          function(cb) { // Upload media
            if( ! timeline) {
             cb('No data submitted')
            }
            else if(timeline.media && timeline.media.type === 'upload') {
              // Remove the dataUrl before upload
              console.log(timeline.media)
              delete timeline.media.media
              console.log(timeline.media)
              self.uploadMedia(timeline.media, function(err, media) {
                if(err) cb(err)
                // Add the id to the timeline
                timeline.asset = media.id
                // Remove media from the object
                delete timeline.media
                cb(null, timeline)
              })
            }
            else if(timeline.media && timeline.media.type === 'url') {
              Media.save(timeline.media, function(media, response) {
                // Add the id to the timeline
                timeline.asset = media.id
                // Remove media from the object
                delete timeline.media
                // Success so proceed
                cb(null, timeline)
              }, cb)
            }
            else {
              delete timeline.media
              delete timeline.asset
              cb(null, timeline)
            }
          },
          function(timeline, cb) { // Save timeline
            Timeline.save(timeline, function(timeline, response) {
              // Success so proceed
              cb(null, timeline)
            }, cb)
            // @todo Need to update media with timeline ID
          },
          function(timeline, cb) { // Save first event
            Event.save({
              "timeline": timeline.id,
              "startDate": timeline.createdAt,
              "endDate": "",
              "headline": "I created my first Timeline using Timelyn",
              "text": "<p>You can put some text here. Why, isn't that pretty...</p>",
              "tag": "",
              "classname": "",
              // "asset": {
              //   "media": "",
              //   "thumbnail": "http://lorempixel.com/32/32/",
              //   "credit": "Credit Name Goes Here",
              //   "caption": "Caption text goes here"
              // }
            }, function(event, response) {
              // Success so proceed
              cb(null, timeline)
            }, cb)
          }
        ], function (err, timeline) {
            if(err) Alert.error(err, timeline)
            else callback(null, timeline)
        })

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
     */
    deleteTimeline: function(id, callback) {
      var self = this

      Timeline.delete({ id: id }, function(value, response) {
        // REST success callback
        // @todo add mechanism to delete linked events
        callback(null, response)
      }, function(err) {
        // REST failure callback
        callback(Alert.error(err))
      })
    },

    /**
     * Upload media
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
         Alert.error({ data: data.error }) 
         //callback({ data: data, status: status, headers: headers, config: config})
      }).success(function(data, status, headers, config) {
        callback(null, data)
      });
    },


    /**
     * Render timeline
     */
    renderTimeline: function(data) {
      var timeline = data;

      // console.log(timeline)

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

      // console.log(timeline)

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
});
