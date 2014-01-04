function start(){
	window.top.gotoPage("cutscene/cutscene");
}

var canvas = document.getElementById("screen");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx = canvas.getContext("2d");

var tempCanvas = document.createElement("canvas");
tempCanvas.width = document.body.clientWidth;
tempCanvas.height = document.body.clientHeight;
var tempCtx = tempCanvas.getContext("2d");

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame   || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();


var segments = [];

var bg = new Image();
bg.src = "bg.jpg";

function init() {
	var width = canvas.width;
	var height = canvas.height;
	var mouse_x = width/2;
	var mouse_y = height/2;
	var changed = true;
	var polygons = [];

	setup();
	requestAnimFrame(update);

	function setup() {
		polygons.push([[-10,-10],[width+10,-10],[width+10,height+10],[-10,height+10]]);
		/*polygons.push([[240,240],[260,240],[260,260],[240,260]]);
		polygons.push([[240,260],[260,260],[260,280],[240,280]]);
		polygons.push([[260,240],[280,240],[280,260],[260,260]]);
		polygons.push([[440,240],[460,240],[460,260],[440,260]]);
		polygons.push([[250,100],[260,140],[240,140]]);
		polygons.push([[280,100],[290,60],[270,60]]);
		polygons.push([[310,100],[320,140],[300,140]]);
		polygons.push([[50,450],[60,370],[70,450]]);
		polygons.push([[450,450],[460,370],[470,450]]);
		polygons.push([[50,50],[60,30],[70,50]]);
		polygons.push([[450,50],[460,30],[470,50]]);
		polygons.push([[140,340],[160,240],[180,340],[360,340],[360,360],[250,390],[140,360]]);
		polygons.push([[140,140],[150,130],[150,145],[165,150],[160,160],[140,160]]);*/
		//polygons.push([[300,300],[500,300],[500,400],[300,400]]);
		segments = VisibilityPolygon.convertToSegments(polygons);
		segments.push([ [300,300-150],[500,300-150] ]);
		segments.push([ [300,300-150],[300,400-150] ]);
		segments.push([ [500,300-150],[500,400-150] ]);
		segments.push([ [300,300],[500,300] ]);
		segments.push([ [300,300],[300,400] ]);
		segments.push([ [500,300],[500,400] ]);
		segments.push([ [300,300+150],[500,300+150] ]);
		segments.push([ [300,300+150],[300,400+150] ]);
		segments.push([ [500,300+150],[500,400+150] ]);
	};

	canvas.onmousemove = function(e) {
		var x = e.clientX;
		var y = e.clientY;
		if (x < 0 || x > width || y < 0 || y > height) return;
		mouse_x = x;
		mouse_y = y;
		changed = true;
	};

	function update() {
		if(changed){

			// Mask layer
			tempCtx.clearRect(0, 0, width, height);
			draw(mouse_x, mouse_y, 1);
			/*draw(mouse_x+5, mouse_y+5, 0.1);
			draw(mouse_x+5, mouse_y-5, 0.1);
			draw(mouse_x-5, mouse_y+5, 0.1);
			draw(mouse_x-5, mouse_y-5, 0.1);*/

			// Game layer
			ctx.clearRect(0, 0, width, height);
			ctx.drawImage(bg,0,0);
			ctx.globalCompositeOperation = "destination-in";
			ctx.drawImage(tempCanvas,0,0);
			ctx.globalCompositeOperation = "source-over";

		}
		requestAnimFrame(update);
	};

	tempCtx.fillStyle = "#000";
	function draw(x,y,opacity) {
		// NORMAL //
		var poly = VisibilityPolygon.compute([x, y], segments);
		tempCtx.beginPath();
		tempCtx.globalAlpha = opacity;
		tempCtx.moveTo(poly[0][0], poly[0][1]);
		for (var i = 1; i < poly.length; ++i) {
			tempCtx.lineTo(poly[i][0], poly[i][1]);
		}
		tempCtx.fill();
		tempCtx.globalAlpha = 1;
	};

};



window.onload = init;