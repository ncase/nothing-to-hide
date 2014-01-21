(function(exports){

	// Singleton
	var Dialogue = function(level,config){

		var self = this;
		self.level = level;
		self.dialogues = config.dialogues;

		var tick = 0;
		var actions = [];

		var cacheCanvas = document.createElement("canvas");
		cacheCanvas.width = 300;
		cacheCanvas.height = 300;
		var cacheContext = cacheCanvas.getContext("2d");
		var active = false;
		var scale = 0;

		this.update = function(){

			tick++;
			
			// Are you in a Dialogue spot?
			for(var i=0;i<self.dialogues.length;i++){
				var dialogue = self.dialogues[i];
				if(!dialogue.said && _isInArea(dialogue.area)){
					dialogue.said = true;
					self.queue(dialogue.queue);
				}
			}

			// If tick is past upcoming dialogue's trigger
			if(actions.length>0 && tick>actions[0][0]){
				var action = actions.shift();
				if(action[1]){
					active = true;
					_drawDialogue(action[2]);
				}else{
					active = false;
				}
			}

		};

		// Draw Dialogue
		var boxHeight = 0;
		var _drawDialogue = function(message){

			// Clear
			var ctx = cacheContext;
			ctx.clearRect(0,0,300,300);

			// Data on them lines
			var box = _splitLines(ctx, message, 270, 25);
			var HEADER = 25;
			box.height += HEADER;

			// Draw White box, with gray line
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#bbb";
			ctx.lineWidth = 1;
			ctx.fillRect(0,0,300,box.height+30);
			ctx.strokeRect(0,0,300,box.height+30);
			boxHeight = box.height + 200;

			// Draw arrow
			ctx.beginPath();
			ctx.moveTo(150,box.height+28);
			ctx.lineTo(150,box.height+60);
			ctx.lineTo(170,box.height+28);
			ctx.fill();

			// Draw HEADER
			ctx.fillStyle = "#bbb";
			ctx.font = '15px sans-serif';
			ctx.fillText("Poppy Gardner posted just now", 15, 17);

			// Draw lines
			ctx.fillStyle = "#000";
			ctx.font = '20px sans-serif';
			for(var i=0;i<box.lines.length;i++){
				var line = box.lines[i];
				ctx.fillText(line.text, 15, HEADER+15+line.y);
			}

		};

		var _splitLines = function(ctx,string,width,lineHeight){

			var drawLines = [];
			string += " ";

			ctx.font = '20px sans-serif';
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

		var lastPos = {x:0,y:0};
		var ctx = Display.context.dialogue;
		var container;
		this.draw = function(){

			// Wipe last thing
			ctx.clearRect(lastPos.x-160,lastPos.y-(boxHeight+10),320,320);

			// My scale
			if(active){
				if(scale<1){
					scale += 0.25;
				}else{
					scale = 1;
				}
			}else{
				if(scale>0){
					scale -= 0.25;
				}else{
					scale = 0;
				}
			}

			// Don't draw
			if(scale==0) return;
			if(level.YOU_ARE_DEAD) return;

			// My Position
			var x = level.player.x + level.camera.cx;
			var y = level.player.y + level.camera.cy;

			container = container || document.querySelector("canvas#game");
			x = x + container.offsetLeft;
			y = y + container.offsetTop;
			
			if(x<200) x=200+(x-200)*0.2;
			if(y<boxHeight) y=boxHeight+(y-boxHeight)*0.2;
			var rightEdge = window.innerWidth-200;
			if(x>rightEdge) x=rightEdge+(x-rightEdge)*0.2;

			lastPos.x = x;
			lastPos.y = y;

			// Draw the damn thing
			ctx.save();
			ctx.translate(x,y-140);
			ctx.scale(scale,scale);
			ctx.drawImage(cacheCanvas,-150,-(boxHeight-140));
			ctx.restore();

		};
		

		this.queue = function(cues){

			var startTime = tick+1;
			for(var i=0;i<cues.length;i++){
				var cue = cues[i];

				// SOUND!
				if(cue.sound){
					createjs.Sound.play.apply(null,cue.sound);
				}

				// Waiting? Just... well... wait.
				if(cue.wait){
					startTime += Math.ceil(cue.wait*0.03);
				}else{

					// Expand and say it
					actions.push([startTime,true,cue.message]);

					// Transition & Message
					startTime += 4 + Math.ceil(cue.duration*0.03);

					// Contract it
					actions.push([startTime,false]);

					// End transition & padding
					startTime += 8;
				
				}

			}

		};

		function _isInArea(area,x,y){
			x = level.player.x/Map.TILE_SIZE;
			y = level.player.y/Map.TILE_SIZE;
			return (x>=area.ax && x<=area.bx && y>=area.ay && y<=area.by);
		}

	}
	exports.Dialogue = Dialogue;


})(window);