/*!
 * @filename	: Utils ( wireframe.dc.utils.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 06-05-2014
 * 
 * Used by		: All the files
 * 
 * This a utils class which contains the utility methods
 * used by all other files in dc.
 * 
 */
var Utils = (function(){
	
	var 
	
	getObjectByKey = function( instance, argkey ){
		
		var retValue;
		$.each(instance, recurse);
		
		function recurse(key, val) {
		    
			if ( argkey === key ) {
				retValue = val;
				return false;
			} 
			else if (val instanceof Object) {
		        $.each(val, recurse);
		    } 
		}
		delete instance;
		return retValue;
	},
	foreach = function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},
	isArraylike = function( obj ) {
		var length = obj.length,
			type = jQuery.type( obj );

		if ( jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.nodeType === 1 && length ) {
			return true;
		}

		return type === "array" || type !== "function" &&
			( length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj );
	};
	
	return {
		get		: getObjectByKey,
		foreach	: foreach
	}
})();