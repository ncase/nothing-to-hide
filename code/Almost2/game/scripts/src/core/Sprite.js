(function(exports){

	var Sprite = function(spriteName){

		var self = this;

		var sprite = Asset.sprite[spriteName];
		self.sprite = sprite;
		self.image = sprite.image;
		self.data = sprite.data;

		self.x = 0;
		self.y = 0;
		self.regX = 0;
		self.regY = 0;
		self.scaleX = 1;
		self.scaleY = 1;
		self.rotation = 0;
		self.frameIndex = 0;

		this.draw = function(ctx){
			
			var frame = self.data.frames[self.frameIndex].frame;
			ctx.save();

		    // Self's Transform, Scale, Rotation
		    ctx.translate(self.x, self.y);
		    ctx.scale(self.scaleX, self.scaleY);
		    ctx.rotate(self.rotation);
		    ctx.translate(self.regX, self.regY);

		    // Draw the damn thing
		    var offset = self.data.frames[self.frameIndex].spriteSourceSize;
		    ctx.translate(offset.x,offset.y);
		    if(frame.x>=0 && frame.y>=0 && frame.w>0 && frame.h>0){
		    	ctx.drawImage(self.image,frame.x,frame.y,frame.w,frame.h,0,0,frame.w,frame.h);
		    }

		    ctx.restore();

		}

	};

	exports.Sprite = Sprite;

})(window);