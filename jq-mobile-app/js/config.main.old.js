/*!
 * @filename	: iConfigure ( config.main.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 16-11-2013
 * 
 * Main class which includes the main functions and instance of 
 * other dependent class. Below are the dependency classes.
 * 
 * config.tree.js    	: Contains the tree related methods.
 * config.ui.js			: Contains ui populate methods.
 * config.commands.js	: Contains all the server commands and ui events
 * config.options.js	: Configurable options are in this section
 * 
 */
;(function( $, window ){
	
	// Main class for the configuarator
	
	window.iConfigure = function( el, options ){
		
		this.options 		= $.extend({}, this.options, {});
		
		this.palateId 		= this.options.palateId,
		this.$palate 		= $(this.palateId),
		this.controlsId 	= this.options.controlsId,
		this.$controls 		= $(this.controlsId);
		
		this.tree    		= new this.tree( this );
		this.ui      		= new this.ui( this );
		this.cmds    		= new this.cmds( this );
		this.tools    		= new this.toolbar( this );
		this.isCreateEvent  = true;
	}

	iConfigure.prototype = {
			
		// Initial setup for the iConfigure class.
		init: function( params ){
			var self = this;
			
			// To convert a word in noun case ie. 
			// first letter in upper-case and remaining in lower-case.
			String.prototype.toViewType = function(){
				return this.substr(0,1) + this.substr(1).toLowerCase();
			}
			
			this.openSession( params ).then(function( data ){
				self.setSessionId( data.sessionID );
				self.setDefaultView(data.View.defaultView.toViewType());
				self.loadInstance( data );
				self._setRootInstance( data );
				delete data;
			});
			
			this.enableAjaxLoader(this.options.ajaxLoader);
			this.log('config main is initialized');
		},	
		/**
		 * @param : var-args of params to print on the console.
		 * Logs the debug and log messages on the console
		 **/
		log : function( msg ) {
			Array.prototype.unshift.apply(arguments, ["log"]);
			this.options.logger && this._logger.apply( this, arguments );
		},
		/**
		 * @param : var-args of params to print on the console.
		 * Logs the warning messages on the console prepended with warning icon.
		 **/
		warn : function( msg ) {
			Array.prototype.unshift.apply(arguments, ["warn"]);
			this.options.logger && this._logger.apply( this, arguments );
		},
		/**
		 * @param : var-args of params to print on the console.
		 * Logs the error messages on the console in red color.
		 **/
		error : function( msg ) {
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
		_logger: function( logType ){
			
				// Remove first argument
			var args = Array.prototype.slice.apply(arguments, [1]),
			
				// Prepend timestamp
				dt = new Date(),
				// time which includes hour:min:seconds and milliseconds
				tag = dt.getHours() + ":" + dt.getMinutes() + ":" +
						dt.getSeconds() + "." + dt.getMilliseconds();
			
				args[0] = tag + " - " + args[0];
			
			window.console && window.console[logType] && window.console[logType].apply( window.console, args );
		},
		/**
		 * @param	: Takes boolean value.
		 * Enable or disable processing whenever there is an ajax call.
		 * Processing icon shows at ajax start and stops at ajax stop.
		 * <code>ajaxLoader = true</code> in config.options.js will enable the loader.
		 **/
		enableAjaxLoader: function( flag ){
			if ( flag ) {
				$(document).ajaxStart(function(){
			        $.mobile.loading( 'show' );
			    }).ajaxComplete(function(){
			        $.mobile.loading( 'hide' );
			    });
			}		
		},
		showAjaxLoader: function( flag ){
			$.mobile.loading( flag ? 'show' : 'hide' );		
		},
		/**
		 * @param	: String viewType can be Config or Electrical
		 * Setting the defaultViewType which will be needed for future checking.
		 **/
		setDefaultView: function( viewType ){
			this.viewType = viewType;
		},
		/**
		 * @param	: String sessionId 
		 * It will be obtained at the first call while opening session 
		 * ie launching configuraion. We required it for further calls.
		 **/
		setSessionId: function( sessionId ){
			this.sessionId = sessionId;		
		},
		/**
		 * @param	: Object params
		 * Calls command 0 with modelName to launch configuration. 
		 **/
		openSession: function( params ){		
			return this.cmds.command_0( params );
		},
		/**
		 * @param	: Object params
		 * Calls command 0 with modelName to launch configuration. 
		 **/
		_setRootInstance: function( instance ){
			this.rootInstance = instance;
		},
		_setEventType: function( eventType ){
			this.isCreateEvent = eventType;
		},
		setAddComponentTo: function( parentNode ){
			this.parentNode = parentNode;
		},
		/**
		 * @param	: Object tabInfo 
		 * Takes response from the server as json at command 0 
		 * and forms the cstics, tree-node and child-types
		 **/
		loadInstance: function( tabInfo ){
			//debugger;
			var instance     = tabInfo.ModelChanges[ this.viewType ],		
				createdIns   = instance.Created.Instance || [],
				modifiedIns  = instance.Modified.Instance || [],
				deletedIns   = instance.Deleted.Instance || [];
		
		    var self    = this,
		    	cLen    = createdIns.length,
		    	mLen    = modifiedIns.length,
		    	dLen    = deletedIns.length;
		    
		    for ( var i = 0; i < cLen; i++) {		    	

				this._createInstance(createdIns[i]);
			}
		   
		    for ( var i = 0; i < mLen; i++) {
		    	
		    	self._modifyInstance( modifiedIns[i], true );
			}
		    
		    for ( var i = 0; i < dLen; i++) {
		    	this.warn("Got deleted instance : ", deletedIns);
		    	self._deleteInstance(deletedIns[i]);
			}
		    
		    this.ui.setCurrentPrice(tabInfo.epmPrice.value);
		    this.ui.updateCollapsibleHeading();
		},
		/**
		 * @param	: boolean csticGroup
		 * @param	: boolean csticGroup 
		 * @param	: boolean rightPanel
		 * If any boolean value is true, it makes that div 
		 * section empty. So that the new data received from
		 * the server can be rendered again in the view.
		 **/
		_clearPanels: function(csticGroup, cstics, rightPanel){
			
			if (csticGroup) {
				this.ui.$csticgroup.find('ul').empty();
			}
			if (cstics) {				
			    this.ui.$csticgroup.find('tr').empty();
			}
			if (rightPanel) {
				 this.ui.$rightPanel.empty();  
			}
		},
		/**
		 * @param	: Array vcg, valid cstic group
		 * 			  Backend response comes with $-APPLICATION and all cstics 
		 * 			  group will be empty. Only one cstic group will have cstics. 
		 * 			  That is the first tab. But it wouldn't always comes in the 
		 * 			  same sequence. So we have to find the valid cstic group.
		 * @param	: Array cb, CsticBox. Cstics is grouped within the CsticBox.
		 * @param	: Object instance. The root level instance required to take 
		 * 			  the instance number.
		 **/
		createCsticGroups: function( vcg, cb, instance ){
			
		    this.createControlTabs( vcg, instance.number );
		    this.ui.$rightPanel.append(this.ui.$csticgroup);
		   
		    // loading the tab content for the first tab
		    this.ui.$controls.empty();	    
		    this.createCstics( cb, instance.number );
		},
		/**
		 * @param	: Array instance, Array of created instance. 
		 * 			  If the instType="P". Then it is complex product
		 * 			  and it should comes in the tab. So this method 
		 * 			  adds the instance in the tab. Instead of adding 
		 * 			  it in the tree node.
		 **/
		addAccessories: function( instance ){
			
			var cLen = instance.length, self = this;
			for ( var i = 0; i < cLen; i++) {
				self._createAccessories(instance[i]);
			}
		},
		/**
		 * @param   : Array instance. Array of created instance.
		 * 	It is the root level array of created instance. It creates 
		 *  the tree-node, class-type, tabs, cstic-groups and cstics.
		 *  It also checks instType="P" then the instance created as 
		 *  accessories and got added to the tab. If instType="I"
		 *  or instType="I". Then it is created as tree-node.
		 **/
		_createInstance: function( instance ){
			
			var cg  = this.getFirstCsticGroup(instance),
				label = instance.description,
				vcg = this.getAllCsticGroups(instance),
				ctg = instance.ClassTypeGroup || [],
				cb  = cg && cg.CsticBox || [],
				no 	= instance.number;
			
			if (instance.instType === 'P' && instance.part) {
				
				this.tree.setTreeData(instance);
				this._createAccessories(instance);
				return;
			} else if((instance.instType === 'I' || instance.instType === 'C') 
						|| (instance.instType === 'P' && !instance.part)){
				
				if (!this.isCreateEvent) {
					console.log('changed event is found');
					this.tree.addTreeNode( instance, false );	
					return;
				} else {
					this._clearPanels(true, true, false);
					this.tree.addTreeNode( instance, true );					
					this.createCsticGroupLabel(label, true, no);
					
				}
			}
			
	    	this.createClassTypeLabel( ctg, instance );
	    	this.createCsticGroups( vcg, cb, instance );
	    	
		},
		/**
		 * @param	: Object data. Received from the server
		 * @param	: Object instance. Tree cached instance data
		 * @param	: Object accessories. Tree cached accessories data
		 * 			  This method is called on toggling between the nodes
		 * 			  of the tree. On toggling it calls command-33 and gets
		 * 			  the tree-data, tab-data and cstic-data. But it wouldn't 
		 * 			  get the data for the classTypeGroup and instance as part.
		 * 			  ie. instType="P". So it cached these data while configuration
		 * 			  and while toggling it gets these data from the tree cache and 
		 * 			  forms the controls.
		 **/
		toggleInstance: function( data, instance, accessories ){
			
			var o   = data.detailView.Instance,
				ctg = instance && instance.ClassTypeGroup || [],
				label = o.description;
		
        	var cg  = this.getFirstCsticGroup(o),
        		vcg = this.getAllCsticGroups(o),
	        	ct  = o.ClassTypeGroup,
	        	cb  = cg && cg.CsticBox || [];
        	
        	this._clearPanels(true, true, false);
        	
        	if (instance) {
        		this.createCsticGroupLabel(label, true, instance.number);
			}
        	
        	this.createClassTypeLabel( ctg, instance );
        	this.createCsticGroups( vcg, cb, o );
        	
        	if (accessories && (accessories.instType === 'P')) {
    			
    			this._createAccessories( accessories );    			
    		}
        	this.ui.updateCollapsibleHeading();
		},
		/**
		 * @param	: Array classTypeGroup.
		 * Sets the classTypeGroup to the main config instance.
		 **/
		setActiveClassTypeGroup: function( classTypeGroup ){
			this.classTypeGroup = classTypeGroup;
		},
		/**
		 * @param	: Object instance
		 * It creates the accessories ie the instance is got
		 * added as tab for instType="P".
		 **/
		_createAccessories: function( instance ){
			
			var self  = this,
				label = instance.description;
			
			var $listItem = $('<li><a href="#">'+label+'</a></li>')
									.attr('id', instance.number);
			
			$listItem.on('click', {"instanceNo":instance.number }, function(event){
				
				self.cmds.command_33(event.data)
	        		.then(function( data ){
	        		
	        		var ins = data.detailView.Instance,
	        			no	= data.detailView.instance,
	        			type = ins.instType,
	        			cg  = self.getFirstCsticGroup(ins),
		        		vcg = self.getAllCsticGroups(ins),
			        	ct  = ins.ClassTypeGroup,
			        	cb  = cg && cg.CsticBox || [];
	                
	                	self._clearPanels(false, true, false);
	                	self.createCsticGroups( vcg, cb, ins );	
	            });
			});
			
			this.ui.$csticgroup.find('ul').append($listItem);
			this.ui.$csticgroup.find('div[data-role="navbar"]').navbar().navbar('destroy').navbar();			
			
		},
		/**
		 * @param	: String label. label name to be shown.
		 * @param	: boolean active. If true then the tab will be highlighted
		 * @param	: int number. Stores the instance number to get in the future.
		 **/
		createCsticGroupLabel: function( label, active, number ){
			
			var self = this;
				active = active ? 'ui-btn-active':'';
				
			var $listItem =	$('<li><a href="#" data-cid="'+number+'" class="'+active+'">'+label+'</a></li>')
				$listItem.on('click', function(){
					self.cmds.command_33({"instanceNo":number})
			        	.then(function( data ){
			              
			                var instance = data.detailView.Instance,
			                	csticBox  = self.getFirstCsticGroup(instance).CsticBox || [],
			                	csticGroup = self.getAllCsticGroups(instance),
			                	number    = data.detailView.instance;
			                	
			                	self.ui.$controls.empty();
			                	self.ui.$csticgroup.find('tr').empty();
			                	
			                	self.createControlTabs( csticGroup, number );
			                	self.createCstics( csticBox, number );
			            });
				});
				
			this.ui.$csticgroup.find('ul').append($listItem);
			this.ui.$csticgroup.find('div[data-role="navbar"]').navbar().navbar('destroy').navbar();			
			
		},
		/**
		 * @param  	: Object o. instance 
		 * @return	: Array vcgs. Valid Cstic Groups
		 * It removes the $-APPLICATION and return Array of cstic group
		 **/
		getAllCsticGroups: function( o ){	
			
			var cg   = o.CsticGroup || [],
				len  = cg.length,
				vcgs = [],
				i    = 0;
			
			while ( i < len ) {
				if (cg[i].name && cg[i].name.indexOf('$-') === -1) {				
					vcgs.push( cg[i] );
				}
				i++;
			}
			return vcgs;
		},
		/**
		 * @param  	: Object o. instance 
		 * It iterates through the CsticGroup and checks if it is not 
		 * empty. Only one group will have the cstics and that is the first
		 * active tab to be shown as selected and its cstics.
		 **/
		getFirstCsticGroup: function( o ){	
			
			var cg  = o.CsticGroup || [],
				len = cg.length,
				i   = 0;
			
			while ( i < len ) {
				if (cg[i].name && cg[i].name.indexOf('$-') === -1 && cg[i].CsticBox.length > 0) {				
					return cg[i];
				}
				i++;
			}
		},
		/**
		 * @param  	: Object o. instance 
		 * @param	: String label
		 * If modified instance is received from the server.
		 * This method gets called. It takes the label of the selected 
		 * tab to get the respective tab and update it.
		 **/
		_modifyInstance: function( o, label ){
			
			var csticGroup = o.CsticGroup || [],
				i = 0, len = csticGroup.length;
			
				while ( i < len) {
					var csticBox = csticGroup[i].CsticBox || [];
						if (csticGroup[i].conflicted) {
							var label = csticGroup[i].label;
							
							var $elem = $('#'+label.replace(/ /gi, "_"));
								$elem.find('div')
									 .css({'color':'red', 'font-weight':'bold'})
									 .html(label + ' *');
						}
						this.updateCstics( csticBox, o.number );
						i++;
				}
				
				$('[data-cid="'+o.number+'"] span.ui-btn-text').html(o.description);
				//this.ui.setCollapsibleHeading( o.description );
			
				this.tree.updateTreeNode( o, label );
		},
		/**
		 * @param	: Object o - instance to delete.
		 * Takes the instance to delete from the tree node
		 **/
		_deleteInstance: function( o ){		
			this.tree.deleteNodeById( o.number );
		},
		/**
		 * @param	: String activeTab - name of the active tab.
		 * We have to store this tab name as of when there is conflict
		 * on any cstic then we can mark the tab as conflict.
		 **/
		setActiveTab: function( activeTab ){
			this.activeTab = activeTab;
		},
		/**
		 * @param	: String insName - Currently selected instance.
		 * Set the active instance to the obj. It is required further for 
		 * various operations.
		 **/
		setActiveIns: function( insName ){
			this.insName = insName;
		},
		/**
		 * @param	: Object ct - ClassType object
		 * @param	: Root level object
		 * Creates the ClassType tabs with the data
		 **/
		createClassTypeLabel: function( ct, o ){
		
			for ( var i = 0; i < ct.length; i++) {
				var self   = this,
					$cont  = $('<div id="palateTab" data-role="navbar"></div>'),
					$icont = $('<ul></ul>');
					ctg    = ct && ct[0].ClassType || [],
					cl     = 'ui-btn-active';
				
				self.ui.$collapsible.empty();
				
			    $.each( ct, function( idx ){
			    	cl = idx === 0 ? cl:'';
			        self.ui.$collapsible.append(
			        		$icont.append($('<li><a href="#" class="'+cl+'">'+ct[idx].label+'</a></li>')
			        				.bind("click", [self, ct[idx], o.number], self._onMainClick))
			        );
			    });		
			    self.ui.$collapsible.append($cont.append($icont));	    
			  
			    self.createClassTypeChilds( ctg, o.number ).appendTo(self.ui.$collapsible);	    
			    self.ui.$collapsible.trigger("create").trigger("expand");
			}			
		},
		/**
		 * Object. Configurator configuration
		 **/
		createClassTypeLabel_new: function( ct, o ){
			
			if (ct.length > 0) {
				this.ui.$collapsible.empty();
				
				var self   = this,
					$cont  = $('<div id="palateTab" data-role="navbar"></div>'),
					$icont = $('<ul></ul>');
					ctg    = ct && ct[0].ClassType || [],
					cl     = 'ui-btn-active';
					
				var $listItems = $.map( ct, function( item, idx ){
					
					cl = !idx ? cl : '';
					
					return $('<li><a href="#" class="'+cl+'">'+item.label+'</a></li>')
									.bind("click", [self, item, o.number], self._onMainClick);
			        
			    });				
			    self.ui.$collapsible.append($cont.append($('<ul/>').append($listItems)));
			}
			this.createClassTypeChilds( ctg, o.number ).appendTo(this.ui.$collapsible);	    
		    this.ui.$collapsible.trigger("create").trigger("expand");
		},
		/**
		 * @param	: Object e, Event 
		 * Called on clicking on the clasTypeGroup.
		 **/
		_onMainClick: function(e){
			var cfg  = e.data[0],
				data = e.data[1],
				no   = e.data[2],
				sct  = data.ClassType || [];
			
			cfg.ui.$collapsible.find('table').remove();
			cfg.createClassTypeChilds(sct, no).appendTo(cfg.ui.$collapsible);	 

		},
		createClassTypeChilds: function( ct, no ){
			
			var rows = ct.chunk(5),
				self = this,
				trs  = [],
				tds  = [];
			
			var $trs = $.map(rows, function(tr){
				var $tds = $.map(tr, function( td ){
					return $('<td/>').html(td.label)
									 .bind('click', [self, {"parentInstance":no, "typeName":td.typeName}], self.loadDevice);
				});
				return $('<tr/>').append($tds);
			});
			return $('<table/>').append($trs);
		},
		/**
		 * Object. Configurator configuration
		 **/
		createClassTypeChilds_new: function( ct, no ){
			
			var rem = ct.length % 5,
				blankItems = (rem === 0) ? 0:(5-rem);
			
			for ( var i = 0; i < blankItems; i++) {
				ct.push({});
			}
			
			var rows = ct.chunk(5),
				self = this,
				trs  = [],
				tds  = [];
			
			var $trs = $.map(rows, function(tr){
				var $tds = $.map(tr, function( td ){
					
					var $tdCell = $('<td style="width:20%;"/>');
					
					if (td.label) {
						$tdCell.html(td.label)
						 	   .bind('click', [self, {"parentInstance":no, "typeName":td.typeName}], self.loadDevice);
					}
					return $tdCell;
					
				});
				return $('<tr/>').append($tds);
			});
			return $('<table/>').append($trs);
		},
		/**
		 * This is a callback function which gets called after clicking on classTypeGrpups.
		 **/
		loadDevice: function(e){
			
			var data = e.data[1],
				cfg  = e.data[0];
			
			cfg.cmds.command_17( data )
		    	.then(function( resp ){
		    		cfg._setEventType( true );
		    		cfg.loadInstance( resp );  		
		    	});
		},
		/**
		 * This is a callback function which gets called after clicking on tabs.
		 **/
		_onControlTabClick: function(){
			
			this.cmds.command_17(data)
				.then(function( resp ){
		    		cfg.loadInstance( resp );  		
		    	});
		},
		/**
		 * @param 	: Array csticGroup. 
		 * @param 	: int instanceNo
		 * Takes the csticGroup and instance number to create the tabs
		 **/
		createControlTabs: function( csticGroup, instanceNo ){
			
			var self = this;
			if (csticGroup && csticGroup.length > 0) {
				$.each( csticGroup, function( idx ){
			        if (csticGroup[idx].name.indexOf('$-') === -1) {			        	
			            // Creation of CsticGroup tabs and its children
			        	// and main body tabs for the cstics.
			        	self._createControlTab( csticGroup[idx], instanceNo );
			        }
			        
			    });
			}	    
		},
		/**
		 * @param	: Object c, cstic 
		 * @param	: int no, instance number 
		 * Create the control tab 
		 **/
		_createControlTab: function( c, no ){
		
			var self  = this,
				width = (self.ui.$rightPanel.width()-30)/(c.length -1 ),
				cfl   = c.conflicted ? self.ui.opts.style.conflict:'',
				active = c.CsticBox.length > 0 ? 'active':'';
				
			var $csticgrp = self.ui.$csticgroup.find('tr');
			
			$('<td><div style="'+cfl+' max-width:200px;" class="ui-td-inner '+active+'">'+(c.name)+'</div></td>')
		        .attr({'style': 'max-width:200px;', 'id':c.name.replace(/ /gi, "_")})	        
		        .on('click', {"self":self, "number":no, "cg":c.name}, self._onCsticGroupClick)
		        .appendTo($csticgrp);
		},
		/**
		 * @param	: Event which triggers on CsticGroup tab click
		 * e.data 	: is the data which is passed at the time of event binding.
		 **/
		_onCsticGroupClick: function( e ){
			
			var $this 			= $(this),
				_self 			= e.data.self,
				number 			= e.data.number,
				csticGroup 		= e.data.cg;
			
			// Removing the active class from the other tabs and putting active 
			// class to the tab which is clicked recently.
			$(this).parents('tbody').find('div').removeClass('active');
			$(this).find('div').addClass('active');
			
			_self.ui.$controls.empty();
			_self.setActiveTab( csticGroup );
			
	        _self.cmds.command_33({"instanceNo":number, "csticGroup": csticGroup })
	        	.then(function( data ){
	              
	                var csticBox  = _self.getFirstCsticGroup(data.detailView.Instance).CsticBox || [],
	                	number    = data.detailView.instance;
	                	_self.createCstics( csticBox, number );
	            });
		},
		/**
		 * @param	: Object[] cb - Array of CsticBox
		 * @param	: int parent number
		 **/
		updateCstics: function( cb, no ){
		    
		    for (var i = 0; i < cb.length; i++) {
		        for (var j = 0, c = cb[i].Cstic; j < c.length; j++) {		        	
		        	if ( c[j].visible ) {
		        		$("#"+c[j].number).replaceWith(this._createCstic( c[j], no ));
					}
		        }
		    }
		    
		    this.ui.$controls.trigger("create");
		    this.ui.onSliderChange();
		    return this;
		},
		/**
		 * @param	: Object[] cb - Array of CsticBox.
		 * @param	: int parent number
		 * Creates each cstics and groups it.
		 **/
		createCstics: function( cb, no ){
		   
			var self = this;
			
			$.map(cb, function( csticBox, i){
				
				var isVisible = false;
					
				$.each(cb[i].Cstic, function( x, cstic ){					
					if (cstic.visible) {
						isVisible = true;
						return;
					}
				})
				
				if ( csticBox.name && isVisible ) {
					self.ui.$controls.append('<h3>'+csticBox.name+'</h3>');
		        }
				
				var $cstics = $.map( cb[i].Cstic, function( elem , idx){
		        	
		        	if (elem.visible) {
		        		return self._createCstic( elem, no );
					}
		        })
		        
		        self.ui.$controls.append($cstics);
			});
		    
		    this.ui.$rightPanel.append( this.ui.$controls );
		    this.ui.$controls.trigger("create");
		    
		    // Its seems according to the jqm docs the events are not 
		    // firing when the slider is created dynamically. So this
		    // method is a workaround for that. When the slider will be
		    // created and appended to the DOM element then we can select 
		    // it and bind the change event on that.
		    this.ui.onSliderChange();
		},
		/**
		 * @param	: Object ctrl - contains control info.
		 * @param	: int no is the parent no.
		 **/
		_createCstic: function( ctrl, no ){
			
			var $control,
				self = this,
				ct = ctrl.controlInfo.toLowerCase(), 
				$cf = self.ui.$ctrlfieldset.clone(),
				control = ct && self.ui[ct]( ctrl, no ) || '';
			
			if (ctrl.number == 60051) {
				//console.log('Total poles found : ', ctrl);
				self.ui.setTotalPoles( ctrl.value );
			}
			if (ctrl.number == 44) {
				//console.log('Catalog Number found : ', ctrl);
				self.ui.setCatalogNumber( ctrl.value );
			}
			
			return $cf.attr('id', ctrl.number).append( control);	    
		},
		/**
		 * @param	: Object o - cstic-group which is $-APPLICATION
		 * $-APPLICATION is avoided in the view but it is required for 
		 * some internal calculations and checkings.
		 **/
		get$CsticBox: function( o ){
			
			for ( var i = 0, cg = o.CsticGroup; i < cg.length; i++) {
				if (cg[i].name.indexOf('$-') !== -1) {
					return cg[i].CsticBox;
				}
			}
			return [];
		}
	};
	
	/**
	 * Additional utility function which works on array object
	 * @param n : int to divide array into sub-array
	 **/
	Array.prototype.chunk = function ( n ) {
	    if ( !this.length ) {
	        return [];
	    }
	    return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
	};
	/**
	 * Additional utility function which works on String object
	 * It converts word to noun form ie. first letter as upper-case and remaining as lower-case.
	 **/
	String.prototype.toTitleCase = function() {
	    return this.replace(/(?:^|\s)\w/g, function(match) {
	        return match.toUpperCase();
	    });
	}
	/**
	 * Additional utility function which works on String object
	 * trim method is undefined in IE. This method is fix for trim in IE.
	 **/
	String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g,"");
	}
	/**
	 * console is undefined in the IE. So console.log throws exception in IE.
	 * By assigning as empty function it fix the bug. Even it will not write 
	 * to console. But it is a fix for IE
	 */
	if (!(window && window.console)) {
		window.console = {log:function(){}}
	}
	
})(jQuery, window || this);

