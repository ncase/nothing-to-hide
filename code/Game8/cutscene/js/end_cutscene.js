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

	var _generateMainPost = function(image,date){
		return {
			type: "parallax_post",
			user: poster.poppy.user,
			icon: poster.poppy.icon,
			date: date,
			data: {
				height: 350,
				layers:[
					{img:"pics2/main_bg.png", depth:0.5, offset:50},
					{img:"pics2/"+image+".png", depth:0.1, offset:-20}
				]
			}
		}
	};

	var posts = [

		////// SLAP AWAKE ///////

		_generateMainPost("slap_1","4 minutes ago"),
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
		
		_generateMainPost("slap_2","4 minutes ago"),
		_generateConvoPost(
			poster.poppy, "4 minutes ago",
			"<span>#FamilyTime</span>"
		),
		_generateMainPost("slap_3","4 minutes ago"),

		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			"Ow! You..."
		),
		_generateConvoPost(
			poster.poppy, "3 minutes ago",
			"i'm sorry"
		),
		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			"...saved my life! Please don't apologize!"
		),
		_generateConvoPost(
			poster.poppy, "3 minutes ago",
			"i'm sorry for being sorry"
		),

		_generateMainPost("slap_4","3 minutes ago"),

		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			"Wait, on The Wall, is that...?"
		),

		_generatePost("parallax",{
				user: "Nothing To Hide",
				icon: "icons/game.png",
				date: "3 minutes ago"
			},
			{
			height: 450,
			layers: [
				{img:"pics2/meta_8.png", depth:0.60, offset:20},
				{img:"pics2/meta_7.png", depth:0.59, offset:20},
				{img:"pics2/meta_6.png", depth:0.58, offset:20},
				{img:"pics2/meta_5.png", depth:0.57, offset:20},
				{img:"pics2/meta_4.png", depth:0.55, offset:20},
				{img:"pics2/meta_3.png", depth:0.50, offset:20},
				{img:"pics2/meta_2.png", depth:0.40, offset:20},
				{img:"pics2/meta_1.png", depth:0.20, offset:20}
			]
		}),

		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			'"Poppy Gardner posted 1 minute ago. Sometimes Daddy wakes me up like this. Maybe this will..."'
		),
		_generateConvoPost(
			poster.nobody, "3 minutes ago",
			'Oh. Oh my god. The Minister does that to his own... damn.'
		),

		_generateMainPost("phone_1","2 minutes ago"),

		_generateMainPost("phone_1_extra","2 minutes ago"),

		_generateConvoPost(
			poster.nobody, "2 minutes ago",
			"Welllll if it makes you feel better, your dad's psychologically and physically abusive to the rest of the nation, too."
		),

		_generateConvoPost(
			poster.nobody, "2 minutes ago",
			"We're all scared about saying the wrong thing, <i>thinking</i> the wrong thing. The Minister forces us to be our own watchmen. Sometimes literally, when you've got to move those iEyes."
		),

		_generateConvoPost(
			poster.nobody, "2 minutes ago",
			"I can help you escape him."
		),

		_generateMainPost("phone_2","1 minute ago"),

		_generateConvoPost(
			poster.nobody, "1 minute ago",
			"In fact, I got an app for that!"
		),

		_generateMainPost("phone_3","1 minute ago"),

		_generateConvoPost(
			poster.nobody, "58 seconds ago",
			"Made this exploit myself. Just tap the screen, and you'll be erased from The Wall. You'll be a Nobody."
		),
		_generateConvoPost(
			poster.nobody, "42 seconds ago",
			"Stop acting for the camera. Start being yourself."
		),

		_generateMainPost("phone_4","25 seconds ago"),
		_generateMainPost("phone_5","19 seconds ago"),
		_generateMainPost("phone_6","13 seconds ago"),
		_generateMainPost("phone_7","8 seconds ago"),
		_generateMainPost("phone_8","3 seconds ago"),
		_generateMainPost("phone_9","just now")

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
	/*var cctv = document.getElementById("video_cctv");
	cctvY = 0;*/
	var footer = document.getElementById("footer");
	function draw(){
		
		if(!drawnSinceLastUpdate){
			drawnSinceLastUpdate = true;
			onScroll();
		}

		// CCTV
		/*cctvY += 1;
		if(cctvY>=15) cctvY=0;
		cctv.style.backgroundPositionY = cctvY;*/

		// END
		if(footer.offsetTop - window.scrollY < 600 ){
			document.body.style.background = "#000";
			document.body.innerHTML = "";
			return;
		}

		// RAF
		RAF(draw);

	}
	draw();

	window.onscroll = function(){
		drawnSinceLastUpdate = false;
	};


};
