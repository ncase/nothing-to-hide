(function(exports){

	// Singleton
	var Display = {};
	exports.Display = Display;

	// Initialize
	Display.init = function(config){

		// Init DOM
		Display.dom = config.dom;
		Display.canvas = {};
		Display.context = {};

		// Set Canvas Dimensions
		Display.width = Display.dom.clientWidth;
		Display.height = Display.dom.clientHeight;
		Display.dom.style.width = Display.width+"px";
		Display.dom.style.height = Display.height+"px";

		// Canvasses
		_addCanvas("game");
		_addCanvas("ui");

	};

	// Add canvas
	var _addCanvas = function(layerID){

		var canvas = document.createElement("canvas");
		canvas.id = layerID;
		canvas.width = Display.width;
		canvas.height = Display.height;

		Display.dom.appendChild(canvas);

		Display.canvas[layerID] = canvas;
		Display.context[layerID] = canvas.getContext('2d');

	};

	// Quick clear
	Display.clear = function(){
		for(var id in Display.context){
			Display.context[id].clearRect(0,0,Display.width,Display.height);
		}
	};

})(window);