/*!
 * @filename	: iConfigure ( config.options.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 25-11-2013
 * 
 * Used by		: config.main.js 
 * 
 * It contains the configuration options for all the classes.
 * All the custom configuration can be done here.
 *  
 */
iConfigure.prototype.options = {
		base_url    : "/configserver/ui",
		palateId	: "#class_type_group",
		controlsId	: "tab-controls",
		ajaxLoader  : true,
		logger		: true,
		cookie   	: {
				expires : 30,
				domain  : '',
				path    : '/',
				secure  : false
		},
		i18MsgEn	: (function(){
			return {
				'error'                : 'Error',
				'errAccess'            : 'Access denied.',
				'errConnect'           : 'Unable to connect to backend.',
				'errAbort'             : 'Connection aborted.',
				'errTimeout'           : 'Connection timeout.',
				'errNotFound'          : 'Backend not found.',
				'errResponse'          : 'Invalid backend response.',
				'errCmdParams'         : 'Invalid parameters for command "$1".',
				'errDataNotJSON'       : 'Data is not JSON.',
				'errDataEmpty'         : 'Data is empty.',
				'errCmdReq'            : 'Backend request requires command number.'
			}
		})(),
		cmds		: {
			query_data_0  : {"command":0, "modelName":"", "userid":""}, /* Opens the session and loads the instance */
			query_data_8  : {"command":8, "sessionId":""}, 
			query_data_17 : {"command":17, "sessionID":"", "parentInstance":"", "typeName":"" }, /* Loads child types */
			query_data_18 : {"command":18, "sessionID":"", "instanceNo":""}, 
			query_data_19 : {"command":19, "sessionID":"", "instanceNo":"", "csticNo":"", "newValue": ""}, /*Changes cstic value*/
			query_data_20 : {"command":20, "sessionID":"", "instanceNo":"", "parentInstanceNo":"", "copyType": ""}, /*Copy instance*/
			query_data_21 : {"command":21, "sessionID":"", "instanceNo":"", "parentInstanceNo":"", "referenceInstanceNo": ""}, /*Move instance*/ 
			query_data_23 : {"command":23, "sessionID":"", "instance":"", "targetParent":"", "placeType": ""}, /* Places a electrical instance in the mechanical tree */
			query_data_33 : {"command":33, "sessionID":"", "instanceNo":""},		/*Loads tab data*/	
			query_data_gc : {"command":"gcview", "modelName":"", "sessionID":""}	
		},
		ui					: {
			colHeader   	: "#class_type_group .ui-collapsible-content",
		    controlCont 	: "<div class='clearfix' style='height:518px;overflow-y:auto;'>",
		    controlgroup	: "<div id='cstic-box' data-role='controlgroup' data-type='horizontal'/>",
		    ctrlfieldset 	: "<div style='margin:0 5%;width: 40%;float:left;'/>",
		    csticgroup		: "<div class='cstic-group'><div data-role='navbar'><ul></ul></div><table><tr></tr></table><tr></div>",
		    rightPanel  	: "#tab-controls",
		    ctxmenu : "#ctxmenu",
		    banner			:{
				cnum   : "#c_number",
				cprice : "#c_price",
				tpoles : "#t_poles"
			},
			tools			:{
				cut    : "#cut",
				copy   : "#copy",
				paste  : "#paste",
				toggle : "#toggle",
				remove : "#deleteIns",
				menu   : "#menu"
			},			
			ctx	: {
				newConfig	: "#newConfig",
				saveClose	: "#saveClose",
				template	: "#template",
				manual		: "#layout-2",
				auto		: "#layout-1",
				autoLayout	: "#autoLayout",
				manualLayout: "#manualLayout"
			},
			msg	:{
				dialog: "#msgDialog",
				popup : "#msgPopup"
			},
		    style : {
				conflict : 'color:red;font-weight:bold;',
				required : 'color:blue;'
			},
			clss : {
				conflict : 'tree-handleR',
				complete : 'tree-handleG',
				incomplete: 'tree-handleY'
			}
		},
		tree 		: {
			treeId	: 'configtree' 
		}
};