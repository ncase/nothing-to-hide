///////
var alreadyExited = false;
window.gotoGame = function(){
	if(alreadyExited) return;
	alreadyExited = true;
	window.top.gotoPage("level");
}

window.onload = function(){

	var poster = {
		poppy: {
			user: "Poppy Gardner",
			icon: "icons/poppy.png"
		},
		nobody: {
			user: "Nobody",
			icon: "icons/nobody.png"
		}
	};

	var _generatePost = function(type,poster,data){
		return {
			type: type+"_post",
			user: poster.user,
			icon: poster.icon,
			date: poster.date,
			data: data
		}
	};

	var _generateConvoPost = function(poster,date,message){
		return {
			type: "conversation_post",
			user: poster.user,
			icon: poster.icon,
			date: date,
			data: { message: message }
		}
	};

	var _generateMainPost = function(image,slidewalk,date){
		return {
			type: "parallax_post",
			user: poster.poppy.user,
			icon: poster.poppy.icon,
			date: date,
			data: {
				height: 350,
				layers:[
					{img:"pics2/main_bg.png", depth:0.3, offset:0},
					{img:"pics2/slidewalk000"+slidewalk+".png", depth:0.3, offset:-219},
					{img:"pics2/"+image+".png", depth:0.1, offset:-20}
				]
			}
		}
	};

	var posts = [

		////// SLAP AWAKE ///////

		_generateMainPost("slap_1",1,"4 minutes ago"),
		_generateConvoPost(
			poster.poppy, "4 minutes ago",
			"please don't be dead oh god oh god oh god oh god oh god"
		),
		_generateConvoPost(
			poster.poppy, "4 minutes ago",
			"Okay. Okay okay. Idea."
		),
		_generateConvoPost(
			poster.poppy, "4 minutes ago",
			"Sometimes Daddy wakes me up like this. Maybe this will work..."
		),
		
		_generateMainPost("slap_2",2,"4 minutes ago"),
		_generateConvoPost(
			poster.poppy, "4 minutes ago",
			"<span>#DaddyDaughterMoment</span>"
		),
		_generateMainPost("slap_3",3,"4 minutes ago"),

		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			"Ow! Pain on the face! You..."
		),
		_generateConvoPost(
			poster.poppy, "3 minutes ago",
			"i'm sorry"
		),
		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			"...saved my life! Don't apologize, yo!"
		),
		_generateConvoPost(
			poster.poppy, "3 minutes ago",
			"i'm sorry for being sorry"
		),

		_generateMainPost("slap_4",4,"3 minutes ago"),

		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			"Hold up, are we on The Wall?..."
		),

		_generatePost("parallax",{
				user: "Nothing To Hide",
				icon: "icons/game.png",
				date: "3 minutes ago"
			},
			{
			height: 450,
			layers: [
				{img:"pics2/meta0008.png", depth:0.60, offset:20},
				{img:"pics2/meta0007.png", depth:0.59, offset:20},
				{img:"pics2/meta0006.png", depth:0.58, offset:20},
				{img:"pics2/meta0005.png", depth:0.57, offset:20},
				{img:"pics2/meta0004.png", depth:0.55, offset:20},
				{img:"pics2/meta0003.png", depth:0.50, offset:20},
				{img:"pics2/meta0002.png", depth:0.40, offset:20},
				{img:"pics2/meta0001.png", depth:0.20, offset:20}
			]
		}),

		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			'"Poppy Gardner posted 1 minute ago. Sometimes Daddy wakes me up like this. Maybe this will work..."'
		),
		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			'Oh. Oh wow. Minister Gardner does that to his own... wow.'
		),

		_generateMainPost("phone_1",5,"2 minutes ago"),

		_generateMainPost("phone_1_extra",6,"2 minutes ago"),

		_generateConvoPost(
			poster.nobody, "2 minutes ago",
			"<i>Wellllllllll</i> if it makes you feel better, your dad's psychologically and physically abusive to the rest of the nation, too."
		),

		_generateConvoPost(
			poster.nobody, "2 minutes ago",

			"\"Watch what you say & hear & watch & <i>think.\"</i><br>When we got no place to hide, we got to hide our true selves. "
			
			/*"\"Watch what you say & hear & watch & <i>think.\"</i><br>When we got no place to hide, we got to hide our true selves. "+
			"Minister Gardner forces us to be our own watchmen. Literally too, when you move them iEyes."*/

		),

		_generateConvoPost(
			poster.nobody, "2 minutes ago",
			"I can help you escape him."
		),

		_generateMainPost("phone_2",7,"1 minute ago"),

		_generateConvoPost(
			poster.nobody, "1 minute ago",
			"In fact, I got an app for that!"
		),

		_generateMainPost("phone_3",8,"1 minute ago"),

		_generateConvoPost(
			poster.nobody, "58 seconds ago",
			"Exploit! Made it myself. Just tap this screen here, and you'll be erased from The Wall. You'll be a Nobody, just like me."
		),
		_generateConvoPost(
			poster.nobody, "42 seconds ago",
			"Stop acting for the camera. Start being yourself."
		),

		_generateMainPost("phone_4",9,"25 seconds ago"),
		_generateMainPost("phone_5",8,"19 seconds ago"),
		_generateMainPost("phone_6",9,"13 seconds ago"),
		_generateMainPost("phone_7",8,"8 seconds ago"),
		_generateMainPost("phone_8",9,"3 seconds ago"),
		_generateMainPost("phone_9",8,"just now")

	];

	///////////

	var timeline = document.getElementById("timeline");
	var addPost = function(post){
		var dom = document.createElement("div");
		dom.setAttribute("class",post.type);

		var html;

		// Post header
		html = ''+
			'<div id="poster">'+
			'	<div id="poster_icon" style="background:url('+post.icon+')"></div>'+
			'	<div id="poster_info">'+
			'		<span id="poster_info_name">'+post.user+'</span><br>'+
			'		<span id="poster_info_date">posted '+post.date+'</span>'+
			'	</div>'+
			'</div>';

		// Parallax Post
		if(post.type==="parallax_post"){
			html += '<div id="layers" style="height:'+post.data.height+'px">';
			for(var i=0;i<post.data.layers.length;i++){
				var layer = post.data.layers[i];
				html += '<div style="background-image:url('+layer.img+')" depth="'+layer.depth+'" offset="'+layer.offset+'"></div>';
			}
			html += '</div>';
		}

		// Conversation post
		if(post.type==="conversation_post"){
			html += '<div id="convo">'+post.data.message+'</div>';
		}

		// Video post
		if(post.type==="video_post"){
			
			// PARALLAX
			html += ''+
				'<div id="layers" style="height:400px">'+
					'<div style="background-image:url('+post.data.bg+')" depth="0.7" offset="0"></div>'+

					'<div id="video" depth="1" offset="0">'+
						'<div id="video_cctv"></div>'+
						'<div id="video_ribbon"></div>'+
						'<div id="video_button"></div>'+
						'<div id="video_play"></div>'+
					'</div>'+

				'</div>';

			// HACK!
			dom.onclick = gotoGame;

		}

		// Add to DOM
		dom.innerHTML = html;
		timeline.appendChild(dom);

	}

	posts.map(addPost);

	///////////


	var parallaxes = document.querySelectorAll("#layers");
	function onScroll(event){
			
		for(var i=0;i<parallaxes.length;i++){
			
			var parallax = parallaxes[i];
			var scroll = (parallax.offsetTop - window.scrollY) - 150;
			/*if(scroll>700-150){
				scroll = 700-150;
			}*/
			// So it's at its original position, by default, 150px from the top.

			var layers = parallax.children;

			for(var j=0;j<layers.length;j++){
				var layer = layers[j];
				var depth = parseFloat(layer.getAttribute("depth"));
				var offset = parseFloat(layer.getAttribute("offset"));
				layer.style.backgroundPositionY = -scroll*depth - offset;
			}

		}

	};

	var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
	var drawnSinceLastUpdate = false;

	// TODO: WHAT HAPPENS IF THE ZOOM IF KER_FUCKED.....

	// Draw Loop
	var ITS_THE_END = false;
	var END_FRAME = 0;
	var footer = document.getElementById("footer");
	var the_wall = document.getElementById("the_wall");
	var turnoff = document.getElementById("turnoff");
	var turnoff_frame = document.getElementById("turnoff_frame");
	function draw(){
		
		if(!ITS_THE_END){

			if(!drawnSinceLastUpdate){
				drawnSinceLastUpdate = true;
				onScroll();
			}
			if(footer.offsetTop - window.scrollY < window.innerHeight ){
				ITS_THE_END = true;
				the_wall.style.opacity = 0;
				turnoff.style.display = "block";
			}

		}else{

			var frame = Math.floor(END_FRAME/3);
			if(frame>5) frame=6;
			turnoff_frame.style.backgroundPosition = "0 -"+frame*200+"px";
			END_FRAME++;

			if(END_FRAME>60){
				window.top.gotoPage("menu/menu");
			}

		}

		// RAF
		RAF(draw);

	}
	draw();

	window.onscroll = function(){
		drawnSinceLastUpdate = false;
	};


};
