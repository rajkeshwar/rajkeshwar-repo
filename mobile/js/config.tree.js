/*!
 * @filename	: iConfigure ( config.tree.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 16-11-2013
 * 
 * Used by		: config.main.js
 * 
 * It contains all the tree node related methods.
 * It uses jqtree to form the tree and contains the custom
 * methods for the tree operation. It is not being used independently.
 * config.main.js file uses it.
 *  
 */

iConfigure.prototype.tree = function( cfg ){
	
	/**
	 * Main object ie object of config.main
	 **/
	this.cfg 		= cfg;
	/**
	 * Options which is passed in the config.options for tree section
	 **/
	this.opts 		= cfg.options.tree;
	/**
	 * Id of the tree where the tree will be formed
	 **/
	this.treeId 	= this.opts.treeId,
	/**
	 * jQuery tree element 
	 **/
	this.$tree 		= $('#'+this.opts.treeId),
	/**
	 * _init method gets called after the object initialization
	 * to do the initial configuration ie initializing the tree etc.
	 **/
	this._init();
}

iConfigure.prototype.tree.prototype = {
	/**
	 * This method will get called immediately after the 
	 * config.tree object will be created.
	 **/
	_init: function(){
		var self = this;
		this.$tree.tree({
	        data: [],
	        dragAndDrop: true,
	        onCreateLi: function(node, $li) {   
				//console.log(node, $li);
	            $li.find('.jqtree-element')
	               .append('<div class="tree-handle '+node.cssClass+'"/>')
	               .on("taphold", function(e) {
	                   e.stopPropagation();  
	               });

	        }
	    });
		
		this.onNodeSelect();
		this.onNodeDragAndDrop();
		this.cfg.log('config tree is initialized');
	},
	/**
	 * This method gets called on tree node select and 
	 * calls command 33 to get the cstics for that instance.
	 **/
	onNodeSelect: function(){
		
		var self = this;
		this.$tree.bind('tree.select', self, function( event ) {
	        if (event.node) {
	        	// Loading client side catched data.
	            //self.cfg.createInstance( self.$tree.data(event.node.name) ); 
	        	
	        	var _self     = event.data,
	        		parentId  = event.node.id,
	        		typeName  = event.node.name;
	        		
	        	//_self.cfg.setActiveIns( typeName );	        	
	        	
	        	var instance = self.$tree.data(event.node.id),
	        		accessories = self.$tree.data('P_'+event.node.id);
	        	
	        	// Loading data from the server
	        	_self.cfg.cmds.command_33( {"command":33, "instanceNo":parentId} )
			        .then(function( data ){
			        	
			        	_self.cfg.toggleInstance( data, instance, accessories );
			        });
	        }
		});
	},
	/**
	 * This method gets called on node drag and drop
	 **/
	onNodeDragAndDrop: function(){
		
		var self = this;
		//debugger;
		this.$tree.bind('tree.move',function(event) {
			
			var moveInfo   = event.move_info,
				movedNode  = moveInfo.moved_node,
				parentNode = movedNode.parent,
				parentRef  = moveInfo.target_node;			
			
			console.log('movedNode : (%o)  parentNode (%o)  parentRef (%o)', movedNode, parentNode, parentRef);	
	        
			self._moveNodeOnDrop(movedNode, parentNode, parentRef);
			
	        //event.preventDefault();
	        
	    });
	},
	/**
	 * @param	: Object movedNode
	 * @param	: Object parentNode
	 * @param	: Object parentRef
	 * Calls command 21 and move node in the client side
	 * if no error message received from the server.
	 **/
	_moveNodeOnDrop: function(movedNode, parentNode, parentRef){
		
		this.cfg.cmds.command_21({"instanceNo":movedNode.id, "parentInstanceNo":parentNode.id, "referenceInstanceNo": parentRef.id})
	},
	/**
	 * @param 	: Object instance. Creates a new node and append in the tree.
	 **/
	addTreeNode: function( instance, setFocus ){

		var self 			= this,
			parentNode 		= self.$tree.tree('getNodeById', instance.parent ) || '',
			selectedNode 	= self.$tree.tree('getSelectedNode'),
			label 			= instance.description,
			id 				= instance.number,
			cssClazz 		= self.treeCssClass(instance);
		
		self.cfg.setActiveIns(label);
		self.$tree.data(id, instance);
		
		
	    self.$tree.tree('appendNode', {label: label, id: id, cssClass: cssClazz }, parentNode );

	    var childNode = self.$tree.tree('getNodeById', id);
	    if (setFocus) {
	    	self.$tree.tree('addToSelection', childNode);	    	
		}	    
	   
	    if (parentNode) {
	    	if (setFocus) {
	    		self.$tree.tree('removeFromSelection', selectedNode);
	    	}
	    	self.$tree.tree('openNode', parentNode);
	    	self.cfg.setAddComponentTo( parentNode );
	    }; 
	},
	/**
	 * @param 	: Array nodes. 
	 * Adds the config nodes in the tree for manual layout
	 **/
	addConfigNodes: function( nodes ){
		
		for ( var i = 0; i < nodes.length; i++) {
			
			var parentNode = this.$tree.tree('getNodeById', nodes[i].parent ) || '',
				cssClazz   = this.treeCssClass(nodes[i]),
				selectedNode 	= this.$tree.tree('getSelectedNode');
			
			if (nodes[i].instType === 'I' || nodes[i].instType === 'C') {
				this.$tree.tree('appendNode', {
						label: nodes[i].description, 
						id: nodes[i].number, 
						cssClass: cssClazz
					}, 
					parentNode 
				);
				
				if (parentNode) {
					this.$tree.tree('openNode', parentNode);
				}
			}
		}
		
		var activeNode = this.$tree.tree('getNodeById', nodes[0].number);
	    	this.$tree.tree('addToSelection', activeNode);
	},
	/**
	 * @param 	: Object instance
	 * Deletes the tree node
	 **/
	deleteTreeNode: function( instance ){
		
		var self 			= this,
			nodeToDelete 	= self.$tree.tree('getNodeById', instance.number ),
			selectedNode 	= self.$tree.tree('getSelectedNode');
			
			if (nodeToDelete) {
				this.$tree.tree('removeNode', nodeToDelete);
			}			
	},
	/**
	 * @param 	: int id, instance id
	 * All tree node contains an id which is the instance number.
	 * It gets the appropriate node by it and deletes it.
	 **/
	deleteNodeById: function( id ){
		
		var self 			= this,
			nodeId 			= parseInt(id),
			nodeToDelete 	= self.$tree.tree('getNodeById', nodeId);
		
			self.$tree.tree('removeNode', nodeToDelete);
	},
	/**
	 * Deletes all tree nodes
	 * This is required when we switch the view from auto to manual and vice-versa.
	 **/
	deleteAllNodes: function(){
		
		var rootNode = this.$tree.tree('getTree');
			nodes = rootNode.id_mapping,
			ids	 = $.map( nodes, function( node, id ){ return id; });
			len = ids.length;
			
			while ( len-- ) {
				this.deleteNodeById( ids[len] );
			}
		
	},
	/**
	 * @param 	: Object instance, clabel
	 * @param 	: Object clabel
	 * It updates the the tree node if it gets in instance modified.
	 **/
	updateTreeNode: function( instance, clabel ){	
	
		if (instance.instType == "P") {
			return;
		}
		var node     = this.$tree.tree('getNodeById', instance.number),
			cssClazz = this.treeCssClass(instance),
			label    = instance.description;
		
		var data   = {cssClass: cssClazz};
			clabel && ( data['label'] = label );
		
			this.$tree.tree('updateNode', node, data);
	},
	/**
	 * Object. Configurator configuration
	 **/
	moveTreeNode: function(){
		//this.cmds.command_20
	},
	/**
	 * This method deletes the tree node.
	 * It calls command 18 by passing the instance no to be deleted.
	 **/
	deleteInstance: function(){
		var self 			= this,
			selectedNode 	= self.$tree.tree('getSelectedNode'),
			instanceNo      = selectedNode.id,
			sessionId       = this.cfg.sessionId;
		
		this.cfg.cmds.command_18({"instanceNo":instanceNo})
			.then(function( data ){
				
				self.cfg.loadInstance(data);
			});
	},
	/**
	 * @param	: Object instance, 
	 * This method returns the css class to be set in the tree-node 
	 * based on the condition conflicted, complete or incomplete
	 **/
	treeCssClass: function( instance ){
		
		return instance.conflicted ? 'tree-handleR':
			(instance.complete ? 'tree-handleG' : 'tree-handleY' );
	},
	/**
	 * This method keeps the selected node in the memory while copying.
	 **/
	copyInstance: function(){
		
		var self 			 = this,
			sourceNode 	     = self.$tree.tree('getSelectedNode');
		
		console.log(sourceNode);
		
		this.sourceInstance = sourceNode;
		
	},
	/**
	 * On paste this method calls the command 20 by passing 
	 * instanceNo, parentInstanceNo and copyType which is boolean.
	 * if copyType="true" then it copies, copyType="false" it cuts
	 * and pastes
	 **/
	pasteInstance: function(){
		
		var self 		   = this,
			sourceNode     = this.sourceInstance,
			targetNode 	   = self.$tree.tree('getSelectedNode'),
			copyType       = ~~this.copyType;
		
		console.log('source : (%o)  target : (%o)  copyType : (%o)', sourceNode, targetNode, copyType);
		
		/*if (!targetNode.id) {
			$("#msgDialog").showMessage( 'Error', 'Cannot copy', 'Copy is not possible in parent instance' );
			return;
		}*/
		this.cfg.cmds.command_20({"instanceNo":sourceNode.id, "parentInstanceNo":targetNode.id, "copyType": copyType})
			.then(function( data ){
				
				self.cfg.loadInstance( data );  		
			});
	},
	/**
	 * @param	: Object instance
	 * This method calculates the name of the instance
	 * from the $-APPLICATION section.
	 **/
	nodeLabel: function( instance ){
			
		var csticGroup = this.cfg.get$CsticBox(instance),
			cstic      = (csticGroup[0] && csticGroup[0].Cstic) || [],
			number, value, i = 0;		
		
		while ( i < cstic.length) {

			number = cstic[i].number;
			value  = cstic[i].value.trim();
			
			if (number == 60030 && value !== '') {
				return value;
			} else if(number == 60003 && value !== ''){
				return value;
			}
			i++;
		}
		
	},
	/**
	 * @param	: Object instance
	 * This method sets the instance in the tree which comes as part
	 * with key "P_"+number of the instance say "P_1" if the instance no 
	 * is 1 and instType="P". This is required while toggling between the
	 * tree nodes to get the accessories if any.
	 **/
	setTreeData: function( instance ){
		
		var node = this.$tree.tree('getSelectedNode');
		
		this.$tree.data('P_'+node.id, instance);
	}
}