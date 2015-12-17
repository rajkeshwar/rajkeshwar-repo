/*!
 * @filename	: httpRequest ( wireframe.dc.httprequest.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 06-05-2014
 * 
 * Used by		: wireframe.dc.main.js 
 * 
 * This is a customized ajax function in which the mediator
 * pattern has been used to track each request-request.
 * This method is the centralized server call. All ajax 
 * call has to pass through its methods like <tt>done</tt>
 * <tt>fail</tt>, <tt>always</tt>. It logs the message for 
 * each request-response. On fail or error the respective 
 * message shown in message popup. It returns a promise object
 * So we can further attach then callback.
 * 
 */

var httpRequest = function( data ) { 

	var self     = this,
		dfrd     = $.Deferred(),
		options  = $.extend({}, {
			url      : "",
			async    : true,
			type     : 'get',
			dataType : 'json',
			data     : {}
		}, data),
		/**
		 * @param	: Object params
		 * Calls command 0 with modelName to launch configuration. 
		 **/
		i18msg = {},
		/**
		 * Request error handler. Reject dfrd with correct error message.
		 *
		 * @param jqxhr  request object
		 * @param String request status
		 * @return void
		 **/
		error = function(xhr, status) {
			var error;
			
			switch (status) {
				case 'abort':
					error = xhr.quiet ? '' : ['errConnect', 'errAbort'];
					break;
				case 'timeout':	    
					error = ['errConnect', 'errTimeout'];
					break;
				case 'parsererror': 
					error = ['errResponse', 'errDataNotJSON'];
					break;
				default:
					if (xhr.status == 403) {
						error = ['errConnect', 'errAccess'];
					} else if (xhr.status == 404) {
						error = ['errConnect', 'errNotFound'];
					} else if (xhr.status == 500) {
						error = ['errConnect', 'errNotFound'];
					} else if (!xhr.responseText.trim()) {
						error = ['errConnect', 'errNotFound'];
					} else {
						error = 'errConnect';
					} 
			}
			
			dfrd.reject( xhr, status, error );
		},
		/**
		 * Request success handler. Valid response data and reject/resolve dfrd.
		 *
		 * @param Object  response data
		 * @param String request status
		 * @return void
		 **/
		success = function( response, xhr, text ) {
			
			if (!response) {
				return dfrd.reject(['errResponse', 'errDataEmpty'], xhr);
			} else if (!$.isPlainObject(response)) {
				return dfrd.reject(['errResponse', 'errDataNotJSON'], xhr);
			} else if (response.error) {
				return dfrd.reject(response.error, xhr);
			} else if (response.code) {
				return dfrd.reject(response, 'error');
			} 

			dfrd.resolve( response, xhr, text );
		};
				
		console.log('Request cmd - '+data["url"]+' : ', data);
		//self.cfg.options.ajaxLoader && self.cfg.showAjaxLoader( true );
		
		$.ajax(options).fail(error).done(success);
		
		dfrd.done(function( resp, status, text ) {
			console.log('Response cmd - '+data["url"]+': ', resp);		
		});
		
		dfrd.fail(function( xhr, status, text ) {		
			console.error("Failed xhr: (%o), status: (%o), text: (%o)", xhr, status, text);
		});
		
		dfrd.always(function( xhr ){
			//self.cfg.options.ajaxLoader && self.cfg.showAjaxLoader( false );
		});
		
		return dfrd.promise();
	}