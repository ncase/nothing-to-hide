(function(exports){

	// Singleton
	var Cursor = {};
	exports.Cursor = Cursor;
	
	Cursor.active = false;
	Cursor.init = function(){
		document.body.style.cursor = 'none';
		Cursor.active = true;
	};

	Cursor.draw = function(){

		var ctx = Display.context.background;

		// Mouse Position
		var mx = Mouse.x + (Game.level.camera.x-Display.width/2);
		var my = Mouse.y + (Game.level.camera.y-Display.height/2);

		// Draw the damn thing
		var sprite = Asset.sprite.Cursor;
		var spriteImage = sprite.image;
		var spriteData = sprite.data;
		var frame = spriteData.frames[0].frame;
		ctx.save();
		ctx.translate(mx,my);
	    var offset = spriteData.frames[0].spriteSourceSize;
	    ctx.translate(offset.x,offset.y);
	    ctx.drawImage(spriteImage,frame.x,frame.y,frame.w,frame.h,0,0,frame.w,frame.h);
		ctx.restore();

	};

})(window);