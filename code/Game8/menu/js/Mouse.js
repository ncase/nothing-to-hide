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
	var onMouseMove = function(event){
		
		Mouse.realX = event.clientX;
		Mouse.realY = event.clientY;

		var container = document.querySelector("canvas#screen");
		if(!container){
			Mouse.x = Mouse.realX;
			Mouse.y = Mouse.realY;
			return;
		}
		Mouse.x = event.clientX - container.offsetLeft;
		Mouse.y = event.clientY - container.offsetTop;

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