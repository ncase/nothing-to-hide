function Player(level){

	var self = this;
	self.level = level;
	self.level.player = self;

	//////////////

	// MOVEMENT //
	self.x = 0;
	self.y = 0;
	self.vx = 0;
	self.vy = 0;
	self.NORMAL_SPEED = 2/Game.FPS; // 2.0 tiles/second
	self.SLOW_SPEED = 0.5/Game.FPS; // 0.5 tiles/second

	// ANIMATION //
	self.currentSprite = null;
	self.IDLE_ANIM = "Poppy_Bored_Idle";
	self.WALK_ANIM = "Poppy_Bored_Walk";

	//////////////

	self.init = function(){
		self.IDLE_ANIM = new Sprite(self.IDLE_ANIM);
		self.WALK_ANIM = new Sprite(self.WALK_ANIM);
		self.currentSprite = self.IDLE_ANIM;
	};

	self.update = function(){

		// MOVE based on KEY INPUT

		var speed = Key.slow ? self.SLOW_SPEED : self.NORMAL_SPEED;
		if(Key.left) self.vx-=speed;
		if(Key.right) self.vx+=speed;
		if(Key.up) self.vy-=speed;
		if(Key.down) self.vy+=speed;

		self.x += self.vx;
		self.y += self.vy;
		self.vx *= 0.8;
		self.vy *= 0.8;

	};
	self.draw = function(ctx){

		// What sprite to use
		var sprite;
		if(Key.left||Key.right||Key.down||Key.up||Key.slow){
			sprite = self.WALK_ANIM;
		}else{
			sprite = self.IDLE_ANIM;
		}

		// If new sprite, start anim from 0
		if(sprite!=self.currentSprite){
			sprite.frameIndex = 0;
		}

		// Position the sprite
		sprite.x = self.x*W;
		sprite.y = self.y*H;
	    sprite.draw(ctx);

	};
	
}
