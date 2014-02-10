(function(exports){

	var ConveyorController = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;
		this.conveyors = [];

		// Sound
		var slidewalkSound = createjs.Sound.createInstance("sfx_slidewalk");
		slidewalkSound.play(null,0,0,-1,0,0);

		// Create Conveyors
		for(var i=0;i<config.conveyors.length;i++){
			var conf = config.conveyors[i];
			var conveyor = new Conveyor(level,conf);
			this.conveyors.push(conveyor);
		}

		this.update = function(){
			
			var active = false;

			for(var i=0;i<self.conveyors.length;i++){
				self.conveyors[i].update();
				if(self.conveyors[i].active) active=true;
			}

			slidewalkSound.setVolume( active ? 1 : 0);

		};

		this.kill = function(){
			slidewalkSound.stop();
		};

		this.draw = function(ctx){
			for(var i=0;i<self.conveyors.length;i++){
				self.conveyors[i].draw(ctx);
	    	}
		};
		this.drawCCTV = function(ctx){
			for(var i=0;i<self.conveyors.length;i++){
				self.conveyors[i].drawCCTV(ctx);
	    	}
		};

	};

	exports.ConveyorController = ConveyorController;

})(window);