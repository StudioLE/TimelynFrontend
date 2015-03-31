'use strict';

angular.module('timelyn.eventFactory', [])

/*****************************************************************
*
* Event factory
*
******************************************************************/
.factory('Event', function($resource, Config) {
  return $resource(Config.url('/event/:id'), {}, {
    edit: { method: 'PUT', params: {id: '@id'} }
  });
})
