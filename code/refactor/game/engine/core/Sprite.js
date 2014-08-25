function Sprite(spriteName){

	var self = this;

	// Sprite data
	var sprite = Asset.sprite[spriteName];
	self.sprite = sprite;
	self.image = sprite.image;
	self.size = sprite.size;

	// Transform
	self.x = 0;
	self.y = 0;
	self.regX = 0;
	self.regY = 0;
	self.scaleX = 1;
	self.scaleY = 1;
	self.rotation = 0;

	// Frame
	self.frameIndex = 0;

	this.draw = function(ctx){
		
		ctx.save();

	    // Self's Transform, Scale, Rotation
	    ctx.translate(self.x, self.y);
	    ctx.scale(self.scaleX, self.scaleY);
	    ctx.rotate(self.rotation);
	    ctx.translate(self.regX, self.regY);

	    // Draw the damn thing
	    var frameW = self.size.width;
	    var frameH = self.size.height;
	    var frameX = (self.frameIndex*frameW) % self.image.width;
	    var frameY = Math.floor( (self.frameIndex*frameW) / self.image.width ) * frameH;
    	ctx.drawImage(self.image,
    		frameX+1, frameY+1, frameW-1, frameH-1,
    		0, 0, frameW-1, frameH-1);

	    ctx.restore();

	}
};