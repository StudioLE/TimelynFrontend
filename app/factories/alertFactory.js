'use strict';

angular.module('timelyn.alertFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('Alert', function($http, localStorageService, Config) {
  return {

    /**
     * Alerts array
     */
    alerts: [],
    
    /**
     * Alert getter
     *
     * @return  {Object} user
     */
    get: function() {
      return this.alerts
    },
    
    /**
     * Alert setter
     *
     * @param {String} msg
     * @param {String} status
     * @return {Object} user
     */
    set: function(msg, status) {
      if(status === undefined) status = 'info'
      this.alerts.push({ 
        status: status,
        message: msg,
        icon: this.icon(status)
      })
      return this.alerts
    },

    icon: function(status) {
      switch(status) {
        case 'info':
          return 'info-circle'
        break;
        case 'success':
          return 'check-circle'
        break;
        default:
          return 'exclamation-triangle'
      }
    }

  }
});
