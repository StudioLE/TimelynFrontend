'use strict';

angular.module('timelyn.breadcrumbFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('Breadcrumb', function(Path) {
  return {

    /**
     * Default breadcrumbs
     */
    crumbs: [{
      url: '#/timeline',
      title: 'Timelines'
    }],
    
    /**
     * Current breadcrumbs getter
     *
     * @return {Array} breadcrumbs
     */
    get: function() {
      return this.crumbs
    },
    
    /**
     * Current breadcrumbs setter
     *
     * @param {Array} timeline req array
     * @return {Array} breadcrumbs
     */
    set: function(req) {
      var crumbs = []

      switch(req.length - 1) {
        case 2:
          if(req[2] === 'create') {
            crumbs.push({
              url: '#' + Path.form(req),
              title: 'Create Event'
            })
          }
          else if( ! isNaN(req[2])) {
            crumbs.push({
              url: '#' + Path.form(req),
              title: 'Event ' + req[2]
            })
          }
        // No break so cascade
        case 1:
          if(req[1] === 'edit') {
            crumbs.push({
              url: '#' + Path.form(req.slice(0,2)),
              title: 'Edit'
            })
          }
        // No break so cascade
        case 0:
          if(req[0] === 'create') {
            crumbs.push({
              url: '#' + Path.form(req),
              title: 'Create'
            })
          }
          else if( ! isNaN(req[0])) {
            crumbs.push({
              url: '#' + Path.form(req.slice(0,1)),
              title: 'Timeline ' + req[0]
            })
          }
        // No break so cascade
        default:
          crumbs.push({
            url: '#/timeline',
            title: 'Timelines'
          })
      }
      return this.crumbs = crumbs.reverse()
    },
    
    /**
     * Current breadcrumbs setter
     *
     * @param {Array} timeline req array
     * @return {Array} breadcrumbs
     */
    default: function(req) {
      return this.crumbs = [{
        url: '#/timeline',
        title: 'Timelines'
      }]
    }

  }
});
