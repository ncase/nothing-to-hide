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
	window.onmousedown = onMouseDown;
	window.onmouseup = onMouseUp;
	window.onmousemove = onMouseMove;

})(window);