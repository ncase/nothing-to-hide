/*******************************

{
	"type": "Rover",
	"x":1, "y":1, "width":1, "height":1,
	"direction": {"x":1,"y":0}
}

*******************************/
function Rover(level){
	
	var self = this;
	self.level = level;

	////////////////

	self.init = function(){
		
		level.setTag(self,"floor");
		level.setTag(self,"slideable");

		// dimensions: by default 1x1
		self.width = 1;
		self.height = 1;

		// position & velocity
		self.vel = 1;
		self.pos = 0;

	};

	self.update = function(){

		// MOVEMENT and Velocity
		var t = self.vel/Game.FPS;
		self.x += t*self.direction.x;
		self.y += t*self.direction.y;

		// Player is a special case
		var player = level.player;
		if(self.hitTest(player.x,player.y)){
			if((Math.abs(player.vx)>0.0001||Math.abs(player.vy)>0.0001)){
				player.standingOnRover = self;
			}
		}else{
			player.standingOnRover = null;
		}

		// Crappy Collision Detection
		if(self.collideBlock()){
			self.vel *= -1;
			//debugger;
			//self.direction.x *= -1;
	    	//self.direction.y *= -1;
		}

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
	
		// Translate
		ctx.save();
		ctx.translate(self.x*W, self.y*H);

		// Draw a rectangle, why not.
		ctx.beginPath();
		ctx.rect(0, 0, self.width*W, self.height*H);
		ctx.fillStyle = "#cc2727";
		ctx.fill();

		// Restore
		ctx.restore();

	};
	
	self.hitTest = function(x,y){
		return (x>self.x && x<self.x+self.width && y>self.y && y<self.y+self.height);
	};
	self.collideBlock = function(){

		// HACK - do X first...
		// TODO: BLOCK COLLISION GAME LOGIC
		var endLoopX = 100;
	    while(_hitTestBlock(-0.1,0) && (endLoopX--)>0) self.x+=0.01;
	    while(_hitTestBlock(0.1,0) && (endLoopX--)>0) self.x-=0.01;
		var endLoopY = 100;
	    while(_hitTestBlock(0,0.1) && (endLoopY--)>0) self.y-=0.01;
	    while(_hitTestBlock(0,-0.1) && (endLoopY--)>0) self.y+=0.01;
	    if(endLoopX<=0) console.log("WOOPS");
	    if(endLoopY<=0) console.log("WOOPS");
	    if(endLoopX<99 || endLoopY<99) return true;	    
	    return false;

	};
	var _hitTestBlock = function(ox,oy){

		if(_hitTestPoint(ox+self.x,oy+self.y)) return true;
		if(_hitTestPoint(ox+self.x,oy+self.y+self.height)) return true;
		if(_hitTestPoint(ox+self.x+self.width,oy+self.y)) return true;
		if(_hitTestPoint(ox+self.x+self.width,oy+self.y+self.height)) return true;

		// REALS
		/*var slideables = level.tagged.slideable;
		for(var i=0;i<slideables.length;i++){
			var s = slideables[i];
			if(self.hitTest(s.x-ox,s.y-oy)){

				// Is it a player that's already standing on it?
				if(s==level.player && level.player.standingOnRover==self){
					continue;
				}

				// Otherwise, yeah it's been hit.
				return true;

			}
		}*/

		return false;
	}
	var _hitTestPoint = function(x,y){
		if(self.level.map.hitTest(x,y)) return true;
		// SHOULD HAVE TAG FOR "BLOCK" -- all things have a block-like collision
		/*var blocks = level.tagged.block; //level.getTagged("block");
		for(var i=0;i<blocks.length;i++){
			if(blocks[i].hitTest(x,y)) return true;
		}*/
		return false;
	};
	
}