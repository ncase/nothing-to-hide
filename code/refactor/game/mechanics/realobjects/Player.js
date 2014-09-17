function Player(level){

	var self = this;
	self.level = level;

	///////////

	self.level.player = self;
	level.setTag(self,"sighted");

	//////////////

	// MOVEMENT //
	self.x = 0;
	self.y = 0;
	self.vx = 0;
	self.vy = 0;
	self.NORMAL_SPEED = 2/Game.FPS; // 2.0 tiles/second
	self.SLOW_SPEED = 0.7/Game.FPS; // 0.5 tiles/second

	// ANIMATION //
	self.currentSprite = null;
	self.IDLE_ANIM = "Poppy_Bored_Idle";
	self.WALK_ANIM = "Poppy_Bored_Walk";

	//////////////

	self.init = function(){

		// Position should be in center of its tile
		self.x += 0.5;
		self.y += 0.5;

		// Animation
		self.IDLE_ANIM = new Sprite(self.IDLE_ANIM);
		self.WALK_ANIM = new Sprite(self.WALK_ANIM);
		self.currentSprite = self.IDLE_ANIM;

		// For reasons
		self.deactivated = false;

		// Sight Polygon immediately
		self.updateSight();

	};

	self.update = function(){

		// MOVE based on KEY INPUT
		var speed = (Key.slow || level.sightLogic.alert) ? self.SLOW_SPEED : self.NORMAL_SPEED;
		if(!self.deactivated){
			if(Key.left) self.vx-=speed;
			if(Key.right) self.vx+=speed;
			if(Key.up) self.vy-=speed;
			if(Key.down) self.vy+=speed;
		}

		// MOVEMENT and Velocity
		self.x += self.vx;
		self.y += self.vy;
		self.vx *= 0.5;
		self.vy *= 0.5;

		// Pressing against wall?
		var map = self.level.map;
		if(map.hitTest(self.x,self.y-0.2)){
			publish("wall/press", [self.x, self.y-0.2]);
		}

		// Crappy Collision Detection
	    var endLoop;
	    endLoop = 100;
	    while(_hitTest(self.x,self.y+0.01) && (endLoop--)>0) self.y-=0.01;
	    while(_hitTest(self.x,self.y-0.2) && (endLoop--)>0) self.y+=0.01;
	    endLoop = 100;
	    while(_hitTest(self.x-0.2,self.y) && (endLoop--)>0) self.x+=0.01;
	    while(_hitTest(self.x+0.2,self.y) && (endLoop--)>0) self.x-=0.01;
	    if(endLoop<=0) console.log("WOOPS");

	    // ANIMATION //

	    // What sprite to use
		var sprite;
		if(Key.left||Key.right||Key.down||Key.up||Key.slow){
			sprite = self.WALK_ANIM;
		}else{
			sprite = self.IDLE_ANIM;
		}

	    // If new sprite, start anim from 0, else animate
		if(sprite!=self.currentSprite){
			sprite.frameIndex = 0;
			self.currentSprite = sprite;
			bounceVel -= 0.1;
		}else{
			sprite.nextFrame(); // TODO: SLOW DOWN ANIM.
			bounceVel += (1-bounce)*0.8;
			bounceVel *= 0.5;
			bounce += bounceVel;
		}

	};

	var _hitTest = function(x,y){

		// Test Map
		if(self.level.map.hitTest(x,y)){
			return true;
		}

		// Test All Blocks
		var blocks = level.getTagged("block");
		for(var i=0;i<blocks.length;i++){
			var block = blocks[i];
			if(block.hitTest(x,y)) return true;
		}

		// Naw
		return false;

	};

	var direction = 1;
	var bounceVel = 0;
	var bounce = 1;
	self.draw = function(ctx){

		var sprite = self.currentSprite;

		// Which direction to face
		if(Key.left && !Key.right) direction=-1;
		if(Key.right && !Key.left) direction=1;

		// Position & scale the sprite
		sprite.x = self.x*W;
		sprite.y = self.y*H;
		sprite.scaleX = direction * (1/bounce);
		sprite.scaleY = bounce;

		// Draw it
	    sprite.draw(ctx);

	};

	self.updateSight = function(){
		self.sightPolygon = SightAndLight.compute(self, level.shadow.shadows);
	};

	self.speak = function(message){
		publish("dialogue/show",[self.x,self.y-1.5,message]);
	};
	
}
