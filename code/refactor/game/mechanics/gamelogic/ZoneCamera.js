function ZoneCamera(level){
	
	var self = this;
	self.level = level;

	self.init = function(){
		if(self.isPlayerInZone()){
			var pos = self.computeCamPosition();
			var cam = level.renderer.camera;
			cam.x = cam.gotoX = pos.x;
			cam.y = cam.gotoY = pos.y;
		}
	};
	self.update = function(){
		if(self.isPlayerInZone()){
			var pos = self.computeCamPosition();
			var cam = level.renderer.camera;
			cam.gotoX = pos.x;
			cam.gotoY = pos.y;
		}	
	};

	self.computeCamPosition = function(){
		// TO BE IMPLEMENTED
	};

	self.isPlayerInZone = function(){
		var p = level.player;
		var z = self.zone;
		return (p.x>z.left && p.x<z.right && p.y>z.top && p.y<z.bottom);
	}
	
}