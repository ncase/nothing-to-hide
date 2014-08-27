/***********************

{
	"type": "WallButton",
	"icon": "Wall_Up",
	"x":12, "y":2,
	"message": "message"
}

***********************/

function WallButton(level){
	
	var self = this;
	self.level = level;

	self.init = function(){

		// Drawing's dirty
		self.dirty = true;

		// Figure out our area.
		self.segment = level.walls.findSegmentByTile(self.x,self.y); // x,y,width,height

		// Handler: if it's within my area, broadcast the level/message.
		subscribe("wall/press",function(x,y){
			var seg = self.segment;
			if(x>seg.x && y>seg.y && x<seg.x+seg.width && y<seg.y+seg.height){
				publish("level/"+self.message);
			}
		});

		// Icon
		self.icon = Asset.image[self.icon];

	};
	self.update = function(){
	};
	self.draw = function(ctx){

		// For now, it's static.
		if(!self.dirty) return;
		self.dirty = false;

		// Draw a line & circle
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 2;
		ctx.fillStyle = "#fff";
		var x = (self.segment.x+0.5)*W;
		var y = (self.segment.y)*H;
		var height = (self.segment.height-1.5)*H;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x,y+height);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x, y+height, W*0.45, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.strokeStyle = self.level.walls.FILL_BACKGROUND;
		ctx.beginPath();
		ctx.arc(x, y+height, W*0.4, 0, 2*Math.PI, false);
		ctx.stroke();

		// Draw the square icon with size W*0.8
		var iconSize = W*0.8;
		var iconX = x-iconSize/2;
		var iconY = y+height-iconSize/2;
		ctx.drawImage(self.icon, iconX, iconY, iconSize, iconSize);

	};
	
}