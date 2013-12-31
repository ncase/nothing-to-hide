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

		var sneakMode = false;
		this.update = function(){

			// Sneak Mode
			/*if(Key.justPressed.shift){
				sneakMode = !sneakMode;
			}*/
			sneakMode = Key.shift;

			///////////////////////
			// CLICK TO PUT DOWN

			// Hovering...
			var hovering = false;
			var mx = Mouse.x - level.camera.cx;
	    	var my = Mouse.y - level.camera.cy;
	    	var dx = self.x - mx;
			var dy = (self.y-50) - my;
			if(dx*dx + dy*dy < 25*25){
				hovering = true;
				Cursor.hovering++;
			}

			// Adding/Removing a new light.
			if(self.holdingPrism && !self.isMoving){
				if(!lastMousePressed && Mouse.pressed){
			    	if(hovering){
			    		level.prisms.dropPrism();
			    		Mouse.pressed = false;
			    		Cursor.clicked = true;
			    		return;
					}
			    }
			}
			lastMousePressed = Mouse.pressed;

			// Adding/Removing a new light.
			if(self.holdingPrism && Key.justPressed.space){
	    		level.prisms.dropPrism();
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

		    if(Mouse.pressed && !Cursor.clicked){
			    var dx = mx - self.x;
			    var dy = my - self.y;
			    var mag = Math.sqrt(dx*dx+dy*dy);
			    
			    if(mag>MAX_SPEED*2){
			    	isMoving = true;
				    vx = (dx/mag) * MAX_SPEED;
				    vy = (dy/mag) * MAX_SPEED;
				}else{
					gotoSpot = true;
				}

			}

			if(keyMovement){
				
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

		    // Crappy Collision
		    var endLoop = MAX_SPEED*5;
		    while(_hitTest(this.x+11,this.y) && (endLoop--)>0) this.x-=1;
		    while(_hitTest(this.x-11,this.y) && (endLoop--)>0) this.x+=1;
		    while(_hitTest(this.x,this.y+11) && (endLoop--)>0) this.y-=1;
		    while(_hitTest(this.x,this.y-11) && (endLoop--)>0) this.y+=1;
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
		    var heldPrism = level.prisms.getHeldPrism()
		    if(heldPrism){
		    	animSuffix = (heldPrism.id) ? "_Eye_2" : "_Eye";
		    }else{
		    	animSuffix = "";
		    }

			// Footstep Sounds!
			if(animState=="Walk"){
				var cx = level.camera.x;
				var pan = (self.x-cx)/(Display.width/2);
				if(lastFrameIndex<2 && frameIndex>=2){
					createjs.Sound.play("sfx_footstep_1", null,0,0,false,0.5,pan);
				}
				if(lastFrameIndex<17 && frameIndex>=17){
					createjs.Sound.play("sfx_footstep_2", null,0,0,false,0.2,pan);
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
				if(block.x-25<=x && block.x+25>=x && block.y-50<=y && block.y>=y){
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

		var playerSprites = {
			Idle: new Sprite("Poppy_Idle"),
			Idle_Eye: new Sprite("Poppy_Idle_With_Eye"),
			Idle_Eye_2: new Sprite("Poppy_Idle_With_Eye_2"),
			
			Walk: new Sprite("Poppy_Walk"),
			Walk_Eye: new Sprite("Poppy_Walk_With_Eye"),
			Walk_Eye_2: new Sprite("Poppy_Walk_With_Eye_2")
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

		this.draw = function(ctx){

			// CLICK ME
			if(self.holdingPrism){
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
		    sprite.scaleX = faceDirection*0.9;
		    sprite.draw(cctvContext);
		};

	};

	exports.Player = Player;

})(window);