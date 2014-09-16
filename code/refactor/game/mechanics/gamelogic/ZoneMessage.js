function ZoneMessage(level){
	
	var self = this;
	self.level = level;

	self.init = function(){};

	self.update = function(){
		if(self.isPlayerInZone()){
			publish("custom/"+self.message);
		}	
	};

	self.isPlayerInZone = function(){
		var p = level.player;
		var z = self.zone;
		return (p.x>z.left && p.x<z.right && p.y>z.top && p.y<z.bottom);
	}
	
}