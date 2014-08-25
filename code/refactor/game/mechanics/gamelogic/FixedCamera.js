function FixedCamera(level){
	
	var self = this;
	ZoneCamera.call(self,level);

	self.computeCamPosition = function(){
		return {
			x: self.data.x,
			y: self.data.y
		};
	};

}