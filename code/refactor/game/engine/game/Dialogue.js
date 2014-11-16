function Dialogue(level){

	var self = this;
	self.level = level;
	level.dialogue = self;

	var showHandler, hideHandler;
	self.init = function(){

		self.isVisible = false;
		self.pos = 0;
		self.vel = 0;
		self.message = "";
		self.origin = {x:0, y:0};
		
		// Handler: Scroll up/down based on messages
		showHandler = subscribe("dialogue/show",function(x,y,message){
			if(self.isVisible){
				self.isVisible = false;
				setTimeout(function(){
					self.show(x,y,message);
				},200);
			}else{
				self.show(x,y,message);
			}
		});
		hideHandler = subscribe("dialogue/hide",self.hide);

		/****
		var p = Game.level.player;
		publish("dialogue/show",[p.x,p.y,"hello world"]);
		****/

	};

	self.show = function(x,y,message){
		self.origin.x = x;
		self.origin.y = y;
		self.message = message;
		self.isVisible = true;
	};
	self.hide = function(){
		self.isVisible = false;
	};

	self.update = function(){

		// If is/not seen, bounce to hidden/showing
		var gotoPosition = self.isVisible ? 1 : 0;
		self.vel += (gotoPosition-self.pos)*0.5;
		self.vel *= 0.5;
		self.pos += self.vel;
		if(self.pos<0){
			self.pos = 0;
			self.isVisible = false;
		}

	};

	self.draw = function(ctx){
		
		if(self.pos<=0) return;

		// Where the origin is relative to top of canvas
		var cam = level.renderer.camera;
		var cx = Game.canvas.width/2 - cam.x*W;
		var cy = Game.canvas.height/2 - cam.y*H;
		var ox = cx + self.origin.x*W;
		var oy = cy + self.origin.y*H;

		// Data on them lines
		var box = _splitLines(ctx, self.message, 470, 30);
		var HEADER = 30;
		box.height += HEADER;

		// Translate to center third
		ctx.save()
		var screenX = Game.canvas.width/2;
		var screenY = Game.canvas.height*(1/3);
		// Origin shifts it slightly left & right
		var bx = screenX + (ox-screenX) * 0.25;
		var by = screenY + (oy-screenY) * 0.2;
		ctx.translate(bx,by);

		ctx.scale(self.pos,self.pos);
		
		ctx.translate(-250,-(box.height+30)/2);
		bx -= 250;
		by -= (box.height+30)/2;

		// Draw White box, with gray line
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#bbb";
		ctx.lineWidth = 1;
		ctx.fillRect(0,0,500,box.height+30);
		ctx.strokeRect(0,0,500,box.height+30);
		boxHeight = box.height + 200;

		// Draw arrow
		ctx.beginPath();
		ctx.moveTo(245,box.height+28);
		ctx.lineTo(255,box.height+28);

		// - where box is relative to top of canvas
		var x = ox-bx;
		var y = oy-by;

		// Halfway to origin point.
		var ax = 250*(0.5) + x*(0.5);
		var ay = (box.height+28)*(0.5) + y*(0.5);
		ctx.lineTo(ax,ay);
		ctx.fill();

		// Draw HEADER
		ctx.fillStyle = "#bbb";
		ctx.font = '20px sans-serif';
		ctx.fillText("posted just now", 15, 17);

		// Draw lines
		ctx.fillStyle = "#000";
		ctx.font = '25px sans-serif';
		for(var i=0;i<box.lines.length;i++){
			var line = box.lines[i];
			ctx.fillText(line.text, 15, HEADER+15+line.y);
		}

		// Restore
		ctx.restore();

	};

	self.init();

	var _splitLines = function(ctx,string,width,lineHeight){

		var drawLines = [];
		string += " ";

		ctx.font = '25px sans-serif';
		ctx.textBaseline = 'top';

	    var lineY=0, lineStart=0, lineEnd, sub;
	    for(var i=0; i<string.length;i++) {
	        
	        // Is substring greater than width?
	        if(string[i]===" "){
	            sub = string.substring(lineStart,i);
	            if(ctx.measureText(sub).width > width){
	                
	                // Yes? Draw text and newline
	                sub = string.substring(lineStart,lineEnd);
	                drawLines.push({
	                	text: sub,
	                	y: lineHeight*lineY
	                });
	                lineY++;
	                lineStart = lineEnd+1;
	                
	            }else{
	                
	                // No? Bring end of line up to there
	                lineEnd = i;
	                
	            }
	        }
	        
	    }
	    
	    // Draw the rest of the text now.
	    sub = string.substring(lineStart);
	    drawLines.push({
        	text: sub,
        	y: lineHeight*lineY
        });
	    lineY++;
	    lineStart = lineEnd+1;

	    // Info
	    return {
	    	height: lineHeight*lineY,
	    	lines: drawLines
	    };

	};

};