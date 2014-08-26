function WallSprite(level){
	
	var self = this;
	self.level = level;

	self.init = function(){
		self.sprite = new Sprite(self.sprite);
		self.sprite.x = self.x*W;
		self.sprite.y = self.y*H;
		self.sprite.regX = 0;
		self.sprite.regY = 0;
	};
	
	self.update = function(){
	};

	self.draw = function(ctx){

		var x = self.x*W;
		var y = self.y*H;
		var w = self.sprite.data.width;
		var h = self.sprite.data.height;

		// Draw over with background colour
		ctx.fillStyle = level.screens.FILL_BACKGROUND;
		ctx.fillRect(x,y,w,h); 

		// Draw sprite
		self.sprite.nextFrame();
		self.sprite.draw(ctx);

	};
	
}