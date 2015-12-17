/*!
 * @filename	: iConfigure ( config.toolbar.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 09-01-2014
 * 
 * Used by		: config.main.js 
 * 
 * It contains all the toolbar methods and ui behaviour.
 * It does the server call after when the event gets fired.
 *  
 */
iConfigure.prototype.toolbar = function( cfg ){
	/**
	 * Options for the cmds for initial configuration. 
	 * It takes from options.ui from config.options.js
	 **/
	this.opts 			= cfg.options.ui;
	/**
	 * Main object ie object of config.main
	 **/
	this.cfg 			= cfg;
	/**
	 * $cut is jQuery element binded with click event to call cut operation.
	 **/
	this.$cut 			= $(this.opts.tools.cut);
	/**
	 * $copy is jQuery element binded with click event to call copy operation.
	 **/
	this.$copy 			= $(this.opts.tools.copy);
	/**
	 * $paste is jQuery element binded with click event to call paste operation.
	 **/
	this.$paste 		= $(this.opts.tools.paste);
	/**
	 * $delete is jQuery element binded with click event to call delete operation.
	 **/
	this.$delete		= $(this.opts.tools.remove);
	/**
	 * $menu is jQuery element binded with click event to show menu popup.
	 **/
	this.$menu 			= $(this.opts.tools.menu);	
	/**
	 * $newConfig is jQuery element binded with click event to show confirmation 
	 * dialog whether to save configuration or not cut operation.
	 **/
	this.$newConfig 	= $(this.opts.ctx.newConfig);	
	/**
	 * $saveClose is jQuery element binded with click event to call save & close configuration.
	 **/
	this.$saveClose 	= $(this.opts.ctx.saveClose);
	/**
	 * $manual is jQuery element binded with click event to show manual view.
	 **/
	this.$manual 		= $(this.opts.ctx.manual);	
	/**
	 * $auto is jQuery element binded with click event to show auto view.
	 **/
	this.$auto	 		= $(this.opts.ctx.auto);
	/**
	 * $autoLayout is jQuery element binded with click event to show auto-layout.
	 **/
	this.$autoLayout	= $(this.opts.ctx.autoLayout);
	/**
	 * $manualLayout is jQuery element binded with click event to show manual-layout.
	 **/
	this.$manualLayout	= $(this.opts.ctx.manualLayout);
	
	/**
	 * _init method gets called after the object initialization
	 * to do the initial configuration ie initializing the ui etc.
	 **/
	this._init();	
}

