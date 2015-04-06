'use strict';

angular.module('timelyn.pathFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('Path', function($location) {
  var Path = {}
    
    /**
     * Form path from array
     *
     * @param {Array} timeline req array
     * @return {String} path
     */
    Path.form = function(req) {
      if(_.isArray(req)) {
        var path = []

        switch(req.length - 1) {
          case 2:
            if(req[2] === 'create') {
              path.push('create')
            }
            else if( ! isNaN(req[2])) {
              path.push(req[2])
            }
          // No break so cascade
          case 1:
            if(req[1] === 'edit') {
              path.push('edit')
            }
            else if(req[1] === 'event') {
              path.push('event')
            }
            else if(req[1] === 'delete') {
              path.push('delete')
            }
          // No break so cascade
          case 0:
            if(req[0] === null) {
              return '/timeline'
            }
            else if(req[0] === 'create') {
              path.push('create')
            }
            else if( ! isNaN(req[0])) {
              path.push(req[0])
            }
          break;
          default:
            console.error('Breadcrumb length exceeded expectations')
        }
        return '/timeline/' + path.reverse().join('/')
      }
      return req
    }
    
    /**
     * Get route array from string
     *
     * @param {String} timeline action
     * @return {Array} timeline req
     */
    Path.routeArray = function(req, timelineId, eventId) {
      var route = ''
      switch(req) {
        case 'listTimelines':
          return [null]
        break;
        case 'previewTimeline':
          return [timelineId]
        break;
        case 'createTimeline':
          return ['create']
        break;
        case 'editTimeline':
          return [timelineId, 'edit']
        break;
        case 'deleteTimeline':
          return [timelineId, 'delete']
        break;
        case 'createEvent':
          return [timelineId, 'event', 'create']
        break;
        case 'editEvent':
          return [timelineId, 'event', eventId]
        break;
        case 'deleteEvent':
          return [timelineId, 'delete', eventId]
        break;
        default: 
          console.error('Unknown route', req, timelineId, eventId)
          // return null
        break;
      }
    }
    
    /**
     * Go to named path
     *
     * @param {String} timeline req array
     * @param {Integer} timelineId
     * @param {Integer} eventId
     * @return string
     */
    Path.route = function(req, timelineId, eventId) {
      return Path.form(Path.routeArray(req, timelineId, eventId))
    }
    
    /**
     * Go to path
     *
     * @param {Array|String} timeline req array
     * @param {Integer} timeline id
     * @param {Integer} event id
     * @return void
     */
    Path.go = function(req, timelineId, eventId) {
      if(_.isArray(req)) {
        $location.path(Path.form(req))
      }
      else {
        $location.path(Path.route(req, timelineId, eventId))
      }
    }
  return Path
});
