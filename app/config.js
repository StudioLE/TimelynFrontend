'use strict';

angular.module('timelyn.config', [])

/*****************************************************************
*
* Configuration
*
******************************************************************/
.constant('Config', {
  app_url: 'https://app.timelyn.io',
  embed_url: 'https://embed.timelyn.io',
  app: function(req) {
    return this.app_url + req
  }
})
