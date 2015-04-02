'use strict';

angular.module('timelyn.config', [])

/*****************************************************************
*
* Configuration
*
******************************************************************/
.constant('Config', {
  app_url: 'https://app.timelyn.io',
  app: function(req) {
    return this.app_url + req
  }
})
