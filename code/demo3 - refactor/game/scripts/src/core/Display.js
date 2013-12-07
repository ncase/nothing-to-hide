(function(exports){

	// Singleton
	var Display = {};
	exports.Display = Display;

	// Layer Configs
	var LAYERS = [
		{id:"backgroundCam"},
		{id:"shadowsCam"},
		{id:"background"},
		{id:"shadows",invisible:true}
	];

	// Initialize
	Display.init = function(config){

		// Init DOM
		Display.dom = config.dom;
		Display.canvas = {};
		Display.context = {};

		// Set canvas layers
		LAYERS.map(function(layer){
			var id = layer.id;
			var invisible = layer.invisible;
			var canvas = document.createElement("canvas");
			if(!invisible){
				Display.dom.appendChild(canvas);
			}
			canvas.id = id;
			Display.canvas[id] = canvas;
			Display.context[id] = canvas.getContext('2d');
		});

		// HACK:
		//Display.canvas.background.style.opacity = 0.7;

		// Set Dimensions
		Display.width = config.width;
		Display.height = config.height;
		Display.dom.style.width = Display.width+"px";
		Display.dom.style.height = Display.height+"px";
		for(var id in Display.canvas){
			Display.canvas[id].width = Display.width;
			Display.canvas[id].height = Display.height;
		}

	};

	// Quick clear
	Display.clear = function(){
		for(var id in Display.context){
			Display.context[id].clearRect(0,0,Display.width,Display.height);
		}
	};

})(window);