(function(exports){

	var DoorController = function(level,config){

		var self = this;
		
		// Properties
		this.level = level;
		this.config = config;

		// Create doors
		this.doors = [];
		for(var i=0;i<config.doors.length;i++){
			
			var doorConfig = config.doors[i];
			var door = JSON.parse(JSON.stringify(doorConfig));
			
			door.shadow.ax *= Map.TILE_SIZE;
			door.shadow.bx *= Map.TILE_SIZE;
			door.shadow.ay *= Map.TILE_SIZE;
			door.shadow.by *= Map.TILE_SIZE;

			door.timer = 1;
			door.initial = JSON.parse(JSON.stringify(door.shadow));

			this.doors.push(door);

			// Add these to the actual shadows
			level.shadows.shadows.push(door.shadow);
			
		}

		this.update = function(){

			var prisms = level.prisms.prisms;

			for(var i=0;i<self.doors.length;i++){
				var door = self.doors[i];

				// If close to the center
				var dx = level.player.x - 0.5*(door.initial.ax+door.initial.bx);
				var dy = level.player.y - 0.5*(door.initial.ay+door.initial.by);
				var gotoTimer = 0;
				//if(Math.abs(dx)<Map.TILE_SIZE && Math.abs(dy)<Map.TILE_SIZE){

				var myPrismID = door.activator;
				var myPrism = level.prisms.map[myPrismID];
				if(myPrism && myPrism.active && myPrism.seesHuman){
					gotoTimer = 0;
				}else{
					gotoTimer = 1;
				}
				door.timer = door.timer*0.8 + gotoTimer*0.2;

				// Shadow reflects this
				dx = door.initial.bx - door.initial.ax;
				dy = door.initial.by - door.initial.ay;
				door.shadow.bx = door.initial.ax + dx*door.timer;
				door.shadow.by = door.initial.ay + dy*door.timer;
				
			}

		}

	};

	exports.DoorController = DoorController;

})(window);