iConfigure.prototype.toolbar.prototype = {
		
	_init: function(){
	
		this.cfg.log("Toolbar is initialized");
		
		var self = this;
		
		this.$cut.on('click', this, this.cut);
		
		this.$copy.on('click', this, this.copy);
		
		this.$paste.on('click', this, this.paste);
		
		this.$delete.on('click', this, this.remove);
		
		this.$newConfig.on('click', this, this.newConfig);
		
		this.$saveClose.on('click', $.proxy(this.saveClose, this));
		
		this.$auto.on('click', this, this.autoView);
		
		this.$manual.on('click', this, this.manualView);
		
		this.$autoLayout.on('click', this, this.autoLayout);
		
		this.$manualLayout.on('click', this, this.manualLayout);
	},
	
	/**
	 * This method cuts the instance. It is called on click of cut button.
	 * @see		: config.tree#copyInstance()
	 **/
	cut: function( event ){
		console.log('Cut is called');
		
		var cfg = event.data.cfg;
		
		cfg.tree.copyType = false;
		cfg.tree.copyInstance();
	},
	
	/**
	 * This method copies the instance. It is called on click of copy button.
	 * @see		: config.tree#copyInstance()
	 **/
	copy: function( event ){
		console.log('Copy is called');
		
		var cfg = event.data.cfg;
		
		cfg.tree.copyType = true;
		
		cfg.tree.copyInstance();
	},
	
	/**
	 * This method pastes the instance which copied or cut.
	 * It calls command 20 and renders the response with the 
	 * server respond parameters.
	 * @see		: config.tree#pasteInstance()
	 **/
	paste: function( event ){
		console.log('Paste is called');
		var cfg = event.data.cfg;
		
		cfg.tree.pasteInstance();
	},
	
	/**
	 * This method deletes the selected node from the tree.
	 * It calls command 18 by passing instance number
	 * @see		: config.tree#deleteInstance()
	 **/
	remove: function( event ){
		
		console.log('Delete is called');
		var cfg = event.data.cfg;
		
		cfg.tree.deleteInstance();
	},
	
	/**
	 * This method opens a new configuration.
	 **/
	newConfig: function( event ){
		//event.preventDefault();
		console.log('the callback is called');
		var cfg = event.data.cfg,
			parseQueryString = function() {
		   	    var query = (window.location.search || '?').substr(1),
		   	        map   = {};
		   	    query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
		   	        (map[key] = map[key] || []).push(value);
		   	    });
		   	    return map;
		    },
			loadNewConfig = function(){
				//console.log('hey it works');
				cfg.init( {"modelName":parseQueryString().modelName[0]} );
			};
		
		cfg.tree.deleteAllNodes();
		cfg.ui.$ctxmenu.popup('close');
		
		setTimeout(function(){
			cfg.ui.$popup.showInfo('confirm', 'Would you like to save configuration?', 'Confirm', true, loadNewConfig);
			//cfg.ui.$popup.showInfo('This is a test message', 'success', false);
		}, 1000);
	},		
	/**
	 * This method saves the configuration and closes the session.
	 **/
	saveClose: function( event ){
		event.preventDefault();
		console.log('saveClose is called');
		
		//var cfg = event.data.cfg;
		var self = this;
		this.cfg.ui.$ctxmenu.popup('close')
		
		setTimeout(function(){
			self.cfg.ui.$popup.showInfo('Configuration is saved ', 'success');
		}, 1000);
		
		this.cfg.cmds.command_8();
		
	},	
	/**
	 * There is two types of view Electrical and Config view. 
	 * On switching on the other view. Currently showed instance no
	 * need to pass. It calls command 33 by passing showTree=true. 
	 **/
	autoView: function( event ){
		console.log('autoView is clicked');
		
		var cfg = event.data.cfg;
		
		cfg.cmds.command_33({"instanceNo":1, "showTree": true})
			.then(function( data ){
				console.log('autoView data   : ', data);
				
				cfg.setDefaultView(data.treeView.view.toViewType());
				cfg.tree.deleteAllNodes();				
				cfg.tree.addConfigNodes( data.treeView.Instance );
				
				cfg._clearPanels(true, true, false);
				
				var ins = data.detailView.Instance,
	    			no	= data.detailView.instance,
	    			type = ins.instType,
	    			cg  = cfg.getFirstCsticGroup(ins),
	        		vcg = cfg.getAllCsticGroups(ins),
		        	ct  = ins.ClassTypeGroup,
		        	cb  = cg && cg.CsticBox || [];
	            
				cfg._clearPanels(true, true, false);
				cfg.ui.$controls.empty();
				cfg.createCsticGroups( vcg, cb, ins );	
				
			});
	},
	/**
	 * There is two types of view Electrical and Config view. 
	 * On switching on the other view. Currently showed instance no
	 * need to pass. It calls command 33 by passing showTree=true. 
	 **/
	manualView: function( event ){
		console.log('manualView is clicked');
		var cfg = event.data.cfg;
		
		cfg.setDefaultView('Config');
		
		cfg.cmds.command_33({"instanceNo":2, "showTree":true})
			.then(function( data ){
				
				showGCLayout( false );				
				cfg.tree.deleteAllNodes();					
				cfg.tree.addConfigNodes( data.treeView.Instance );		
				
				var ins = data.detailView.Instance,
	    			no	= data.detailView.instance,
	    			type = ins.instType,
	    			cg  = cfg.getFirstCsticGroup(ins),
	        		vcg = cfg.getAllCsticGroups(ins),
		        	ct  = ins.ClassTypeGroup,
		        	cb  = cg && cg.CsticBox || [];
	            
				cfg._clearPanels(true, true, false);
				cfg.ui.$controls.empty();
				$(".ui-collapsible-content").empty();
				cfg.createCsticGroups( vcg, cb, ins );	
				
			});
	},
	/**
	 * On auto layout it calls the command 23 and forms the auto layout in the back-end. 
	 * This layout is required to show the GC (Graphical Configurator view).
	 * @see		: config.cmds#command_23();
	 **/
	autoLayout: function( event ){
		console.log('autoLayout is clicked');
		
		var cfg = event.data.cfg;
		var data = cfg.rootInstance;
		
		var ins = data.ModelChanges.Config.Created.Instance[0];
		console.log('instance : ', ins);
		
		cfg.cmds.command_23({"instance":ins.electricalID, "targetParent":ins.number, "placeType": "auto"})
			.then(function(){
				cfg.cmds.command_gcview({"modelName":"TYZ:PANELBOARD"})
					.then(function( data ){
						drawWithKinetic3( data );
					});
			});
	},
	/**
	 * to-do
	 **/
	manualLayout: function( event ){
		console.log('manualLayout is clicked');
		var cfg = event.data.cfg;
		
		//cfg.cmds.command_33({"instanceNo":2, "showTree":true});
	}
}