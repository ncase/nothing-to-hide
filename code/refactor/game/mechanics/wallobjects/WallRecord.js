/***********************

{
	"type": "WallRecord",
	"x":12.1, "y":2.1, "width":7.8, "height":6.8
}

***********************/

function WallRecord(level){
	
	var self = this;
	self.level = level;

	self.init = function(){};
	self.update = function(){};

	self.draw = function(ctx){

		var x = self.x*W;
		var y = self.y*H;
		var w = self.width*W;
		var h = self.height*H;

		// OH DANG
		ctx.fillStyle = "#000";
		ctx.fillRect(x,y,w,h); 
		ctx.drawImage(Game.canvas,x,y,w,h);

	};
	
}