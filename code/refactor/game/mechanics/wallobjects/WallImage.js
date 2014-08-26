function WallImage(level){
	
	var self = this;
	self.level = level;

	self.init = function(){
		self.image = Asset.image[self.image];
		self.dirty = true;
	};

	self.update = function(){
	};

	self.draw = function(ctx){

		// Static images are forever static
		if(!self.dirty) return;
		self.dirty = false;
		
		// Yeah just draw it
		ctx.drawImage(self.image, self.x*W, self.y*H);

	};
	
}