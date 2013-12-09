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

	Cursor.update = function(){
		// Reset - number of clickable things you're hovering.
		Cursor.hovering = 0;
	}

	Cursor.draw = function(){

		var ctx = Display.context.ui;

		// Mouse Position
		var mx = Mouse.x;
		var my = Mouse.y;

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