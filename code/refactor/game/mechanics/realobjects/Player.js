function Player(level){

	var self = this;
	self.level = level;
	self.level.player = self;

	// MOVEMENT //
	self.x = 0;
	self.y = 0;
	self.vx = 0;
	self.vy = 0;
	self.NORMAL_SPEED = 2/Game.FPS; // 2.0 tiles/second
	self.SLOW_SPEED = 0.7/Game.FPS; // 0.5 tiles/second

	// ANIMATION //
	var ANIM_STAND = 0;
	var ANIM_WALK_LEFT = 1;
	var ANIM_WALK_RIGHT = 2;
	self.animState = ANIM_STAND;
	
	//////////////

	self.init = function(){

		// Tagging
		level.setTag(self,"sighted");
		level.setTag(self,"slideable");

		// Position should be in center of its tile
		self.x += 0.5;
		self.y += 0.5;

		// Sprite
		self.anim = {
			leg_stand: new Sprite("poppy/leg_stand"),
			leg_walk: new Sprite("poppy/leg_walk"),
			body: new Sprite("poppy/body"),
			face_meh: new Sprite("poppy/face_meh"),
			face_derp: new Sprite("poppy/face_derp")
		};		

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
		var animState;
		if(Key.left||Key.right||Key.down||Key.up||Key.slow){
			animState = (direction>0) ? ANIM_WALK_RIGHT : ANIM_WALK_LEFT;
		}else{
			animState = ANIM_STAND;
		}

	    // If new sprite, start anim from 0, else animate
		if(animState!=self.animState){
			self.animState = animState;
			//sprite.frameIndex = 0;
			bounceVel -= 0.1;
		}else{
			//sprite.nextFrame(); // TODO: SLOW DOWN ANIM.
			bounceVel += (1-bounce)*0.8;
			bounceVel *= 0.5;
			bounce += bounceVel;
		}
		if(bounce<0.7) bounce=0.6;
		if(bounce>1.3) bounce=1.3;

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
	self.draw = function(ctx,options){

		var sprite = self.currentSprite;

		// Which direction to face
		if(Key.left && !Key.right) direction=-1;
		if(Key.right && !Key.left) direction=1;

		// Position & scale
		ctx.save();
		ctx.translate(self.x*W, self.y*H);
		ctx.scale(direction*(1/bounce), bounce);

		// Draw legs, then body, then face
		var legs = (self.animState==0) ? self.anim.leg_stand : self.anim.leg_walk;
		legs.nextFrame();
	    legs.draw(ctx);

	    var body = self.anim.body;
	    body.y = -40;
	    body.draw(ctx);

	    var face = (direction>0) ? self.anim.face_meh : self.anim.face_derp;
	    face.x = 8;
	    face.y = -94;
	    //face.y = -96 - (self.x-0.5)*10;
	    face.draw(ctx);

	    // Pickup?
	    var holding = level.pickupLogic.holding;
	    if(holding){
	    	holding.drawPickup(ctx,options);
	    }

	    // Restore
	    ctx.restore();

	};

	self.updateSight = function(){
		self.sightPolygon = SightAndLight.compute(self, level.shadow.shadows);
	};

	self.speak = function(message){
		publish("dialogue/show",[self.x,self.y-1.5,message]);
	};
	
}
