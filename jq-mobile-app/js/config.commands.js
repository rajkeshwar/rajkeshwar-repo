/*!
 * @filename	: iConfigure ( config.commands.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 25-11-2013
 * 
 * Used by		: config.main.js 
 * 
 * It contains all the server commands as well the ui events.
 * It does the server call after when the event gets fired.
 *  
 */

iConfigure.prototype.cmds = function( cfg ){
	/**
	 * Options for the cmds for initial configuration. 
	 * It takes from options.ui from config.options.js
	 **/
	this.opts = cfg.options.cmds;
	/**
	 * Configuration for the cookie in the options
	 **/
	this.opts.cookie = cfg.options.cookie;
	/**
	 * Main object ie object of config.main
	 **/
	this.cfg = cfg;
	/**
	 * This is a self-executing function to initialize the 
	 * messages which would be shown for error or success.
	 **/
	this.i18en = cfg.options.i18MsgEn;
	/**
	 * _init method gets called after the object initialization
	 * to do the initial configuration ie initializing the cmds.
	 **/
	
	this._init();
}
/**
 * @param	: Object params
 * Calls command 0 with modelName to launch configuration. 
 **/
iConfigure.prototype.cmds.prototype = {
	_init: function(){
		this.cfg.log('config commands are loaded');
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_0: function( data ){
		data = $.extend({}, this.opts.query_data_0, data);
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_17: function( data ){
		data = $.extend({}, this.opts.query_data_17, data);
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_18: function( data ){
		data = $.extend({}, this.opts.query_data_18, data);
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_19: function( data ){
		data = $.extend({}, this.opts.query_data_19, data);
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_20: function( data ){
		data = $.extend({}, this.opts.query_data_20, data);
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_21: function( data ){
		data = $.extend({}, this.opts.query_data_21, data);
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_23: function( data ){
		data = $.extend({}, this.opts.query_data_23, data);
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_33: function( data ){
		data = $.extend({}, this.opts.query_data_33, data);		
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_8: function( data ){
		data = $.extend({}, this.opts.query_data_8, data);	
		return this.httpRequest( data );
	},
	/**
	 * @param	: Object data
	 * It extends the data provided in the configuration 
	 * for the respective command then calls the ajax ie httpRequest. 
	 **/
	command_gcview: function( data ){
		data = $.extend({}, this.opts.query_data_gc, data);	
		return this.httpRequest( data );
	},
	/**
	 * This method is called on every cstic value change.
	 * It calls command 19 and renders the latest changed value 
	 * from the server which reflects in the UI.
	 **/
	_onCsticValueChange: function( event ){
		
		var self 		= event.data.self,
			instanceNo 	= event.data.instanceNo,
			csticNo 	= event.data.csticNo,
			valueToSet  = self.cfg.ui.getValueToSet( this );
	
		self.cfg.cmds.command_19({"instanceNo":instanceNo, "csticNo":csticNo, "newValue": valueToSet})
	    	.then(function( data ){
	    		self.cfg._setEventType( false );
	    		self.cfg.loadInstance( data );
	    			
	    	});
	},
	cookie : function(name, value) {
		var date, option, cookie, i;

		if (value === void(0)) {
			if (document.cookie && document.cookie != '') {
				cookie = document.cookie.split(';');
				name += '=';
				for (i=0; i<cookie.length; i++) {
					cookie[i] = $.trim(cookie[i]);
					if (cookie[i].substring(0, name.length) == name) {
						return decodeURIComponent(cookie[i].substring(name.length));
					}
				}
			}
			return '';
		}

		option = $.extend({}, this.opts.cookie);
		if (value === null) {
			value = '';
			option.expires = -1;
		}
		if (typeof(option.expires) == 'number') {
			date = new Date();
			date.setTime(date.getTime()+(option.expires * 86400000));
			option.expires = date;
		}
		
		var nvalue  = encodeURIComponent(value),
			expires = option.expires.toUTCString(),
			path    = (option.path ? '; path='+option.path : ''),
			domain  = (option.domain ? '; domain='+option.domain : ''),
			secure  = (option.secure ? '; secure' : '');
		
		document.cookie = name+'='+nvalue+'; expires=' + expires + path + domain + secure;
		
		return value;
	},
	/**
	 * Proccess ajax request.
	 * Fired events :
	 * @todo
	 * @example
	 * @todo
	 * @return $.Deferred
	 */
	httpRequest : function( data ) { 
		
		if (data.hasOwnProperty("sessionID")) {
			data["sessionID"] = this.cfg.sessionId
		}
		
//	var dataUrl = data.url || this.cfg.options.base_url;
//		delete data.url;
		
	var self     = this,
		dfrd     = $.Deferred(),
		options  = {
			url      : data.url || this.cfg.options.base_url,
			async    : true,
			type     : 'get',
			dataType : 'json',
			data     : data
		},
		/**
		 * @param	: Object params
		 * Calls command 0 with modelName to launch configuration. 
		 **/
		i18msg = this.i18en,
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
		},
		/**
		 * Error message to be shown on failure callback.
		 *
		 * @param xhr Object  response data
		 * @param status String request status
		 * @param text Array or String with custom error codes
		 * @return Object containing error code and message
		 **/
		getErrorMessage = function( xhr, status, text ){
			
			// If xhr call is success in terms of http but it is failed
			// in terms of application. So it returns the error code and 
			// error message. So no modification is required. Return as it is.
			if( xhr.hasOwnProperty("message")){
				xhr['logType'] = 'warn';
				return xhr;
			}
			
			var contentType = xhr.getResponseHeader("content-type") || '', 
				msgCode, message, logType = 'warn', serverMessage;
			
			// If any exception occure in the server side. Then it returns
			// the html error page. So show custom message in this case.
			if ((contentType.indexOf('html') > -1) || !xhr.responseText.trim()){
				
				msgCode = xhr.status,
				message = i18msg[$.isArray(text) ? text[0] : text],
				serverMessage = i18msg[$.isArray(text) ? text[1] : text];
				logType = 'error';
				
			} else if ( typeof xhr.responseText === "string"){
				
				// In some cases server returns error message in responseText as string
				// but the json format.
				var msgObj = JSON.parse(xhr.responseText),
					xmlObj;
					
					logType = 'error';
					
				if( msgObj.hasOwnProperty("message")){
					msgCode = msgObj.code;
					message = msgObj.message;
					// In some cases the returned json's serverMessage is xml 
					// rather than simple string. This xml contains code, message and serverMessage.
					// So take code, message and serverMessage from this xml and construct the errorMessage object. 
					serverMessage = msgObj.serverMessage !== "null" ? msgObj.serverMessage : ''; 
					
					xmlObj = $(msgObj.serverMessage.replace(/\n/gi, "")).eq(1);
					
					if (xmlObj && (typeof xmlObj === "string") && xmlObj.attr('code')) {
						
						msgCode = xmlObj.attr('code');
						message = xmlObj.attr('message');
						serverMessage = xmlObj.attr('servermessage');
					}
				}
			}
			
			return { 
				code			: msgCode, 
				message			: message, 
				serverMessage	: serverMessage,
				logType 		: logType
			}
		};
				
		self.cfg.log('Request cmd - '+data["command"]+' : ', data);
		self.cfg.options.ajaxLoader && self.cfg.showAjaxLoader( true );
		
		$.ajax(options).fail(error).done(success);
		
		//self.cookie('raj', 'Rajkeshwar');
		//self.cookie('phone', '8880136913');
		
		dfrd.done(function( resp, status, text ) {
			self.cfg.log('Response cmd - '+data["command"]+': ', resp);
			self.cfg.serverData = resp;
			//console.log(self.cookie('raj'));
			//console.log(self.cookie('phone'));
			
		});
		
		dfrd.fail(function( xhr, status, text ) {
		
			var errObj = getErrorMessage( xhr, status, text );
			self.cfg[errObj.logType]('httpRequest xhr: (%o), status: (%o), text: (%o)', xhr, status, text);
			self.cfg.ui.$popup.showInfo( errObj, status, false );
		});
		
		dfrd.always(function( xhr ){
			self.cfg.options.ajaxLoader && self.cfg.showAjaxLoader( false );
		});
		
		return dfrd.promise();
	}
}