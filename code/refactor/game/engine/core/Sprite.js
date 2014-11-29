function Sprite(spriteName){

	var self = this;

	// Sprite data
	var sprite = Asset.sprite[spriteName];
	self.sprite = sprite;
	self.image = sprite.image;
	self.gray = sprite.gray;
	self.data = sprite.data;

	// Transform
	self.x = 0;
	self.y = 0;
	self.regX = self.data.regX || 0;
	self.regY = self.data.regY || 0;
	self.scaleX = self.data.scaleX || 1;
	self.scaleY = self.data.scaleY || 1;
	self.rotation = 0;

	// Frame
	self.frameIndex = 0;
	self.nextFrame = function(){
		self.frameIndex = (self.frameIndex+1)%self.data.frames;
	};

	self.draw = function(ctx,options){

		// Default options
		options = options || {gray:false};

		// Save
		ctx.save();

	    // Self's Transform, Scale, Rotation
	    ctx.translate(self.x, self.y);
	    ctx.scale(self.scaleX, self.scaleY);
	    ctx.rotate(self.rotation);
	    ctx.translate(-self.regX, -self.regY);

	    // Draw the damn thing
	    var frameW = self.data.width;
	    var frameH = self.data.height;
	    var frameX = (self.frameIndex*frameW) % self.image.width;
	    var frameY = Math.floor( (self.frameIndex*frameW) / self.image.width ) * frameH;
    	ctx.drawImage(
    		options.gray ? self.gray : self.image,
    		frameX+1, frameY+1, frameW-1, frameH-1, // HACK.
    		0, 0, frameW-1, frameH-1);

    	// Restore
	    ctx.restore();

	}
};