'use strict';

angular.module('timelyn.pathFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('Path', function($location) {
  return {
    
    /**
     * Form path from array
     *
     * @param {Array} timeline req array
     * @return {String} path
     */
    form: function(req) {
      if(Array.isArray(req)) {
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
    },
    
    /**
     * Go to path
     *
     * @param {Array} timeline req array
     * @return void
     */
    go: function(req) {
      $location.path(this.form(req))
    }

  }
});
