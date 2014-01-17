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
	var container;
	var onMouseMove = function(event){
		
		Mouse.realX = event.clientX;
		Mouse.realY = event.clientY;

		container = container || document.querySelector("canvas#game");
		if(!container){
			Mouse.x = Mouse.realX;
			Mouse.y = Mouse.realY;
			return;
		}
		Mouse.x = event.clientX - container.offsetLeft;
		Mouse.y = event.clientY - container.offsetTop;

	};
	window.onmousedown = onMouseDown;
	window.onmouseup = onMouseUp;
	window.onmousemove = onMouseMove;

})(window);