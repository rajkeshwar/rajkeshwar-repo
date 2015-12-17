/*!
 * @filename	: Logger ( wireframe.dc.logger.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 06-05-2014
 * 
 * Used by		: All the files
 * 
 * This a common logger build to work in all the 
 * browser irrespective of whether console is undefined 
 * in IE. It is also configurable if the it enabled then 
 * only it logs the messages. It is very useful for debugging 
 * purpose in development and we put in production after dissabling it.
 * 
 */
var Logger = (function(){
	var 
	/**
	 * @param : var-args of params to print on the console.
	 * Logs the debug and log messages on the console
	 **/
	log = function( msg ) {
		Array.prototype.unshift.apply(arguments, ["log"]);
		this.options.logger && this._logger.apply( this, arguments );
	},
	/**
	 * @param : var-args of params to print on the console.
	 * Logs the warning messages on the console prepended with warning icon.
	 **/
	warn = function( msg ) {
		Array.prototype.unshift.apply(arguments, ["warn"]);
		this.options.logger && this._logger.apply( this, arguments );
	},
	/**
	 * @param : var-args of params to print on the console.
	 * Logs the error messages on the console in red color.
	 **/
	error = function( msg ) {
		Array.prototype.unshift.apply(arguments, ["error"]);
		this.options.logger && this._logger.apply( this, arguments );
	},
	/**
	 * 
	 * Custom logger which will work in all the browsers.
	 * Logs the message with the time-stampt.
	 * If the <code>logger = true</code> configured in the options 
	 * then it logs the message on the console. 
	 * Setting logger = false will dissable logger to print message.
	 **/
	_logger = function( logType ){
		
			// Remove first argument
		var args = Array.prototype.slice.apply(arguments, [1]),
		
			// Prepend timestamp
			date = new Date(),
			// time which includes hour:min:seconds and milliseconds
			timestamp = date.getHours() + ":" + date.getMinutes() + ":" +
				  date.getSeconds() + "." + date.getMilliseconds();
		
			args[0] = timestamp + " - " + args[0];
		
		window.console && window.console[logType] && window.console[logType].apply( window.console, args );
	};
	
	return {
		log : log,
		warn : warn,
		error : error
	}
	
})();


