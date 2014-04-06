var LEVEL = JSON.stringify({
	"player":{ "x":0, "y":5 },
	"goal":{"ax":9,"bx":10,"ay":36,"by":37},

	"blocks": [
		{	
			"x":0.5, "y":19,
			"width":2, "height":2,
			"frame":1
		},
		{	
			"x":11.5, "y":19,
			"width":2, "height":2,
			"frame":2
		},
		
		{"x":6, "y":17, "frame":0},
		{"x":6, "y":18, "frame":0},
		{"x":6, "y":19, "frame":0},

		{"x":0.5, "y":21.5, "frame":10, "flip":true},
		{"x":11.5, "y":21.5, "frame":10},
		{"x":0.5, "y":23.5, "frame":10},
		{"x":11.5, "y":23.5, "frame":10, "flip":true}
	],

	"prisms": [
		{"x":11,"y":5},
		{"x":12,"y":5},

		{"x":0,"y":19},
		{"x":10,"y":18}
	],

	"camera": [
		{
			"type": "fixed",
			"zone": {"ax":0,"bx":13,"ay":0,"by":12},
			"data": {"x":6.5,"y":6}
		},
		{
			"type": "rails",
			"zone": {"ax":0,"bx":13,"ay":12,"by":17},
			"data": {"ax":6.5,"bx":6.5,"ay":12,"by":17}
		},
		{
			"type": "fixed",
			"zone": {"ax":0,"bx":13,"ay":17,"by":25},
			"data": {"x":6.5,"y":19}
		},
		{
			"type": "rails",
			"zone": {"ax":0,"bx":13,"ay":25,"by":32},
			"data": {"ax":6.5,"bx":6.5,"ay":25,"by":32}
		},
		{
			"type": "fixed",
			"zone": {"ax":0,"bx":13,"ay":32,"by":37},
			"data": {"x":6.5,"y":32}
		}
	],

	"checkpoints": [
		{"ax":6,"bx":8,"ay":8,"by":12},
		{"ax":0,"bx":1,"ay":16,"by":17}
	],

	"dialogues": [
		{
			"area": {"ax":7,"bx":14,"ay":17,"by":20},
			"queue": [
				{
					"message": "Oh… there's Daddy's campaign post. Look at my smile. :)",
					"duration": 4000
				},
				{
					"message": "He disciplined me when my smile didn't look genuine enough. :)",
					"duration": 4000
				}
			]
		}
	],

	"propaganda": [
		{"type":"image", "img":"propaganda_tut_pickup", "x":0, "y":0},
		{"type":"image", "img":"propaganda_tut_carpet", "x":0, "y":6},
		{"type":"image", "img":"propaganda_pickup_lookout", "x":8, "y":7},
		{"type":"image", "img":"propaganda_pickup_gardner", "x":1, "y":12}
	],

	"art": {}

},null,4);
var MAP = "=============\n"+
"=============\n"+
"=============\n"+
"=============\n"+
"=============\n"+
"             \n"+
"========###  \n"+
"===========  \n"+
"....    ===  \n"+
"....    ===  \n"+
"....##       \n"+
"....##       \n"+
".============\n"+
".============\n"+
".============\n"+
".============\n"+
".============\n"+
"             \n"+
"             \n"+
"             \n"+
"=== ===== ===\n"+
"             \n"+
"             \n"+
"             \n"+
"             \n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###\n"+
"#########.###";
