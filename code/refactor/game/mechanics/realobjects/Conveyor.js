function Conveyor(level){
	
	var self = this;
	self.level = level;

	////////////////

	self.FILL_CONVEYOR = "texture/conveyor";
	self.LOOP_TEXTURE = 1;

	////////////////

	self.init = function(){
		
		level.setTag(self,"floor");

		// Fills
		var _createTextureIfNeeded = function(fill){
			if(fill[0]=="#") return fill; // color
			return Game.context.createPattern(Asset.image[fill], 'repeat'); // texture
		};
		self.FILL_CONVEYOR = _createTextureIfNeeded(self.FILL_CONVEYOR);

		// position & velocity
		self.vel = 1;
		self.pos = 0;

		// direction magnitude
		var dx = self.direction.x;
		var dy = self.direction.y;
		self.direction.mag = Math.sqrt(dx*dx+dy*dy);
		self.direction.angle = Math.atan2(self.direction.y,self.direction.x);

	};

	self.update = function(){

		// Get all slideable objects
		var slideables = level.getTagged("slideable");

		// Sliding
		var t = self.vel/Game.FPS;
		self.pos += t * self.direction.mag;
		if(self.pos>self.LOOP_TEXTURE) self.pos-=self.LOOP_TEXTURE;

		// For everyone one of them, if they're colliding, slide 'em
		for(var i=0;i<slideables.length;i++){
			var slideable = slideables[i];
			if(self.hitTest(slideable.x,slideable.y)){				
				slideable.x += t*self.direction.x;
				slideable.y += t*self.direction.y;
			}
		}

	};
	
	self.drawFloor = function(ctx){
	
		// Rectangular Path
		ctx.beginPath();
		ctx.rect(self.x*W, self.y*H, self.width*W, self.height*H);

		// The texture in the right distance & direction.
		ctx.fillStyle = self.FILL_CONVEYOR;
		ctx.save();
		ctx.translate(-self.x*W,-self.y*H);
		ctx.rotate(self.direction.angle);
		ctx.translate(self.pos*W,0);
		ctx.fill();
		ctx.restore();

	};
	
	self.hitTest = function(x,y){
		return (x>self.x && x<self.x+self.width && y>self.y && y<self.y+self.height);
	};
	
}