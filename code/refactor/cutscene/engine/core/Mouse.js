(function(exports){

	// Singleton
	var Mouse = {
		x: 0,
		y: 0,
		pressed: false
	};
	exports.Mouse = Mouse;

	// Event Handling
	var onMouseDown = function(event){
	    Mouse.pressed = true;
	    onMouseMove(event);
	};
	var onMouseUp = function(event){
	    Mouse.pressed = false;
	};
	var onMouseMove = function(event){
		Mouse.x = event.clientX;
		Mouse.y = event.clientY;
	};
	var onMouseScroll = function(event){
		publish("mouse/scroll",[event]);
	};

	canvas.addEventListener("mousedown",onMouseDown,false);
	canvas.addEventListener("mouseup",onMouseUp,false);
	canvas.addEventListener("mousemove",onMouseMove,false);

	canvas.addEventListener("wheel", onMouseScroll, false);	
	canvas.addEventListener("mousewheel", onMouseScroll, false);
	canvas.addEventListener("DOMMouseScroll", onMouseScroll, false);

})(window);