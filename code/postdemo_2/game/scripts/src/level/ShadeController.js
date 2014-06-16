(function(exports){

	var ShadeController = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.shades = [];

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		var lastMousePressed = false;
		this.update = function(){

		    // Adding/Removing a new shade.
			var player = level.player;
		    if(Key.justPressed.space){

		    	// All shades near player
		    	var nearShade = self.isNearShade(player.x,player.y+25,50);

		    	// Did you click on a Shade
		    	if(!level.heldObject && nearShade){
		    		self.pickUpShade(nearShade);
		    		Key.justPressed.space = false;
				}

		    }

		    // Update all
			for(var i=0;i<self.shades.length;i++){
				self.shades[i].update();
			}

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		this.draw = function(ctx){
			for(var i=0;i<self.shades.length;i++){
				self.shades[i].draw(ctx);
	    	}
		};
		this.drawCCTV = function(ctx){
			for(var i=0;i<self.shades.length;i++){
				self.shades[i].drawCCTV(ctx);
	    	}
		};

		///////////////////
		///// HELPERS /////
		///////////////////

		this.getShadows = function(){
			var shadows = [];
			var l,r,t,b, shade;
			for(var i=0;i<self.shades.length;i++){
				shade = self.shades[i];
				l = shade.x - 25;
				r = shade.x + 25;
				t = shade.y - 25;
				b = shade.y + 25;
				shadows.push({ax:l, bx:r, ay:t, by:t}); // top
				shadows.push({ax:l, bx:l, ay:t, by:b}); // left
				shadows.push({ax:r, bx:r, ay:t, by:b}); // right
				shadows.push({ax:l, bx:r, ay:b, by:b}); // bottom
			}
			return shadows;
		};

		this.pickUpShade = function(nearShade){
    		index = self.shades.indexOf(nearShade);
    		if(index>=0) self.shades.splice(index,1);
    		level.heldObject = nearShade;
		};

		this.dropShade = function(){

			var player = level.player;

			var shade = level.heldObject;
			shade.x = level.player.x;
			shade.y = level.player.y;
			shade.update();
			self.shades.push(shade);
    		
    		// Logic
    		level.heldObject = null;

    		// Sound
    		if(shade.active){
    			createjs.Sound.play("sfx_shade_putdown", null,0,0,false,0.4);
    		}else{
    			createjs.Sound.play("sfx_carpet_footstep_2", null,0,0,false,1);
    		}

		};

		this.isNearShade = function(x,y,size){
			for(var i=0;i<self.shades.length;i++){
				var shade = self.shades[i];
				var dx = shade.x-x;
				var dy = shade.y-y;
				if(dx*dx + dy*dy < size*size) return shade;
			}
			return null;
		};

		this.addShade = function(x,y){
			var shade = new Shade(level);
			shade.x = x;
			shade.y = y;
			shade.drop = self.dropShade; // HACK.
			self.shades.push(shade);
			return shade;
		};

		//////////
		// INIT //
		//////////

		for(var i=0;i<config.shades.length;i++){
			var shadeConfig = config.shades[i];
			var shade = this.addShade(shadeConfig.x,shadeConfig.y);
		}


	};

	exports.ShadeController = ShadeController;

})(window);