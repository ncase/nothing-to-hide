(function(exports){

	var PrismController = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.prisms = [];

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		var lastMousePressed = false;
		this.update = function(){

			if(level.config.id!="intro"){

				// Hovering...
				var mx = Mouse.x - level.camera.cx;
		    	var my = Mouse.y - level.camera.cy;
			    var clickedPrism = self.isNearPrism(mx,my+25,25);
				if(clickedPrism && clickedPrism.nearPlayer){
					Cursor.hovering++;
				}

				// Adding/Removing a new light.
				var player = level.player;
			    if(!lastMousePressed && Mouse.pressed){// && Cursor.still){

			    	// Did you click on a Prism
			    	if(!level.heldObject && clickedPrism && clickedPrism.nearPlayer){
			    		self.pickUpPrism(clickedPrism);
			    		Cursor.clicked = true;
			    		Mouse.pressed = false;
					}

			    }
			    lastMousePressed = Mouse.pressed;

			    // Adding/Removing a new light.
				var player = level.player;
			    if(Key.justPressed.space){

			    	// All prisms near player
			    	var nearPrism = self.isNearPrism(player.x,player.y+25,50);

			    	// Did you click on a Prism
			    	if(!level.heldObject && nearPrism){
			    		self.pickUpPrism(nearPrism);
			    		Key.justPressed.space = false;
					}

			    }

			}

		    // Update all
			for(var i=0;i<self.prisms.length;i++){
				self.prisms[i].update();
			}

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		this.draw = function(ctx){
			for(var i=0;i<self.prisms.length;i++){
				self.prisms[i].draw(ctx);
	    	}
		};

		///////////////////
		///// HELPERS /////
		///////////////////

		this.pickUpPrism = function(nearPrism){

			// Remove light
    		index = self.prisms.indexOf(nearPrism);
    		if(index>=0) self.prisms.splice(index,1);
    		if(nearPrism.id){
    			self.map[nearPrism.id] = null;
    		}

    		// Pick it up!
    		level.heldObject = nearPrism;
    		/*if(nearPrism.active){
    			createjs.Sound.play("sfx_prism_pickup", null,0,0,false,0.4);
    		}else{
    			createjs.Sound.play("sfx_carpet_footstep_1", null,0,0,false,1);
    		}*/
    		createjs.Sound.play("sfx_prism_pickup", null,0,0,false,0.4);

		};

		this.dropPrism = function(){

			var player = level.player;

			var prism = level.heldObject;
			prism.x = level.player.x;
			prism.y = level.player.y+0.001;
			prism.active = (level.map.getTile(prism.x,prism.y)!=Map.CARPET); // You're NOT on carpet.
			self.prisms.push(prism);
			if(prism.id){
				self.map[prism.id] = prism;
			}

			// Let it know it's been dropped
			prism.justDropped = true;
    		
    		// Logic
    		level.heldObject = null;

    		// Sound
    		if(prism.active){
    			createjs.Sound.play("sfx_prism_putdown", null,0,0,false,0.4);
    		}else{
    			createjs.Sound.play("sfx_carpet_footstep_2", null,0,0,false,1);
    		}

		};

		this.isNearPrism = function(x,y,size){
			for(var i=0;i<self.prisms.length;i++){
				var prism = self.prisms[i];
				var dx = prism.x-x;
				var dy = prism.y-y;
				if(dx*dx + dy*dy < size*size) return prism;
			}
			return null;
		};

		this.addPrism = function(x,y){
			var prism = new Prism(level);
			prism.x = x;
			prism.y = y;
			prism.active = (level.map.getTile(x,y)!=Map.CARPET); // You're NOT on carpet.
			prism.drop = self.dropPrism; // HACK.
			self.prisms.push(prism);
			return prism;
		};

		//////////
		// INIT //
		//////////

		self.map = {};
		for(var i=0;i<config.prisms.length;i++){
			var prismConfig = config.prisms[i];
			var prism = this.addPrism(prismConfig.x,prismConfig.y);
			prism.id = prismConfig.id;
			if(prismConfig.id){
				self.map[prismConfig.id] = prism;
			}
		}


	};

	exports.PrismController = PrismController;

})(window);