'use strict';

angular.module('timelyn.mediaFactory', [])

/*****************************************************************
*
* Media factory
*
******************************************************************/
.factory('Media', function($resource, Config) {
  return $resource(Config.app('/media/:id'), {}, {
    edit: { method: 'PUT', params: {id: '@id'} }
  })
})
