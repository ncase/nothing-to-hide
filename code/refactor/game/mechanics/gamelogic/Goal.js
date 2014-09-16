function Goal(level){
	var self = this;
	ZoneMessage.call(self,level);
	self.update = function(){
		if(self.isPlayerInZone()) publish("level/goal");
	};
}