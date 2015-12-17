/*!
 * @filename	: iConfigure ( config.ui.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 16-11-2013
 * 
 * Used by		: config.main.js
 * 
 * It contains ui manipulation logic and methods 
 * for ui layout and the controls ( cstics ) layout formation.
 * It is not being used independently. It is used by config.main.js
 *  
 */

iConfigure.prototype.ui = function( cfg ){
	/**
	 * Options for the ui for initial configuration. 
	 * It takes from options.ui from config.options.js
	 **/
	this.opts 			= cfg.options.ui;
	/**
	 * Main object ie object of config.main
	 **/
	this.cfg 			= cfg;
	/**
	 * $collapsible element where the classTypeGroup will be created.
	 **/
	this.$collapsible 	= $(this.opts.colHeader);
	/**
	 * $controls is the div section where tabs and cstics will be shown.
	 **/
	this.$controls    	= $(this.opts.controlCont);
	/**
	 * $ctrlgroup is the DOM wrapper for cstic elements.
	 **/
	this.$ctrlgroup   	= $(this.opts.controlgroup);
	/**
	 * $rightPanel is the right side div container
	 **/
	this.$rightPanel  	= $(this.opts.rightPanel);
	/**
	 * $ctrlfieldset is the label to show the cstic label.
	 **/
	this.$ctrlfieldset 	= $(this.opts.ctrlfieldset);
	/**
	 * $csticgroup is where the grouping will be shown.
	 * Separated by h3 tag.
	 **/
	this.$csticgroup 	= $(this.opts.csticgroup);
	/**
	 * $tpoles is the total-poles place holder
	 **/
	this.$tpoles 		= $(this.opts.banner.tpoles);
	/**
	 * $cprice is the total-price place holder
	 **/
	this.$cprice		= $(this.opts.banner.cprice);
	/**
	 * $cnum is the current-number place holder
	 **/
	this.$cnum		    = $(this.opts.banner.cnum);
	/**
	 * $dialog is dialog element required for any dialog operation.
	 **/
	this.$dialog		= $(this.opts.msg.dialog);
	/**
	 * $popup is popup element required for any popup operation.
	 **/
	this.$popup		    = $(this.opts.msg.popup);
	/**
	 * $ctxmenu is ctxmenu popup element required for any ctxmenu operation.
	 **/
	this.$ctxmenu		= $(this.opts.ctxmenu);
	
	/**
	 * _init method gets called after the object initialization
	 * to do the initial configuration ie initializing the ui etc.
	 **/
	this._init();	
}
/**
 * This is a prototype pattern to add the members and functionality 
 * in the ui object which is an object of config.
 **/
