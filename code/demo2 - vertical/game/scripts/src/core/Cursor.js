(function(exports){

	// Singleton
	var Cursor = {};
	exports.Cursor = Cursor;
	
	Cursor.active = false;
	Cursor.init = function(){
		document.body.style.cursor = 'none';
		Cursor.active = true;
		cursorSprite = new Sprite("Cursor");
	};

	var cursorSprite;

	Cursor.draw = function(){

		var ctx = Display.context.background;

		// Mouse Position
		var mx = Mouse.x + (Game.level.camera.x-Display.width/2);
		var my = Mouse.y + (Game.level.camera.y-Display.height/2);

		// Frame Index
		cursorSprite.frameIndex = (Cursor.hovering>0) ? 2 : 0;
		if(Mouse.pressed){
			cursorSprite.frameIndex += 1;
		}

		// Draw the damn thing
		cursorSprite.x = mx;
		cursorSprite.y = my;
		cursorSprite.draw(ctx);

		// Reset
		Cursor.hovering = 0;

	};

})(window);