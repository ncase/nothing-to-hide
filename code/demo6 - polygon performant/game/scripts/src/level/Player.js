(function(exports){

	var Player = function(level,config){
		
		var self = this;

		// Properties
		this.level = level;
		this.config = config;
		this.x = config.x;
		this.y = config.y;
		this.vx = this.vy = 0;

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){

			///////////////////////
			// CLICK TO PUT DOWN

			// Hovering...
			var hovering = false;
			var mx = Mouse.x - level.camera.cx;
	    	var my = Mouse.y - level.camera.cy;
	    	var dx = self.x - mx;
			var dy = (self.y-50) - my;
			if(dx*dx + dy*dy < 35*35){
				hovering = true;
				Cursor.hovering++;
			}

			// Adding/Removing a new light.
			if(self.holdingPrism && !self.isMoving){
				if(!lastMousePressed && Mouse.pressed){ // Click
			    	if(hovering){
			    		level.prisms.dropPrism();
			    		Mouse.pressed = false;
			    		return;
					}
			    }
			}
			lastMousePressed = Mouse.pressed;

		    // Velocity via click
		    var MAX_SPEED = 10;
		    var isMoving = false;
		    var vx = 0;
		    var vy = 0;
		    if(Mouse.pressed){
		    	var mx = Mouse.x - level.camera.cx;
		    	var my = Mouse.y - level.camera.cy;
			    var dx = mx - self.x;
			    var dy = my - self.y;
			    var mag = Math.sqrt(dx*dx+dy*dy);
			    var speed = MAX_SPEED;
			    /*if(mag<5*MAX_SPEED){
			    	speed *= 0.5;
			    }*/
			    if(mag>MAX_SPEED){
			    	isMoving = true;
				    vx = (dx/mag) * speed;
				    vy = (dy/mag) * speed;
				}
			}
		    self.vx = vx*0.5 + self.vx*0.5;
		    self.vy = vy*0.5 + self.vy*0.5;
		    self.isMoving = isMoving;

		    // Stop completely
		    if(Math.abs(this.vx)<0.01) this.vx=0;
		    if(Math.abs(this.vy)<0.01) this.vy=0;

		    // Move
		    this.x += this.vx;
		    this.y += this.vy;

		    // Crappy Collision
		    var endLoop = MAX_SPEED*5;
		    while(level.map.hitTest(this.x+15+this.vx,this.y) && (endLoop--)>0) this.x-=1;
		    while(level.map.hitTest(this.x-15+this.vx,this.y) && (endLoop--)>0) this.x+=1;
		    while(level.map.hitTest(this.x,this.y+10+this.vy) && (endLoop--)>0) this.y-=1;
		    while(level.map.hitTest(this.x,this.y-10+this.vy) && (endLoop--)>0) this.y+=1;
		    if(endLoop<=0) console.log("WOOPS");


		    /////////////////////////////////////////////////
		    // FRAME LOGIC: For stable walking despite FPS //
		    /////////////////////////////////////////////////


			// Facing which way?
		    if(self.vx<-0.1) faceDirection = -1;
		    if(self.vx>0.1) faceDirection = 1;

			// Frame Logic: VERY CUSTOMIZED FOR THE BAG SWINGING
		    if(isMoving){
		    	if(animState!="Walk"){
		    		frameIndex=0;
		    		animState = "Walk";
		    	}
		    	frameIndex += 3;
		    	if(frameIndex>=28) frameIndex=0;
		    }else{
		    	if(animState!="Idle"){
		    		frameIndex=0;
		    		animState = "Idle";
		    	}
		    	frameIndex += 1;
		    	if(frameIndex>=120) frameIndex=0;
		    }

			// Footstep Sounds!
			if(animState=="Walk"){
				var cx = level.camera.x;
				var pan = (self.x-cx)/(Display.width/2);
				if(frameIndex==3){
					createjs.Sound.play("sfx_footstep_1", null,0,0,false,0.5,pan);
				}
				if(frameIndex==18){
					createjs.Sound.play("sfx_footstep_2", null,0,0,false,0.2,pan);
				}
			}

		};
		var lastMousePressed = false;

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var ctx = Display.context.game;
		var frameIndex = 0;
		var faceDirection = 1;
		var animState = "Idle";

		var playerSprites = {
			Idle: new Sprite("Poppy_Idle"),
			Walk: new Sprite("Poppy_Walk")
		};
		playerSprites.Idle.scaleX = 0.9;
		playerSprites.Idle.scaleY = 0.9;
		playerSprites.Idle.regX = -25;
		playerSprites.Idle.regY = -150;
		playerSprites.Walk.scaleX = 0.9;
		playerSprites.Walk.scaleY = 0.9;
		playerSprites.Walk.regX = -25;
		playerSprites.Walk.regY = -150;

		var buttonSprite = new Sprite("Button");
		buttonSprite.regX = -40;
		buttonSprite.regY = -40;
		buttonSprite.scaleX = buttonSprite.scaleY = 0;
		var buttonRotation = 0;

		this.draw = function(){

			// CLICK ME
			if(self.holdingPrism){
				buttonSprite.scaleX = buttonSprite.scaleX*0.5 + 1*0.5;
			}else{
				buttonSprite.scaleX = buttonSprite.scaleX*0.5 + 0*0.5;
			}

			// Placeholder CLICK ME circle
			if(buttonSprite.scaleX>0.03){
				buttonSprite.scaleY = buttonSprite.scaleX;
				buttonSprite.frameIndex = 1;
				buttonSprite.rotation = 0;
				buttonSprite.x = self.x;
				buttonSprite.y = self.y-50;
				buttonSprite.draw(ctx);
			}

		    // Which Spritesheet to use
		    var sprite = playerSprites[animState];

		    // Draw It!
			sprite.frameIndex = Math.floor(frameIndex);
			sprite.x = self.x;
			sprite.y = self.y;
		    sprite.scaleX = faceDirection*0.9;
		    sprite.draw(ctx);

			// Placeholder CLICK ME circle
			if(buttonSprite.scaleX>0.03){
				buttonSprite.frameIndex = 0;
				buttonSprite.rotation = buttonRotation;
				buttonRotation += 0.05;
				buttonSprite.draw(ctx);
			}

		};

	};

	exports.Player = Player;

})(window);