function RailsCamera(level){
	
	var self = this;
	ZoneCamera.call(self,level);

	self.computeCamPosition = function(){

		var data = self.data;

		// The rails vector, made into a unit vector.
		var vRail = {
			x: data.bx-data.ax,
			y: data.by-data.ay
		};
		var mag = Math.sqrt(vRail.x*vRail.x + vRail.y*vRail.y);
		vRail.x /= mag;
		vRail.y /= mag;

		// The player vector
		var vPlayer = {
			x: level.player.x-data.ax,
			y: level.player.y-data.ay
		};

		// The dot product === the scalar projection on unit vector of rail
		var dot = vRail.x*vPlayer.x + vRail.y*vPlayer.y;

		// Where cam should be, then.
		return {
			x: data.ax + dot*vRail.x,
			y: data.ay + dot*vRail.y
		};

	};
	
}