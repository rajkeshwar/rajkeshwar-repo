
/*!
 * @filename	: iConfigure ( config.commands.js )
 * @author		: Rajkeshwar Prasad
 * @date		: 25-11-2013
 * 
 * Used by		: config.jquery.js 
 * 
 * It contains all the utility popups, alerts and dialogs required to show the messages.
 * It does the server call after when the event gets fired.
 *  
 */
 $(document).ready(function(){

	var config = new iConfigure();
	
	$("#res_cflct").hide().on("click", function(){
		
		$("#msgPopup").showInfo( $(this).attr('conflictMessage'), "Conflict Message", false );
	});
	
	$("#config_tree_view").click(function(){
		
		$("#layout-2").trigger("click");
		$("#tab-controls").empty();
	});
	
	$("#product_tab").click(function(){
		showGCLayout( true );
		config.cmds.command_1111({"url":"data/gc-lite-data.json"})
			.then(function( data ){
				drawWithKinetic3( data );
			});
	});
	
	var groupItem = '';
	$.get('data/Catalog.xml', function( xml ){	
		
		/*var modelNames = $(xml).find('CATALOG').find('MATERIAL').map(function(idx, i){
			 
			 var familyname = $(this).attr('familyname'),
			 	 subfamilyname = $(this).attr('subfamilyname'),
			 	 modelname = $(this).attr('name'),
			 	 shortdescription = $(this).attr('shortdescription');
			 
			 return modelname ? modelname : null;
		 }).get();
		
		console.log(modelNames);*/
		
		 var $items = $(xml).find('CATALOG').find('MATERIAL').map(function(idx, i){
			 
			 var familyname = $(this).attr('familyname'),
			 	 subfamilyname = $(this).attr('subfamilyname'),
			 	 modelname = $(this).attr('name'),
			 	 shortdescription = $(this).attr('shortdescription');
			 
			 var groupLabel = '';
			 	if (groupItem !== subfamilyname) {
			 		groupItem = subfamilyname;
			 		groupLabel = '<b>'+subfamilyname+'</b>';
				}
			 	
			 	if (!shortdescription) {
					return;
				}
			 
			 return $('<li><a href="#">'+(++idx)+' '+shortdescription+' - '+modelname+'</a></li>')
			 			.attr('data-model', modelname)
			 			.on('click', function(){
			 				config.init( {"modelName":$(this).attr('data-model'), "url":"data/panelboard.json"} );
			 				$("#epmlist").popup("close");
			 			});
		 }).get();
		 
		 $("#epmlist ul").append($items).listview('refresh');
	});
		
	$("#configure_tab").click(function(e){
		e.preventDefault('configure_tab is clicked');
		console.log();
		$( "#epmlist" ).popup( "open" )
    });

	$(".ui-icon-cmps-tgl-left").click(function(){
		$("#tree-out-cont").hide('slow');
		$("#toggle-on").fadeIn("slow", function(){
			$('#right-panel').animate({
			    width: "93%",
			    left:"64px"
			 }, 100 );
		});					
	});
	
	$("#toggle-on").hide().click(function(){
		$("#tree-out-cont").show('slow');
		$(this).fadeOut("slow");
		$('#right-panel').css({'width':'74%', 'left':'310px'})
	});

	$("#autoLayout").click(function(){
		showGCLayout( true );
	});	
	
	$("#ctxmenu ul li").click(function(){
		$("#ctxmenu").popup("close");
	});
	
	$("#ctxmenu").find("div[class='ui-radio']").click(function(){
		$("#ctxmenu").popup("close");
	});
	
	$("#dialog_open").click(function(){	
		$("#msgDialog").showMessage( 'Error', 'Cannot move', 'A cut operation is not possible on instance which are placed' );
	});

	function showMessage( title, header, msg ){
		
		var clazz = title == 'error' ? 'msg-error' : 'msg-info',
			title = title.toTitleCase();
		
    	$(this).find('[data-role="header"]').find('h1').html(title);
		$(this).find('div[role="main"] > div').html('<h3>'+header+'</h3><p class="'+clazz+'">'+msg+'</p>');
		$(this).trigger("create");
		
	    $.mobile.changePage( this, {
	        role: "dialog"
	    });
    }
		
	function showInfo( errObj, type, confirm, func  ){
		
		var cssClass = 'msg-' + type, 
			$self = $(this),		
			button = function( inline, text, callback){
				
				var attributes = {};
					inline && (attributes['data-inline'] = true);
					!callback && (attributes['data-rel'] = 'back');
					
					if (!(callback && typeof callback == 'function')) {
						callback = function(){}
					}
					
				return $('<button data-theme="a" data-mini="true"/>')
					.on('click', callback )
					.html( text );
			}, isPopupOpen;
			
		$self.find('[data-role="header"] > h1')
		   	 .html( type.toTitleCase() );
		
		var messageBody = '';
		if (typeof errObj === "string") {
			messageBody = '<h4 class="ui-title msg-error">'+errObj +'</h4>';
			
		} else if (typeof errObj === "object"){
			messageBody += errObj.code ? '<h3 class="ui-title msg-error">Error code: '+errObj.code+'</h3>': '';
			messageBody += errObj.message ? '<h4 class="ui-title msg-info">'+errObj.message +'</h4>': '';
			messageBody += errObj.serverMessage ? '<p>'+errObj.serverMessage+'</p>': '';
		}
		$self.find('[data-msg="msg"]').html( messageBody );
				
		var $buttons = $self.find('[data-btn="btnset"]');
		
		if (!confirm) {
			$buttons.html( button(false, 'Ok', function(){
				$self.popup('close');
			}));
		} else {			
			$('<fieldset class="ui-grid-a"/>')
				.append( $('<div class="ui-block-a"/>').append(button(true, 'Ok', function(){
					func();
					$self.popup('close');
				})))
				.append( $('<div class="ui-block-b"/>').append(button(true, 'Cancel', function(){
					$self.popup('close');
				})))
				.appendTo( $buttons.empty() );
		}	
				
		isPopupOpen = setInterval(function(){
			
			if($("#ctxmenu-popup").hasClass("ui-popup-hidden")){
				$self.trigger('create').popup('open');
				clearInterval(isPopupOpen);
			}
		}, 100);
		
    }
	
	function parseQueryString() {
   	    var query = (window.location.search || '?').substr(1),
   	        map   = {};
   	    query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
   	        (map[key] = map[key] || []).push(value);
   	    });
   	    return map;
    }
	
	$.fn.showMessage = function(){	
		
		return showMessage.apply(this, arguments);
	}
	$.fn.showInfo = function(){	
		
		return showInfo.apply(this, arguments);
	}
  	
});
 function showGCLayout( show ){
		
	if (show) {
		$("#tree-out-cont").hide();
		$("#right-panel").hide()
		$("#gcLayout").show();	
	} else {
		$("#tree-out-cont").show();
		$("#right-panel").show()
		$("#gcLayout").hide();
	}
}