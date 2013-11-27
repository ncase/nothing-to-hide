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

			// Adding/Removing a new light.
			if(self.holdingPrism && !self.isMoving){
				if(!lastMousePressed && Mouse.pressed){ // Click
			    	var mx = Mouse.x + (level.camera.x-Display.width/2);
			    	var my = Mouse.y + (level.camera.y-Display.height/2);
			    	var dx = self.x - mx;
					var dy = (self.y-50) - my;
					if(dx*dx + dy*dy < 35*35){ // YOU are clicked
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
		    	var mx = Mouse.x + (level.camera.x-Display.width/2);
		    	var my = Mouse.y + (level.camera.y-Display.height/2);
			    var dx = mx - self.x;
			    var dy = my - self.y;
			    var mag = Math.sqrt(dx*dx+dy*dy);
			    var speed = MAX_SPEED;
			    if(mag<5*MAX_SPEED){
			    	speed *= 0.5;
			    }
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

		var ctx = Display.context.props;
		var frameIndex = 0;
		var faceDirection = 1;
		var animState = "Idle";
		this.draw = function(){

		    // Which Spritesheet to use
		    var sprite = Asset.sprite["Poppy_"+animState];
			var spriteImage = sprite.image;
			var spriteData = sprite.data;

			// Draw frame
			var fI = Math.floor(frameIndex);
			var frame = spriteData.frames[fI].frame;
			ctx.save();
		    ctx.translate(self.x,self.y);
		    ctx.scale(0.9,0.9);

		    // Player facing
		    ctx.scale(faceDirection,1); 

		    // The footing offset
		    ctx.translate(-25,-150);

		    var offset = spriteData.frames[fI].spriteSourceSize;
		    ctx.translate(offset.x,offset.y);
		    ctx.drawImage(spriteImage,frame.x,frame.y,frame.w,frame.h,0,0,frame.w,frame.h);

			// Restore again
			ctx.restore();

			// Placeholder CLICK ME circle
			if(self.holdingPrism){// && !self.isMoving){
				ctx.save();
		    	ctx.translate(self.x,self.y);
		    	ctx.translate(0,-50);
				ctx.fillStyle = "rgba(0,255,255,0.5)";
				ctx.beginPath();
				ctx.arc(0,0,35,0,Math.PI*2,true);
				ctx.fill();
				ctx.restore();
			}

		};

	};

	exports.Player = Player;

})(window);