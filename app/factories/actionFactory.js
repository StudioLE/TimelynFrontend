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
        function(cb) { // Upload / modify media
          // Delete things we do not need
          delete timeline.era
          delete timeline.date
          self.processMedia(timeline, method, cb)
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
              timeline: timeline.id,
              startDate: timeline.createdAt,
              endDate: '',
              headline: 'I created my first Timeline using Timelyn',
              text: '<p>You can put some text here. Why, isn\'t that pretty...</p>',
              tag: '',
              classname: ''
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
     * @param {Integer} timeline id
     * @param {Function} callback
     * @return void
     */
    saveEvent: function(event, action, timelineId, callback) {
      var self = this
      Alert.clear()

      if(action === 'editEvent') {
        var method = 'edit'
      }
      else if(action === 'createEvent') {
        var method = 'save'
      }
      else {
        // This shouldn't happen
        console.error('saveEvent() called in unknown context')
        return false
      }

      async.waterfall([
        function(cb) { // Upload / modify media
          self.processMedia(event, method, cb)
        },
        function(event, cb) { // Save/edit event
          if(action === 'createEvent') {
            // Link the new event with the timeline
            // @todo We need a backend method to authenticate that the user owns the timeline the event is associated with
            event.timeline = timelineId
          }
          Event[method](event, function(event, response) {
            // Success so proceed
            cb(null, event)
          }, cb)
          // @todo Need to update media with timeline ID
        }
      ], function (err, event) {
          if(err) Alert.error(err, event)
          else callback(null, event)
      })
    },

    /**
     * Publish timeline
     *
     * @param {Integer} timeline id
     * @param {Function} callback
     * @return void
     */
    publishTimeline: function(id, callback) {
      // Send a POST request to the PublishController
      $http.post(Config.app('/timeline/publish'), { id: id })
      .success(function(data, status, headers, config) {
        callback(null, data)
      })
      .error(function(data, status, headers, config) {
        Alert.error({ data: data })
      })
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
     * Process media
     *
     * Given a timeline or event this function will check whether it's
     * media asset should be uploaded or modified.
     *
     * @param {Object} timeline or event
     * @param {String} method
     * @param {Function} callback
     * @return void
     */
    processMedia: function(model, method, cb) {
      if( ! model) {
       cb('No data submitted')
      }
      else if(model.asset.type === 'upload') {
        // Remove the dataUrl before upload
        delete model.asset.media
        this.uploadMedia(model.asset, function(err, media) {
          if(err) cb(err)
          // Add the id to the timeline or event
          model.asset = media.id
          cb(null, model)
        })
      }
      else if(model.asset.type === 'url') {
        model.asset.media = model.asset.url
        Media.save(model.asset, function(media, response) {
          // Add the id to the timeline or event
          model.asset = media.id
          // Success so proceed
          cb(null, model)
        }, cb)
      }
      else if(method === 'edit' && model.asset.type === 'none') {
        // @todo If this is an edit and the user has specifically chosen 'none' then we made need to delete an existing media item
        // For the moment we'll just unattach the item
        model.asset = null
        cb(null, model)
      }
      else {
        delete model.asset
        cb(null, model)
      }
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
     * @param {Object} event
     * @return void
     */
    renderTimeline: function(timeline, event) {

      // If we've been sent media use it
      if(timeline && timeline.media) timeline.asset = timeline.media

      // Assign defaults to undefined variables
      timeline = _.assign({
        date: [{
            startDate: '2013-12-10T00:00:00.000Z',
            headline: 'The first event',
            text: '<p>You can edit the events after the timeline has been saved.</p>',
            tag: '',
            classname: ''
          }],
        headline: 'Your timeline headline',
        type: 'default',
        text: 'Some text to introduce your timeline',
        asset: {
          media: 'img/placeholder.png',
          credit: 'Credit for image author',
          caption: 'A short description of the image'
        },
        era: []
      }, timeline)

      // Check if there is a file upload
      if(timeline.asset.file) {
        var file = timeline.asset.file[0]
        // If there is an upload and it's an image
        if(file && file.type.indexOf('image') > -1) {
          var fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = function(e) {
            // Preview the image by dataURL
            file.dataUrl = e.target.result
            // @todo DO NOT SET file.dataURL(). This is causing the post request to be double the length...
            // I can't believe this works
            // Seriously, this may be the coolest code I've ever written
            timeline.asset.media = file.dataUrl
          }
        }
      }

      if(event) {
        // Sort the events in date order
        timeline.date = _.sortBy(timeline.date, 'startDate')
        // Find which slide number the event is
        var eventIndex = _.findIndex(timeline.date, function(e) {
          return e.id === event.id
        })

        // If the event was not found in the array then add it to the end
        if(eventIndex === -1) {
          // Add a fake id so we can find it again in the future..
          event.id = 'create'
          timeline.date.push(event)
          // Re-sort the events in date order
          timeline.date = _.sortBy(timeline.date, 'startDate')
          // Re-find the slide number the event is
          eventIndex = _.findIndex(timeline.date, function(e) {
            return e.id === event.id
          })
          // @todo Not working for create.. Need to investigate
        }
        else {
          // Overrride the initial event
          timeline.date[eventIndex] = event
        }

        // Add 1 because slide numbers start at 0
        eventIndex ++
      }
      else {
        var eventIndex = null
      }

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
        start_at_slide: eventIndex, //OPTIONAL START AT SPECIFIC SLIDE
        // start_zoom_adjust: '3', //OPTIONAL TWEAK THE DEFAULT ZOOM LEVEL
        // hash_bookmark: true, //OPTIONAL LOCATION BAR HASHES
        // font: 'Bevan-PotanoSans', //OPTIONAL FONT
        // debug: true, //OPTIONAL DEBUG TO CONSOLE
        // lang: 'fr', //OPTIONAL LANGUAGE
        // maptype: 'watercolor', //OPTIONAL MAP STYLE
        // css: 'path_to_css/timeline.css', //OPTIONAL PATH TO CSS
        // js: 'path_to_js/timeline-min.js' //OPTIONAL PATH TO JS
      })
    },

    /**
     * Get Icon for asset
     *
     * Matches from https://github.com/NUKnightLab/TimelineJS/blob/119e2490257a3ddcb94bfbba79aad871ef0c303a/source/js/Core/Media/VMM.MediaType.js
     *
     * @param {Object} asset
     * @param {String} icon
     */
    getIcon: function(asset) {
      if( ! asset) return ''
      if(asset.type === 'upload') return ''
      var d = asset.media
      if(d.match('div class="twitter"')) {
        return 'twitter'
      } else if (d.match('<blockquote')) {
        return 'quote-left'
      } else if (d.match('<iframe')) {
        return 'external-link'
      } else if (d.match('(www.)?youtube|youtu\.be')) {
        return 'youtube'
      } else if (d.match('(player.)?vimeo\.com')) {
        return 'vimeo-square'
      } else if (d.match('(www.)?dailymotion\.com')) {
        return 'video-camera'
      } else if (d.match('(www.)?vine\.co')) {
        return 'vine'
      } else if (d.match('(player.)?soundcloud\.com')) {
        return 'soundcloud'
      } else if (d.match('(www.)?twitter\.com') && d.match('status') ) {
        return 'twitter'
      } else if (d.match('maps.google') && !d.match('staticmap') && !d.match('streetview')) {
        return 'map-marker'
      } else if (d.match(/www.google.\w+\/maps/)) {
        return 'map-marker'
      } else if (d.match('plus.google')) {
        return 'google-plus'
      } else if (d.match('flickr.com/photos/')) {
        return 'flickr'
      } else if (false) {
        return 'instagram'
      } else if (d.match(/jpg|jpeg|png|gif|svg|bmp/i) || 
             d.match('staticmap') || 
             d.match('yfrog.com') || 
             d.match('twitpic.com') ||
             d.match('maps.googleapis.com/maps/api/streetview')) {
        return 'image'
      } else if (false) {
        return 'file-o'
      } else if (d.match('(www.)?wikipedia\.org')) {
        return 'globe'
      } else if (d.indexOf('http://') === 0) {
        return 'external-link'
      } else if (d.match('storify')) {
        return 'book'
      } else {
        return 'question'
      }
    }

  }
})
