(function(exports){

	var DummyController = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.dummies = [];

		///////////////////////
		///// UPDATE LOOP /////
		///////////////////////

		this.update = function(){

			// Did you pick up any?
			var player = level.player;
		    if(Key.justPressed.space){
		    	var nearDummy = self.isNearDummy(player.x,player.y+25,50);
		    	if(!level.heldObject && nearDummy){
		    		self.pickUpDummy(nearDummy);
		    		Key.justPressed.space = false;
				}
		    }

		    // Update all
			for(var i=0;i<self.dummies.length;i++){
				self.dummies[i].update();
			}

		};

		/////////////////////
		///// DRAW LOOP /////
		/////////////////////

		this.draw = function(){
			for(var i=0;i<self.dummies.length;i++){
				self.dummies[i].draw();
	    	}
		};

		///////////////////
		///// HELPERS /////
		///////////////////

		this.pickUpDummy = function(nearPrism){

			// Remove dummy
    		index = self.dummies.indexOf(nearPrism);
    		if(index>=0) self.dummies.splice(index,1);

    		// Pick it up!
    		level.heldObject = nearPrism;

		};

		this.dropDummy = function(){

			var player = level.player;

			var dummy = level.heldObject;
			dummy.x = level.player.x;
			dummy.y = level.player.y+0.001;
			self.dummies.push(dummy);
    		
    		// Logic
    		level.heldObject = null;

		};

		this.isNearDummy = function(x,y,size){
			for(var i=0;i<self.dummies.length;i++){
				var dummy = self.dummies[i];
				var dx = Math.abs(dummy.x-x);
				var dy = Math.abs(dummy.y-y);
				if(dx<size&&dy<size) return dummy;
			}
			return null;
		};

		this.addDummy = function(x,y){
			var dummy = new Dummy(level);
			dummy.x = x;
			dummy.y = y;
			dummy.drop = self.dropDummy; // HACK.
			self.dummies.push(dummy);
			return dummy;
		};

		//////////
		// INIT //
		//////////

		self.map = {};
		config.dummies = config.dummies || [];
		for(var i=0;i<config.dummies.length;i++){
			var conf = config.dummies[i];
			var dummy = this.addDummy(conf.x,conf.y);
			dummy.id = conf.id;
			if(conf.id){
				self.map[conf.id] = dummy;
			}
		}


	};

	exports.DummyController = DummyController;

})(window);