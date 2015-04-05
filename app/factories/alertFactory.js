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

    /**
     * Alert reset
     *
     * Clear all previous Alerts
     *
     * @return {Array} empty
     */
    clear: function() {
      return this.alerts = []
    },
    
    /**
     * Icon switch
     *
     * Return an appropriate fa icon class for the status
     *
     * @param {String} status
     * @return {String} icon class
     */
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
    },

    /**
     * Parse errors
     *
     * Call on failure of a factory method
     * It checks for E_VALIDATION errors and
     * alerts the user to them.
     *
     * @param {Object} response
     * @return {Object} error
     */
    error: function(response) {
      console.error(response)
      if(_.isString(response)) {
        this.set(response, 'danger')
      }
      // Check if there is a nested validation error
      else if(response.status === 500 && response.data.error === 'E_UNKNOWN' && response.data.raw && response.data.raw[0].err.error === 'E_VALIDATION') {
        // console.log(response.data.raw[0].err.error)
        // Recurse..
        this.error({data: response.data.raw[0].err})
      }
      else if(response.data.error === 'E_VALIDATION') {
        var validation = []
        // For each input that is invalid
        _.each(response.data.invalidAttributes, function(rules, key) {
          // Check which rules it failed
          _.each(rules, function(error) {
            switch(error.rule) {
              case 'required':
                validation.push(key + ' is required')
              break;
              case 'string':
                validation.push(key + ' should contain text')
              break;
              default:
                validation.push(key + rule.message)
                console.error('Unknown validation error for: ' + key)
                console.error(error)
              break;
            }
          })
        })
        // Join and format validation errors
        validation = 'Validation Failed <ul><li>'+validation.join('</li><li>')+'</li></ul>'
        // Set an alert message
        this.set(validation, 'warning')
      }
      else {
        this.set('An unknown error occured', 'warning')
      }
    },

  }
});
