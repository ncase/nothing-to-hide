(function(exports){

	// Singleton
	var Cursor = {};
	exports.Cursor = Cursor;
	
	Cursor.active = false;
	Cursor.init = function(){
		Cursor.active = true;
		cursorSprite = new Sprite("Cursor");
	};

	var cursorSprite;
	var lastPos = {x:0,y:0};
	var stillness = 0;

	Cursor.update = function(){
		
		// Reset - number of clickable things you're hovering.
		Cursor.hovering = 0;

		// Mouse Velocity
		var mx = Mouse.realX || 0;
		var my = Mouse.realY || 0;
		var dx = lastPos.x-mx;
		var dy = lastPos.y-my;
		// Less than 5px movement
		if(dx*dx+dy*dy<25){
			if(stillness>0) stillness--;
		}else{
			stillness = 10; // Must be still for 1/3 a second
		}
		Cursor.still = (stillness==0);

		// Cursor clicked
		if(!Mouse.pressed){
			Cursor.clicked = false;
		}

	}

	Cursor.hovering = 0;
	Cursor.draw = function(){

		if(!Cursor.active) return;

		var ctx = Display.context.ui;

		// Mouse Position
		var mx = Mouse.realX || 0;
		var my = Mouse.realY || 0;

		// Frame Index
		cursorSprite.frameIndex = (Cursor.hovering>0) ? 2 : 0;
		if(Mouse.pressed){
			cursorSprite.frameIndex += 1;
		}

		// Wipe last thing
		ctx.clearRect(lastPos.x-10,lastPos.y-10,70,70);
		lastPos.x = mx;
		lastPos.y = my;

		// Draw the damn thing
		cursorSprite.x = mx;
		cursorSprite.y = my;
		cursorSprite.draw(ctx);

	};

})(window);