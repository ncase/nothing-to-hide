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

		var isHoldingPrism = false;
		var lastMousePressed = false;
		var heldPrism = null;
		this.update = function(){

			// Hovering...
			var mx = Mouse.x - level.camera.cx;
	    	var my = Mouse.y - level.camera.cy;
		    var clickedPrism = self.isNearPrism(mx,my,50*0.7);
			if(clickedPrism && clickedPrism.nearPlayer){
				Cursor.hovering++;
			}

			// Adding/Removing a new light.
			var player = level.player;
		    if(!lastMousePressed && Mouse.pressed){

		    	// Did you click on a Prism
		    	if(!isHoldingPrism && clickedPrism && clickedPrism.nearPlayer){
		    		self.pickUpPrism(clickedPrism);
				}

		    }
		    lastMousePressed = Mouse.pressed;


		    // Update all
			for(var i=0;i<self.prisms.length;i++){
				self.prisms[i].update();
			}

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		this.draw = function(){
			for(var i=0;i<self.prisms.length;i++){
				self.prisms[i].draw();
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
    		isHoldingPrism = true;
    		level.player.holdingPrism = true;
    		heldPrism = nearPrism;
    		createjs.Sound.play( nearPrism.active ? "sfx_prism_pickup" : "sfx_prism_pickup_soft", null,0,0,false,0.4);

		};

		this.dropPrism = function(){

			var player = level.player;

			var prism = heldPrism;
			prism.x = level.player.x;
			prism.y = level.player.y;
			prism.active = (level.map.getTile(prism.x,prism.y)!=Map.CARPET); // You're NOT on carpet.
			self.prisms.push(prism);
			if(prism.id){
				self.map[prism.id] = prism;
			}
    		
    		// Logic
    		isHoldingPrism = false;
    		level.player.holdingPrism = false;

    		// Sound
    		var isMetal = (level.map.getTile(player.x,player.y)==Map.METAL);
    		createjs.Sound.play( isMetal ? "sfx_prism_putdown" : "sfx_prism_putdown_soft", null,0,0,false,0.4);

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