	
var ZOOM_FACTOR = 18,
	TEXT_SIZE = 12;

var stage, layer, center, contHeight=0, contWidth=0;
$(document).ready(function(){
	layer = new Kinetic.Layer();
	stage = new Kinetic.Stage({		
		container: 'container',
	    width: 800,
	    height: 700,
	    draggable: false
	});
	//console.log("stage width :%o  height :%o ", stage.getWidth(), stage.getHeight());
	//console.log("stage : ", stage);
});

function getOrigin( container ){
	var width = (stage.getWidth() - container.w) / 2;
	var height = (stage.getHeight() - container.h) / 2;
	
	return {w:width, h:height};
}
function getContainer( configs ){
	var contHeight=0, contWidth=0;
	
	for ( var i = 0; i < configs.length; i++) {
		
		var eh = configs[i].shape.height,
			ew = configs[i].shape.width;		
		
		contHeight = eh > contHeight ? eh : contHeight;
		contWidth = ew > contWidth ? ew : contWidth;
	}
	contHeight = contHeight * ZOOM_FACTOR;
	contWidth = contWidth * ZOOM_FACTOR;
	
	return {h:contHeight, w:contWidth};
}

function drawWithKinetic3( data ){
	
	console.log("data : ", data);
	
	var posX, posY;
	var $cont = $("#container");
	
	stage.height($cont.height());
	stage.width($cont.width());
	
	var cont = getContainer(data.entities);
	var origin = getOrigin(cont);
	
	for ( var i = 0; i < data.entities.length; i++) {

		var configElement = data.entities[i];
		drawRectWithText( configElement, origin, cont );
	}
}

function tansposeY( ent, cont ){
	return cont.h/ZOOM_FACTOR - (ent.posY + ent.height);
}
function drawRectWithText( cfg, origin, cont ){
	//var layer = new Kinetic.Layer();
	var ent = cfg.shape;
	var posY = tansposeY( ent, cont );
	
	var px = origin.w + parseFloat( ent.posX ) * ZOOM_FACTOR,
		py = origin.h + parseFloat( posY ) * ZOOM_FACTOR,
		w = parseFloat( ent.width ) * ZOOM_FACTOR,
		h = parseFloat( ent.height ) * ZOOM_FACTOR;
	
    // bound below y=50
    var blueGroup = new Kinetic.Group({
      x: px,
      y: py,
      draggable: cfg.isMoveable,
      dragBoundFunc: function(pos) {
        return pos;
      }
    });
    
    var blueText = new Kinetic.Text({
      fontSize: TEXT_SIZE,
      fontFamily: 'Calibri',
      text: cfg.isVisible ? cfg.label : '',
      fill: '#FFFFFF',
      padding: 2
    });
    
    var blueRect = new Kinetic.Rect({
	  width: w,
      height: h,
      fill: '',
      stroke: '#00FFFF',
      strokeWidth: 1
    });

    blueGroup.on('dragstart', function(e) {
        console.log('dragstart %o %o ', e, e.target.tagName);
    });
    blueGroup.on('dragend', function(e) {
    	console.log('dragend %o %o ', e, e.target.tagName);
    });
    
    blueGroup.add(blueRect).add(blueText);
    layer.add(blueGroup);
    stage.add(layer);
}