iConfigure.prototype.ui.prototype = {
	_init: function(){
	
		this.cfg.log('config ui is initialized');
		//this.$popup.popup();
	},
	/**
	 * @param	: int catalogNumber
	 * Sets the catalogNumber to the $cnum element ie. catalogNumber place-holder.
	 **/
	setCatalogNumber: function( catalogNumber ){
		this.$cnum.html( 'Catalog Number: ' + catalogNumber );
	},
	/**
	 * @param	: int price
	 * Sets the current-price to the $cprice element ie. current-price place-holder.
	 **/
	setCurrentPrice: function( price ){
		this.$cprice.html( 'Current Price: $' + (price || 00));
	},
	/**
	 * @param	: int totalPoles
	 * Sets the totalPoles to the $tpoles element ie. totalPoles place-holder.
	 **/
	setTotalPoles: function( totalPoles ){
		this.$tpoles.html( 'Total Poles: ' + totalPoles );
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * This methods creates the edit-box|slider 
	 * if ctrl.number == 50006 then slider otherwise edit-box.
	 **/
	editb: function( ctrl, no ){
		
		var $control = this.getCsticLabel(ctrl);
				
		 if (ctrl.number == 50006) {
			 $control.append( this._createSlider( ctrl, no ));
		 } else {
			 $control.append( this._createEditb( ctrl, no ));
		 }
		 
		 return $control;
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery edit-box element.
	 * It creates the edit-box and binds the event _onCsticValueChange on it
	 **/
	_createEditb: function( ctrl, no ){
		
		return $('<input type="text" name="'+ctrl.label+'" id="basic-0" value="'+ctrl.value+'" data-mini="true"/>')
					.on('focusout', {"self":this, "instanceNo":no, "csticNo":ctrl.number}, this.cfg.cmds._onCsticValueChange)
					.css('text-transform','uppercase');
		
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery slider element.
	 * It creates the slider and binds the event onSliderChange on it
	 **/
	_createSlider: function( ctrl, no ){
				
		return $('<input type="range" value="'+ctrl.value+'" min="0" max="100" data-highlight="true" data-mini="true"/>')		
					.attr({"instanceNo":no, "csticNo":ctrl.number});
		
		
	},
	/**
	 * This is the event which should be called on slider change.
	 * Internally it calls the _onCsticValueChange method to interact 
	 * with server.
	 **/
	onSliderChange: function(){
		
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
	    			//console.log('slidestop is called');
			    	_self.cfg.cmds._onCsticValueChange.call(this, event.call(this));
			    })
			    .on('focusout', function(){
			    	//console.log('focusout is called');
			    	_self.cfg.cmds._onCsticValueChange.call(this, event.call(this));
			    });
	},
	/**
	 * @deprecated	: Deprecated now, will be removed in future.
	 **/
	editb_old: function( ctrl, no ){
		
		var self      = this,
			star 	  = ctrl.required ? ' *' : '',
			selected  = 'selected="selected"',
			style     = self.getCsticStyle(ctrl);
		
		var $control = $('<div><label style="'+style+'" for="'+ctrl.label+'">'+ctrl.label+''+star+'</label></div>');
		
			$('<input type="text" name="'+ctrl.label+'" id="basic-0" value="'+ctrl.value+'" data-mini="true"/>')
				.on('focusout', {"self":self, "instanceNo":no, "csticNo":ctrl.number}, self.cfg.cmds._onCsticValueChange)
				.css('text-transform','uppercase')
				.appendTo($control);
				
		return $control;
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery check-box element.
	 * It creates check-box and binds the event _onCsticValueChange on it
	 **/
	checkb: function( ctrl, no ){
		
		var checked  = this._isChecked(ctrl.value) ? 'checked="checked"' : '',
			star 	 = ctrl.required ? ' *' : '',
			self     = this,
			style    = this.getCsticStyle(ctrl);
	
		var $control = $('<label style="'+style+'" for="'+ctrl.label+'">'+ctrl.label+''+star+'</label>');
		
			$('<input type="checkbox" data-mini="true" name="checkbox-0" '+checked+' value="'+ctrl.value+'" />')
				.on('click', {"self":self, "instanceNo":no, "csticNo":ctrl.number}, self.cfg.cmds._onCsticValueChange)
				.appendTo($control);
			
		return $control;
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery combo-box element.
	 * It creates combo-box and binds the event _onCsticValueChange on it
	 **/
	combob: function( ctrl, no ){
		
		var self = this,
			comboOptions = '',
			star = ctrl.required ? ' *' : '',
			seld = 'selected="selected"',
			style = self.getCsticStyle(ctrl),
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
        
        var $control = $('<div><label style="'+style+'" for="'+ctrl.label+'">'+ctrl.label+''+star+'</label></div>');
        
        $('<select name="'+ctrl.label+'" data-mini="true">'+comboOptions+'</select>')
            .on('change', {"self":self, "instanceNo":no, "csticNo":ctrl.number}, self.cfg.cmds._onCsticValueChange)
            .appendTo($control);
        
		return $control;
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery radio-box element.
	 * It creates radio-box and binds the event _onCsticValueChange on it
	 **/
	radiob: function( ctrl, no ){
		
		var width, l     = ctrl.Value.length, lt,
			star 		 = ctrl.required ? ' *' : '',
			style        = this.getCsticStyle(ctrl),
			ev           = this.hasEmpty(ctrl.Value),
			rqd			 = ctrl.required,
			self         = this;
			
			l  = (l >= 3) && ev ? l - 1 : l;
			lt = l <= 3 ? 'data-type="horizontal"': '';
       
		
    	if (lt !== '') {
    		width = "style='width:" + ( 400 - 50 ) / l + "px;'";
		}
    	
    	var $radioCont = $('<fieldset data-role="controlgroup" '+lt+'/>')
    						.append('<legend style="'+style+'">'+ctrl.label+''+star+'</legend>');    	
    	
    	$.each(ctrl.Value, function( i ){
    		
    		var checked = this.selected ? "checked":false;
    		
           if (this.label.trim() !== '') {
        	   $elem = $('<input '+width+' type="radio" data-mini="true" name="'+this.name+'" />')
        	   				.attr("id", "radio-choice-"+i)
        	   				.attr("checked", checked)
        	   				.on('change', {"self":self, "instanceNo":no, "csticNo":ctrl.number}, self.cfg.cmds._onCsticValueChange);
        	   				
        	   $radioCont.append($elem).append('<label '+width+' '+style+' for="radio-choice-'+i+'">'+this.label+'</label>');
           }         
          
        });        
		return $('<form/>').append($radioCont);
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @return 	: jQuery cstic-lebel element
	 **/
	getCsticLabel: function( ctrl ){
		
		var self      = this,
			star 	  = ctrl.required ? ' *' : '',
			selected  = 'selected="selected"',
			style     = self.getCsticStyle(ctrl);
		
		return $('<div><label style="'+style+'" for="'+ctrl.label+'">'+ctrl.label+''+star+'</label></div>');
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : jQuery combo-box element.
	 * It creates combo-box and binds the event _onCsticValueChange on it
	 **/
	comboe: function( ctrl, no ){
		return this.combob(ctrl, no);
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @param	: int no, instance number
	 * @return  : '' empty string.
	 * For buttonb control is not yet been finalized what to created
	 * So it simply return '' empty string.
	 **/
	buttonb: function( ctrl ){
		console.log('buttonb found  : ', ctrl);
		return '';
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @return  : '' empty string.
	 * For listb control is not yet been finalized what to created
	 * So it simply return '' empty string.
	 **/
	listb: function( ctrl ){
		console.log('listb found  : ', ctrl);
		return '';
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * @return  : '' empty string.
	 * For statusb control is not yet been finalized what to created
	 * So it simply return '' empty string.
	 **/
	statusb: function( ctrl ){
		console.log('statusb found  : ', ctrl);
		return '';
	},
	/**
	 * @param	: Object ctrl, ie cstic 
	 * Radio control comes with so many values apart from true|false.
	 * It is a work-around to set value appropriate value.
	 **/
	getValueToSet: function( ctrl ){
	
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
					self.cfg.warn('Unknown value type in checkbox : ' , ctrl);
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
	_isChecked: function( value ){
		
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
				this.cfg.warn('Unknown value type in checkbox : ' , value);
				break;
		}
		return isChecked;
	},
	/**
	 * @param	: Object ctrl
	 * It returns the cstic css which is to be applied on the cstic based on the options.
	 **/
	getCsticStyle: function( ctrl ){
		
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
	getCsticClass: function( ctrl ){
		
		var csticClass = '';
			// isValueSelected = N and isRequired = Y then label color should be Blue
			csticClass += (ctrl.value.trim() === '' && ctrl.required) ? 'required' : '';
			
			// if conflicted then label color = red and font-weight will be bold
			csticClass += ctrl.conflicted ? 'conflicted':'';
			
		return csticClass;
	},
	/**
	 * @param	: String[] cv, CsticValue
	 * It checks whether the cstic-value is empty or not. 
	 **/
	hasEmpty: function( cv ){
		var i = 0, len = cv.length;
		while ( i < len ) {
			if (cv[i].label.trim() === '') {
				return true;
			}
			i++;
		}
		return false;
	},
	updateCollapsibleHeading: function(){
		
		var activeNode = this.cfg.parentNode;
			if (!activeNode) {
				activeNode = this.cfg.tree.$tree.tree('getSelectedNode');
			}
		
		this.cfg.$palate
			.find('h3.ui-collapsible-heading .ui-btn-text')
						.html('Add components to: '+activeNode.name); 
	},
	/**
	 * @param	: jQuery object $navbar element
	 * This method clears the navbar style. 
	 * This is required while adding one more nav and refreshing again.
	 **/
	clearNavBarStyle: function( $navbar ){
        $navbar.find("*").andSelf().each(function(){
        	
            $(this).removeClass(function(i, cn){
                var matches = cn.match (/ui-[\w\-]+/g) || [];
                return (matches.join (' '));
            });
            if ($(this).attr("class") == "") {
                $(this).removeAttr("class");
            }
        });
        return $navbar;   
    }
}
