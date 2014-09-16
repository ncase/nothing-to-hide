function StayInSight(level){
	
	var self = this;
	self.level = level;

	self.level.sightLogic = self;

	self.init = function(){
		self.alert = false;
	};
	self.update = function(){

		var player = self.level.player;
		var px = player.x;
		var py = player.y;

		// OKAY
		// Check player position. If it's in, it's good.
		if(self.isPointSeen(px,py)){
			self.alert = false;
			return;
		}

		// ALERT
		self.alert = true;

		// If not, check points in corners of radius 0.2 or something
		if(self.isPointSeen(px-0.2,py-0.2) ||
			self.isPointSeen(px-0.2,py+0.2) || 
			self.isPointSeen(px+0.2,py-0.2) ||
			self.isPointSeen(px+0.2,py+0.2)){
			self.status = self.STATUS_ALERT;
			return;
		}

		// DEAD
		// If all points are out, you are dead

	};

	self.isPointSeen = function(x,y){

		var monoliths = level.getTagged("monolith");

		// For all monolith sightPolygons
		for(var i=0;i<monoliths.length;i++){
			// Return true if it's in ANY one of them
			var poly = monoliths[i].sightPolygon;
			if(SightAndLight.inPolygon({x:x, y:y},poly)){
				return true;
			}
		}

		// If not, return false.
		return false;

	}
	
}