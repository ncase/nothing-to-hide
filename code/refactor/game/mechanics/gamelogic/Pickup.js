function Pickup(level){
	
	var self = this;
	self.level = level;

	self.level.pickupLogic = self;

	self.RADIUS = 0.8;

	self.holding = null;

	self.init = function(){
		
	};

	var lastAction = false;
	self.update = function(){

		// Did you JUST press the Action button?
		var justPressed = Key.action && !lastAction && !level.player.deactivated;
		lastAction = Key.action;
		if(!justPressed) return;

		if(self.holding){
			self.drop();
		}else{
			self.pickup();
		}

	};

	self.pickup = function(){
		
		// Get all pickuppable objects
		var pickups = level.getTagged("pickup");

		// Which ones are all within the pickup radius
		var p = level.player;
		pickups = pickups.filter(function(pickup){
			var dx = pickup.x-p.x;
			var dy = pickup.y-p.y;
			var mag = dx*dx + dy*dy;
			return(mag < self.RADIUS*self.RADIUS);
		});

		// Are there any?
		if(pickups.length==0) return;

		// If multiple, which is the closest one
		var closest;
		var closestMag = 1000000;
		for(var i=0;i<pickups.length;i++){
			var pickup = pickups[i];
			var dx = pickup.x-p.x;
			var dy = pickup.y-p.y;
			var mag = dx*dx + dy*dy;
			if(mag<closestMag){
				closest=pickup;
				closestMag=mag;
			}
		}

		// Pick up the closest one!
		self.holding = closest;
		self.holding.pickup();

	};

	self.drop = function(){
		var p = level.player;
		self.holding.x = p.x;
		self.holding.y = p.y+0.01;

		self.holding.drop();
		self.holding = null;
	};

	
}