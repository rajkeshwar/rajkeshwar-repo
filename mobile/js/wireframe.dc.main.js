function quickP1Call(){

	return httpRequest({
		url: "http://132.186.215.11:8080/configserver/pageui",
		data: {
			command: "quickP1",
			userid: "ftcc05",
			QuickEPMUserId: "ftcc05",
			epmType: "P1",
			Rank: 1,
			reqXml: '<QuickConfig><EPM type="PANELBOARD"><UserData><element name="TYZ:PANELBOARD"><Cstic name="A7JPB_BUS_MATERIAL" value="COPPER"/><Cstic name="A7JPB_GND_CONN_OPTIONS" value="COPPER ONLY"/><Cstic name="A7J_MASTER_NAMEPLATE" value="EACH"/></element></UserData></EPM></QuickConfig>'
		}
	});
	
}

$(function(){
	
	$("#qConfigureBtnDiv").click(function(){
		
		console.log("button is clicked");
		
		$.when( quickP1Call() ).then(function( quickData ){		
		
			httpRequest({
				url: "http://132.186.215.11:8080/configserver/pageui",
				data: {
					command: 33,
					sessionID: quickData.sessionID,
					pageID: 1
				}
			}).then(function( data ){
				
				console.log("Config data loaded : ", data);
	
				var instance = Utils.get(data, "Electrical");
				
				$.each(instance, function(insType, obj){
					Main[ insType ]( obj );
				});
				
				
				$.mobile.changePage( "#DataConfigurator", {
				    reverse: true,
				    changeHash: false
				});			
				
				
				// Once the radio buttons are appended to the DOM. This code checks
				// if the no of radio buttons are less than or equals 3 then it sets
				// the width by dividing the no of radio buttons present. Meaning it 
				// should be shown as horizontal but including no of buttons the width 
				// should be 100%. To show it as per the wireframe.
				
		
				// Getting each radio group which has been set as data-type='horizontal'
				$("fieldset[data-type='horizontal'] " +
						".ui-controlgroup-controls").each(function(){
							
					var $elem = $(this).find(".ui-radio"),
						size = $(this).find(".ui-radio").size(),
						width = (100 / size) + '%';
					
					// Iterating each radio button's parent with class ui-radio
					// and setting the calculated with.
					$elem.each(function(){
						$(this).css('width', width);
					});
				});
			});

		}); // end of when block
	});
});

var Main = (function(){
	
	var $DConfigPanel,
	
	created = function( obj ){
		
	
//		var csticGroup = Utils.get(instance, "CsticGroup");
//		var csticBox = Utils.get(csticGroup[0], "CsticBox");
		
		var instance = obj.Instance, csticGroup;
			$DConfigPanel = $("#DConfigPanel");
		
		for (var i = 0; i < instance.length; i++) {
			csticGroup = instance[i].CsticGroup;
			
			for (var j = 0; j < csticGroup.length; j++) {
				
				if ( csticGroup[j].label.indexOf('$') == -1) {	
					createCsticsByCsticBox( csticGroup[j].CsticBox );
				}
			}
			
		}
	},
	createCsticsByCsticBox = function( csticBox ){
		debugger
		var $wrapper, $fieldcontain;
		
		for (var i = 0; i < csticBox.length; i++) {			
			
			if (csticBox[i].name) {
				$DConfigPanel.append("<div class='ui-field-contain'>" +
						"<h3>" + csticBox[i].name + "</h3></div>");
			}
			for (var j = 0, cstc = csticBox[i].Cstic; j < cstc.length; j++) {
				
				$wrapper = $("<div class='wrapper'/>");
				$fieldcontain = $("<div data-role='fieldcontain'/>");
				
				var control = Controls[ cstc[j].controlInfo ]( cstc[j] );
			
				$DConfigPanel.append($wrapper.append(control));
			}
		}
	},
	deleted = function( instance ){
		console.log("deleted is called");
	},
	modified = function( instance ){
		console.log("modified is called");
	};
	
	return {
		Created : created,
		Modified : modified,
		Deleted  : deleted
	}
	
})();