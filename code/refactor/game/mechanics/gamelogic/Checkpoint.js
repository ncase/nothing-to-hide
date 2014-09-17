function Checkpoint(level){
	
	var self = this;
	ZoneMessage.call(self,level);

	self.init = function(){
		self.zone = self;
	};

	self.update = function(){
		if(self.isPlayerInZone()) publish("checkpoint/save");
	};
	
}