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

		var isHoldingDummy = false;
		var lastSpace = false;
		var heldDummy = null;
		this.update = function(){

			// Adding/Removing a new dummy.
			var player = level.player;
		    if(!lastSpace && Key.space){

		    	// Are you near a dummy?
		    	var nearDummy = self.isNearDummy(player.x,player.y,50);
		    	if(nearDummy && !isHoldingDummy){

		    		// Remove Dummy
		    		index = self.dummies.indexOf(nearDummy);
		    		if(index>=0) self.dummies.splice(index,1);
		    		if(nearDummy.id){
		    			self.map[nearDummy.id] = null;
		    		}

		    		// Pick it up!
		    		isHoldingDummy = true;
		    		heldDummy = nearDummy;

		    	}else if(isHoldingDummy){

		    		var dummy = heldDummy;
					dummy.x = level.player.x;
					dummy.y = level.player.y;
					self.dummies.push(dummy);
					if(dummy.id){
						self.map[dummy.id] = dummy;
					}
		    		
		    		// Logic
		    		isHoldingDummy = false;
		    	}

		    }
		    lastSpace = Key.space;

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