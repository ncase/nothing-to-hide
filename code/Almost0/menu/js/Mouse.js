(function(exports){

	// Singleton
	var Mouse = {
		x: WIDTH/2,
		y: HEIGHT/2,
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

	var container;
	var onMouseMove = function(event){
		
		Mouse.realX = event.clientX;
		Mouse.realY = event.clientY;

		Mouse.x = Mouse.realX;
		Mouse.y = Mouse.realY;

		// BOUNDS
		if(Mouse.x<0) Mouse.x=0;
		if(Mouse.y<0) Mouse.y=0;
		if(Mouse.x>WIDTH) Mouse.x=WIDTH;
		if(Mouse.y>HEIGHT) Mouse.y=HEIGHT;

	};
	window.onmousedown = onMouseDown;
	window.onmouseup = onMouseUp;
	window.onmousemove = onMouseMove;

})(window);