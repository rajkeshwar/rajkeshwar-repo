/*!
 * @filename	: Controls ( wireframe.dc.controls.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 06-05-2014
 * 
 * Used by		: wireframe.dc.main.js 
 * 
 * It contains all the DC controls creation logic.
 * Each controlInfo will invoke the same named function
 * which returns the similar control with the respective
 * event binded on it.
 * @see			: Return of this function
 * 		EDITB 		: editb,
 * 		CHECKB 		: checkb,
 *		COMBOB 		: combob,
 *		RADIOB 		: radiob,
 *		LISTB 		: listb,
 *		STATUSB 	: statusb,
 *		COMBOE 		: combob,
 *		BUTTONB 	: buttonb
 *  
 */

var Controls = (function(){
	
	var 
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * This methods creates the edit-box|slider 
	 * if ctrl.number == 50006 then slider otherwise edit-box.
	 **/
	editb_old = function( ctrl, no ){
		
		var $control = getCsticLabel(ctrl);
				
		 if (ctrl.number == 50006) {
			 $control.append( _createSlider( ctrl, no ));
		 } else {
			 $control.append( _createEditb( ctrl, no ));
		 }
		 
		 return $control;
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery edit-box element.
	 * It creates the edit-box and binds the event _onCsticValueChange on it
	 **/
	_createEditb_old = function( ctrl, no ){
		var _self = this;
		return $('<input type="text" name="'+ctrl.label+'" id="basic-0" value="'+ctrl.value+'" data-mini="true"/>')
					.on('focusout', {"self":this, "instanceNo":no, "csticNo":ctrl.number}, _onCsticValueChange)
					.css('text-transform','uppercase');
		
	},
	editb = function( ctrl, no ){
		
		var $input =  $('<div data-role="fieldcontain">'+ getCsticLabeln( ctrl ) +
			        '<input type="text" name="'+ctrl.label+'" value="'+ctrl.value+'" data-mini="true" />'+
				'</div>');
		
		$input.find("input")
			.on('focusout', {"self":this, "instanceNo":no, "csticNo":ctrl.number}, _onCsticValueChange)
			.css('text-transform','uppercase');
		
			return $input;
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery slider element.
	 * It creates the slider and binds the event onSliderChange on it
	 **/
	_createSlider = function( ctrl, no ){
				
		return $('<input type="range" value="'+ctrl.value+'" min="0" max="100" data-highlight="true" data-mini="true"/>')		
					.attr({"instanceNo":no, "csticNo":ctrl.number});
		
		
	},
	/**
	 * This is the event which should be called on slider change.
	 * Internally it calls the _onCsticValueChange method to interact 
	 * with server.
	 **/
	onSliderChange = function(){
		
		var _self = this,
			event = function(){
				return event = {
			    		data : {
			    		self: _self,
			    		instanceNo: $(this).attr('instanceno'),
			    		csticNo: $(this).attr('csticno')
		    		}
		    	};
			};
		
	    $('input[data-type="range"]')
	    		.on('slidestop', function(){
	    			console.log('slidestop is called');
			    })
			    .on('focusout', function(){
			    	console.log('focusout is called');
			    });
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery check-box element.
	 * It creates check-box and binds the event _onCsticValueChange on it
	 **/
	checkb = function( ctrl, no ){
		
		//console.log("checkb is called");
		var checked  = _isChecked(ctrl.value) ? 'checked="checked"' : '',
			star 	 = ctrl.required ? ' *' : '',
			self     = this,
			csticClass    = getCsticClass(ctrl);
		var disbld = this.selectable ? '' : 'style="color:#B6B6B6;"';
	
		var $control = $('<label class="'+csticClass+' ellipsis" for="'+ctrl.label+'">'+ctrl.label+''+star+'</label>');
		
			$('<input '+disbld+' type="checkbox" data-mini="true" name="checkbox-0" '+checked+' value="'+ctrl.value+'" />')
				.on('click', {"name":"Rajkeshwar", "title":"Prasad"}, _onCsticValueChange)
				.appendTo($control);
			
		return $control;
		
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery combo-box element.
	 * It creates combo-box and binds the event _onCsticValueChange on it
	 **/
	combob = function( ctrl, no ){
		
		var self = this,
			comboOptions = '',
			star = ctrl.required ? ' *' : '',
			seld = 'selected="selected"',
			csticClass = getCsticClass(ctrl),
			enabledValues   = [],
			dissabledValues = [];
		
        for (var i = 0; i < ctrl.Value.length; i++) {
        	var selcd = ctrl.Value[i].selected ? seld : '';
        	var disbld = ctrl.Value[i].selectable ? '' : 'style="color:#B6B6B6;"';
        	
        	if (ctrl.Value[i].selectable) {
        		enabledValues.push('<option '+selcd+' value="'+ctrl.Value[i].name+'">'+ctrl.Value[i].label+'</option>');
			} else {
				dissabledValues.push('<option '+selcd+' '+disbld+' value="'+ctrl.Value[i].name+'">'+ctrl.Value[i].label+'</option>');
			}
        };
        comboOptions = enabledValues.concat(dissabledValues).join("");
        
        var $control = $('<div data-role="fieldcontain">'+
        		'<label class="'+csticClass+'" for="'+ctrl.label+'">'+ctrl.label+''+star+'</label>'+
        	'</div>');
        
        $('<select name="'+ctrl.label+'" data-mini="true">'+comboOptions+'</select>')
            .on('change', {"self":self, "instanceNo":no, "csticNo":ctrl.number}, _onCsticValueChange)
            .appendTo($control);
        
		return $control;
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery radio-box element.
	 * It creates radio-box and binds the event _onCsticValueChange on it
	 **/
	radiob_old = function( ctrl, no ){
		
		var length       = ctrl.Value.length, layoutType,
			star 		 = ctrl.required ? ' *' : '',
			csticClass   = getCsticClass(ctrl),
			isEmpty      = hasEmpty(ctrl.Value),
			self         = this, layoutWidth = '';
			
			length  = (length >= 3) && isEmpty ? length - 1 : length;
			layoutType = length <= 3 ? 'data-type="horizontal"': '';
       
		
    	if (layoutType !== '') {
    		//layoutWidth = "style='width:" + ( 450 - 50 ) / length + "px;'";
		}
    	
    	var $radioCont = $('<fieldset data-role="controlgroup" '+layoutType+'/>')
    						.append('<legend class="'+csticClass+'">'+ctrl.label+''+star+'</legend>');    	
    	
    	$.each(ctrl.Value, function( i ){
    		
    		var checked = this.selected ? "checked":false;
    		
           if (this.label.trim() !== '') {
        	   $elem = $('<input '+layoutWidth+' type="radio" data-mini="true" name="'+this.name+'" />')
        	   				.attr("id", "radio-choice-"+i)
        	   				.attr("checked", checked)
        	   				.on('change', {"self":self, "instanceNo":no, "csticNo":ctrl.number}, _onCsticValueChange);
        	   				
        	   $radioCont.append($elem).append('<label '+layoutWidth+' class="" for="radio-choice-'+i+'">'+this.label+'</label>');
           }         
          
        });        
		return $('<form/>').append($('<div data-role="fieldcontain"/>').append($radioCont));
	},
	radiob = function( ctrl, no ){
		
		var length       = ctrl.Value.length, layoutType,
			star 		 = ctrl.required ? ' *' : '',
			csticClass   = getCsticClass(ctrl),
			isEmpty      = hasEmpty(ctrl.Value),
			self         = this, layoutWidth;
			
			length  = (length >= 3) && isEmpty ? length - 1 : length;
			layoutType = length <= 3 ? 'data-type="horizontal"': '';
			
			if (layoutType !== '') {
	    		layoutWidth = "style='width:" + ( 450 - 50 ) / length + "px;'";
			}
			
    	var $radioCont = $('<fieldset data-role="controlgroup" '+layoutType+'/>')
    						.append('<legend class="'+csticClass+'">'+ctrl.label+''+star+'</legend>');    	
    	
    	$.each(ctrl.Value, function( i ){
    		
    		var checked = this.selected ? "checked":false;
    		
           if (this.label.trim() !== '') {
        	   $elem = $('<input type="radio" data-mini="true" name="'+this.name+'" />')
        	   				.attr("id", "radio-choice-"+i)
        	   				.attr("checked", checked)
        	   				.on('change', {"self":self, "instanceNo":no, "csticNo":ctrl.number}, _onCsticValueChange);
        	   				
        	   $radioCont.append($elem).append('<label class="" for="radio-choice-'+i+'">'+this.label+'</label>');
           }         
          
        });        
		return $('<form/>').append($('<div data-role="fieldcontain"/>').append($radioCont));
	}
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @return 	: jQuery cstic-lebel element
	 **/
	getCsticLabel = function( ctrl ){
		
		var self      	= this,
			star 	  	= ctrl.required ? ' *' : '',
			selected  	= 'selected="selected"',
			csticClass	= getCsticClass(ctrl);
		
		return $('<div><label class="'+csticClass+'" for="'+ctrl.label+'">'+ctrl.label+''+star+'</label></div>');
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @return 	: jQuery cstic-lebel element
	 **/
	getCsticLabeln = function( ctrl ){
		
		var self      	= this,
			star 	  	= ctrl.required ? ' *' : '',
			selected  	= 'selected="selected"',
			csticClass	= getCsticClass(ctrl);
		
		return '<label class="'+csticClass+'" for="'+ctrl.label+'">'+ctrl.label+''+star+'</label>';
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery combo-box element.
	 * It creates combo-box and binds the event _onCsticValueChange on it
	 **/
	comboe = function( ctrl, no ){
		return combob(ctrl, no);
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : '' empty string.
	 * For buttonb control is not yet been finalized what to created
	 * So it simply return '' empty string.
	 **/
	buttonb = function( ctrl ){
		//console.log('buttonb found  : ', ctrl);
		return '';
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @return  : '' empty string.
	 * For listb control is not yet been finalized what to created
	 * So it simply return '' empty string.
	 **/
	listb = function( ctrl ){
		//console.log('listb found  : ', ctrl);
		return '';
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @return  : '' empty string.
	 * For statusb control is not yet been finalized what to created
	 * So it simply return '' empty string.
	 **/
	statusb = function( ctrl ){
		//console.log('statusb found  : ', ctrl);
		return '';
	},
	_onCsticValueChange = function( evt, data ){
		console.log("_onCsticValueChange evt: (%o), evt.data: (%o)", evt, evt.data);
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * Radio control comes with so many values apart from true|false.
	 * It is a work-around to set value appropriate value.
	 **/
	getValueToSet = function( ctrl ){
	
		var type 		= $(ctrl).attr('type'),
			checked 	= ctrl.checked,
			valueToSet	= ctrl.value,
			self 		= this;
		
		if (type && type === 'checkbox') {
			switch ( ctrl.value ) {
			
				case 'TRUE':
				case 'FALSE': valueToSet = checked ? 'TRUE' : 'FALSE'; break;
					
				case 'YES':
				case 'NO': valueToSet = checked ? 'YES' : 'NO'; break;
				
				case 'T':
				case 'F': valueToSet = checked ? 'T' : 'F'; break;
				
				case 'Y': 
				case 'N': valueToSet = checked ? 'Y' : 'N'; break;
				
				case 1:
				case 0: valueToSet = checked ? 1 : 0; break;
		
				default: 
					console.warn('Unknown value type in checkbox : ' , ctrl);
					valueToSet = ctrl.value;
					break;
			}
		} else if ( type && type == 'radio' ) {
	 		valueToSet = ctrl.name;
	 	} else if ( type && type == 'text' ) {
	 		valueToSet = ctrl.value.toUpperCase();
	 	} 
		
		return valueToSet;
	},
	/**
	 * @param	: String value
	 * Radio control comes with so many values apart from true|false.
	 * It a work-around method to check the radio button and return 
	 * true|false in all possible conditions.
	 **/
	_isChecked = function( value ){
		
		var isChecked = false;
		switch ( value ) {
		
			case 'TRUE':
			case 'YES':
			case 'T':
			case 'Y': 
			case 1: isChecked = true; break;
			
			case 'FALSE': 
			case 'NO': 
			case 'F': 
			case 'N':
			case 0: isChecked = false; break;
	
			default: 
				console.warn('Unknown value type in checkbox : ' , value);
				break;
		}
		return isChecked;
	},
	/**
	 * @param	: Object ctrl
	 * It returns the cstic css which is to be applied on the cstic based on the options.
	 **/
	getCsticStyle = function( ctrl ){
		
		var style = '',
			c = ctrl.conflicted,
			m = ctrl.mandatory,
			r = ctrl.required,
			v = ctrl.value;
			
			// isValueSelected = N and isRequired = Y then label color should be Blue
			style += (v.trim() === '' && r) ? 'color:blue;' : '';
			
			// if conflicted then label color = red and font-weight will be bold
			style += c ? 'font-weight: bold;color:red;':'font-weight: normal;color: #2F3E46;';
			
		return style;
	},
	getCsticClass = function( ctrl ){
		
		var csticClass = '';
			// isValueSelected = N and isRequired = Y then label color should be Blue
			csticClass += (ctrl.value.trim() === '' && ctrl.required) ? 'required' : '';
			
			// if conflicted then label color = red and font-weight will be bold
			csticClass += ctrl.conflicted ? 'conflicted':'';
			csticClass += 'ellipsis';
				
		return csticClass;
	},
	/**
	 * @param	: String[] cv, CsticValue
	 * It checks whether the cstic-value is empty or not. 
	 **/
	hasEmpty = function( cv ){
		var i = 0, len = cv.length;
		while ( i < len ) {
			if (cv[i].label.trim() === '') {
				return true;
			}
			i++;
		}
		return false;
	};
		
	return {
		EDITB 		: editb,
		CHECKB 		: checkb,
		COMBOB 		: combob,
		RADIOB 		: radiob,
		LISTB 		: listb,
		STATUSB 	: statusb,
		COMBOE 		: combob,
		BUTTONB 	: buttonb
	}
	
})();