(function(exports){

	var Player = function(level,config){
		
		var self = this;

		// Properties
		this.level = level;
		this.config = config;
		this.x = config.x;
		this.y = config.y;
		this.vx = this.vy = 0;
		this._CLASS = "Player";

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		var sneakMode = false;
		this.update = function(){

			// Sneak Mode
			sneakMode = Key.shift || level.suspicion.isHiding;
						//|| (level.heldObject&&level.heldObject.type=="dummy"); // Holding a person slows you down.

			///////////////////////
			// CLICK TO PUT DOWN

			// Hovering...
			var hovering = false;
			var mx = Mouse.x - level.camera.cx;
	    	var my = Mouse.y - level.camera.cy;
	    	var dx = self.x - mx;
			var dy = (self.y-50) - my;
			if(level.heldObject && dx*dx + dy*dy < 25*25){
				hovering = true;
				Cursor.hovering++;
			}

			// Adding/Removing a new light.
			if(level.heldObject && !self.isMoving){
				if(!lastMousePressed && Mouse.pressed){
			    	if(hovering){
			    		level.heldObject.drop();
			    		Mouse.pressed = false;
			    		Cursor.clicked = true;
			    		return;
					}
			    }
			}
			lastMousePressed = Mouse.pressed;

			// Adding/Removing a new light.
			if(level.heldObject && Key.justPressed.space){
	    		level.heldObject.drop();
	    		Key.justPressed.space = false;
			}

			// Movement keys pressed
			var keyMovement = (Key.left||Key.right||Key.up||Key.down||sneakMode);

		    // Velocity via click
		    var MAX_SPEED = 10;
		    var isMoving = false;
		    var vx = 0;
		    var vy = 0;
		    var gotoSpot = false;
	    	var mx = Mouse.x - level.camera.cx;
	    	var my = Mouse.y - level.camera.cy;

		    if(Mouse.pressed && !Cursor.clicked && !level.GAME_IS_OVER){
			    var dx = mx - self.x;
			    var dy = my - self.y;
			    var mag = Math.sqrt(dx*dx+dy*dy);
			    
			    if(mag>MAX_SPEED*2){
			    	isMoving = true;
				    vx = (dx/mag) * MAX_SPEED*0.75;
				    vy = (dy/mag) * MAX_SPEED*0.75;
				}else{
					gotoSpot = true;
				}

			}

			if(keyMovement && !level.GAME_IS_OVER){
				
				var dx = 0;
				if(Key.left) dx -= MAX_SPEED;
				if(Key.right) dx += MAX_SPEED;

			    var dy = 0;
			    if(Key.up) dy -= MAX_SPEED;
				if(Key.down) dy += MAX_SPEED;

			    var mag = Math.sqrt(dx*dx+dy*dy);
			    if(mag!=0){
				    var speed = sneakMode ? MAX_SPEED*0.25 : MAX_SPEED*0.75;
				    //if(mag>MAX_SPEED){
				    	isMoving = true;
					    vx = (dx/mag) * speed;
					    vy = (dy/mag) * speed;
					//}
				}

			}

		    self.vx = vx*0.5 + self.vx*0.5;
		    self.vy = vy*0.5 + self.vy*0.5;
		    self.isMoving = isMoving;

		    // Stop completely
		    if(Math.abs(this.vx)<0.01) this.vx=0;
		    if(Math.abs(this.vy)<0.01) this.vy=0;

		    // Move
		    var moveX = self.vx;
		    var moveY = self.vy;
		    if(gotoSpot){
		    	moveX += mx*0.2 - self.x*0.2;
		    	moveY += my*0.2 - self.y*0.2;
		    }
		    self.x += moveX;
		    self.y += moveY;

		    // Is my top being hit, and by a WALL?
			if(level.map.hitTest(this.x,this.y-11)){
				var x = Math.floor(this.x/Map.TILE_SIZE);
				var y = Math.floor((this.y-11)/Map.TILE_SIZE);
				
				console.log(x,y);
				publish("game/hitting_wall", [x,y]);

			}

		    // Crappy Collision
		    var endLoop;
		    endLoop = MAX_SPEED*2;
		    while(_hitTest(this.x,this.y+11) && (endLoop--)>0) this.y-=1;
		    while(_hitTest(this.x,this.y-11) && (endLoop--)>0) this.y+=1;
		    endLoop = MAX_SPEED*2;
		    while(_hitTest(this.x-11,this.y) && (endLoop--)>0) this.x+=1;
		    while(_hitTest(this.x+11,this.y) && (endLoop--)>0) this.x-=1;
		    if(endLoop<=0) console.log("WOOPS");


		    /////////////////////////////////////////////////
		    // FRAME LOGIC: For stable walking despite FPS //
		    /////////////////////////////////////////////////


			// Facing which way?
		    if(moveX<-0.5) faceDirection = -1;
		    if(moveX>0.5) faceDirection = 1;

		    var moveSpeed = Math.sqrt(moveX*moveX+moveY*moveY);

			// Frame Logic: VERY CUSTOMIZED FOR THE BAG SWINGING
		    if(Mouse.pressed || keyMovement){
		    	if(animState!="Walk"){
		    		frameIndex=0;
		    		animState = "Walk";
		    	}
		    	frameIndex += 3 * (moveSpeed/MAX_SPEED);
		    	if(frameIndex>=28) frameIndex=0;
		    }else{
		    	if(animState!="Idle"){
		    		frameIndex=0;
		    		animState = "Idle";
		    	}
		    	frameIndex += 1;
		    	if(frameIndex>=120) frameIndex=0;
		    }

		    // Anim Suffix
		    var heldPrism = (self.heldObject && self.heldObject.type=="prism") ? self.heldObject : null;
		    if(heldPrism){
		    	animSuffix = (heldPrism.id) ? "_Eye_2" : "_Eye";
		    }else{
		    	animSuffix = "";
		    }

		    // Bounce
		    if(animState!=lastAnimState || faceDirection!=lastFaceDirection || animSuffix!=lastAnimSuffix){
		    	bounceVel -= 0.1;
		    }
		    bounceVel += (1-bounce)*0.8;
		    bounceVel *= 0.5;
			bounce += bounceVel;
			lastAnimState = animState;
			lastFaceDirection = faceDirection;
			lastAnimSuffix = animSuffix;

			// Footstep Sounds!
			if(animState=="Walk"){

				var floorSound;
				var floorVolume;
				switch(level.map.getTile(self.x,self.y)){
					case Map.METAL:
						floorSound="sfx_metal_footstep_";
						floorVolume = 1;
						break;
					case Map.CARPET:
						floorSound="sfx_carpet_footstep_";
						floorVolume = 1;
						break;
					default:
						floorSound="sfx_footstep_";
						floorVolume = 0.5;
						break;
				}

				var cx = level.camera.x;
				var pan = (self.x-cx)/(Display.width/2);
				if(lastFrameIndex<2 && frameIndex>=2){
					createjs.Sound.play(floorSound+"1", null,0,0,0,floorVolume,pan);
				}
				if(lastFrameIndex<17 && frameIndex>=17){
					createjs.Sound.play(floorSound+"2", null,0,0,0,floorVolume,pan);
				}
			}
			lastFrameIndex = frameIndex;

		};
		var lastFrameIndex = 0;
		var lastMousePressed = false;


		var _hitTest = function(x,y){

			// Wall
			if(level.map.hitTest(x,y)){
				return true;
			}

			// Blocks
			var blocks = level.blocks.blocks;
			for(var i=0;i<blocks.length;i++){
				var block = blocks[i];
				if(
					block.x+(block.bounds.left-1)<=x &&
					block.x+(block.bounds.right+1)>=x &&
					block.y+(block.bounds.top-1)<=y &&
					block.y+(block.bounds.bottom+1)>=y
				){
					return true;
				}
			}

			// Else, nope
			return false;

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		var frameIndex = 0;
		var faceDirection = 1;
		var animState = "Idle";
		var animSuffix = "";
		var lastFaceDirection = 1;
		var lastAnimState = "Idle";
		var lastAnimSuffix = "Idle";

		var playerSprites = {
			Idle: new Sprite("Poppy_Idle"),
			Idle_Eye: new Sprite("Poppy_Idle_With_Eye"),
			Idle_Eye_2: new Sprite("Poppy_Idle_With_Eye_2"),
			
			Walk: new Sprite("Poppy_Walk"),
			Walk_Eye: new Sprite("Poppy_Walk_With_Eye"),
			Walk_Eye_2: new Sprite("Poppy_Walk_With_Eye_2"),

			Shot: new Sprite("Poppy_Shot")
		};
		for(var id in playerSprites){
			var sprite = playerSprites[id];
			sprite.scaleX = sprite.scaleY = 0.9;
			sprite.regX = -25;
			sprite.regY = -150;
		}

		var buttonSprite = new Sprite("Button");
		buttonSprite.regX = -40;
		buttonSprite.regY = -40;
		buttonSprite.scaleX = buttonSprite.scaleY = 0;
		var buttonRotation = 0;

		// Bounciness
		var bounce = 1;
		var bounceVel = 0;

		// Shot Poppy
		playerSprites.Shot.regX = -60;
		playerSprites.Shot.regY = -160;

		this.draw = function(ctx){

			// WHEN YOU'RE DEAD //

			if(level.YOU_ARE_DEAD){
				var sprite = playerSprites.Shot;
				sprite.x = self.x;
				sprite.y = self.y;
			    sprite.scaleX = faceDirection*0.95;
			    sprite.scaleY = 0.95;
			    sprite.draw(ctx);
			    sprite.frameIndex += 1;
			    return;
			}

			//////////////////////////////////////////////////////////////

			// CLICK ME
			if(level.heldObject){
				buttonSprite.scaleX = buttonSprite.scaleX*0.5 + 0.75*0.5;
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
		    var sprite = playerSprites[animState+animSuffix];

		    // Draw It!
			sprite.frameIndex = Math.floor(frameIndex);
			sprite.x = self.x;
			sprite.y = self.y;
		    sprite.scaleX = faceDirection*0.9 * (1/bounce);
		    sprite.scaleY = bounce*0.9;
		    sprite.draw(ctx);

			// Placeholder CLICK ME circle
			if(buttonSprite.scaleX>0.03){
				buttonSprite.frameIndex = 0;
				buttonSprite.rotation = buttonRotation;
				buttonRotation += 0.05;
				buttonSprite.draw(ctx);
			}

		};

		this.drawCCTV = function(cctvContext){
			
			// Placeholder CLICK ME circle
			if(buttonSprite.scaleX>0.03){
				buttonSprite.scaleY = buttonSprite.scaleX;
				buttonSprite.frameIndex = 1;
				buttonSprite.rotation = 0;
				buttonSprite.x = self.x;
				buttonSprite.y = self.y-50;
				buttonSprite.draw(cctvContext);
			}

			// Which Spritesheet to use
		    var sprite = playerSprites[animState+animSuffix];

		    // Draw It!
			sprite.frameIndex = Math.floor(frameIndex);
			sprite.x = self.x;
			sprite.y = self.y;
		    sprite.scaleX = faceDirection*0.9 * (1/bounce);
		    sprite.scaleY = bounce*0.9;
		    sprite.draw(cctvContext);
		};

	};

	exports.Player = Player;

})(window);