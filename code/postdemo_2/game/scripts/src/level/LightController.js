(function(exports){

	var LightController = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.lights = [];

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		var lastMousePressed = false;
		this.update = function(){

		    // Adding/Removing a new light.
			var player = level.player;
		    if(Key.justPressed.space){

		    	// All lights near player
		    	var nearLight = self.isNearLight(player.x,player.y+25,50);

		    	// Did you click on a Light
		    	if(!level.heldObject && nearLight){
		    		self.pickUpLight(nearLight);
		    		Key.justPressed.space = false;
				}

		    }

		    // Update all
			for(var i=0;i<self.lights.length;i++){
				self.lights[i].update();
			}

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		this.draw = function(ctx){
			for(var i=0;i<self.lights.length;i++){
				self.lights[i].draw(ctx);
	    	}
		};
		this.drawCCTV = function(ctx){
			for(var i=0;i<self.lights.length;i++){
				self.lights[i].drawCCTV(ctx);
	    	}
		};

		///////////////////
		///// HELPERS /////
		///////////////////

		this.pickUpLight = function(nearLight){
    		index = self.lights.indexOf(nearLight);
    		if(index>=0) self.lights.splice(index,1);
    		level.heldObject = nearLight;
		};

		this.dropLight = function(){

			var player = level.player;

			var light = level.heldObject;
			light.x = level.player.x;
			light.y = level.player.y;
			light.updatePolygon();
			self.lights.push(light);
    		
    		// Logic
    		level.heldObject = null;

    		// Sound
    		if(light.active){
    			createjs.Sound.play("sfx_light_putdown", null,0,0,false,0.4);
    		}else{
    			createjs.Sound.play("sfx_carpet_footstep_2", null,0,0,false,1);
    		}

		};

		this.isNearLight = function(x,y,size){
			for(var i=0;i<self.lights.length;i++){
				var light = self.lights[i];
				var dx = light.x-x;
				var dy = light.y-y;
				if(dx*dx + dy*dy < size*size) return light;
			}
			return null;
		};

		this.addLight = function(x,y){
			var light = new Light(level);
			light.x = x;
			light.y = y;
			light.drop = self.dropLight; // HACK.
			self.lights.push(light);
			return light;
		};

		//////////
		// INIT //
		//////////

		for(var i=0;i<config.lights.length;i++){
			var lightConfig = config.lights[i];
			var light = this.addLight(lightConfig.x,lightConfig.y);
		}


	};

	exports.LightController = LightController;

})(window);