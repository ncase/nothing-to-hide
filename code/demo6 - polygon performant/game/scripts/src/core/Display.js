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
		Display.dom.appendChild(_addCanvas("game"));
		Display.dom.appendChild(_addCanvas("ui"));
		_addCanvas("tmp");

	};

	// Resize
	Display.resize = function(event){

		// Set Canvas Dimensions
		Display.width = event.target.innerWidth;
		Display.height = event.target.innerHeight;
		Display.dom.style.width = Display.width+"px";
		Display.dom.style.height = Display.height+"px";

		for(var id in Display.canvas){
			Display.canvas[id].width = Display.width;
			Display.canvas[id].height = Display.height;
		}

	};
	window.onresize = Display.resize;

	// Add canvas
	var _addCanvas = function(layerID){

		var canvas = document.createElement("canvas");
		canvas.id = layerID;
		canvas.width = Display.width;
		canvas.height = Display.height;

		Display.canvas[layerID] = canvas;
		Display.context[layerID] = canvas.getContext('2d');

		return canvas;

	};

	// Quick clear
	Display.clear = function(){
		for(var id in Display.context){
			Display.context[id].clearRect(0,0,Display.width,Display.height);
		}
	};

})(window);