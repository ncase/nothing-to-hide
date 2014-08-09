(function(exports){


	////////////////////////////////////////////
	// FIND INTERSECT OF A RAY & LINE SEGMENT //
	////////////////////////////////////////////

	function getIntersection(ray,segment){

		// RAY in parametric: Point + Delta*T1
		var r_px = ray.a.x;
		var r_py = ray.a.y;
		var r_dx = ray.b.x-ray.a.x;
		var r_dy = ray.b.y-ray.a.y;

		// SEGMENT in parametric: Point + Delta*T2
		var s_px = segment.ax;
		var s_py = segment.ay;
		var s_dx = segment.bx-segment.ax;
		var s_dy = segment.by-segment.ay;

		// Are they parallel? If so, no intersect
		var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
		var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
		if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
			// Unit vectors are the same.
			return null;
		}

		// SOLVE FOR T1 & T2
		// r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
		// ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
		// ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
		// ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
		var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
		var T1 = (s_px+s_dx*T2-r_px)/r_dx;

		// Must be within parametic whatevers for RAY/SEGMENT
		if(T1<0) return null;
		if(T2<0 || T2>1) return null;

		// Return the POINT OF INTERSECTION
		return {
			x: r_px+r_dx*T1,
			y: r_py+r_dy*T1,
			param: T1
		};

	}




	///////////////////////////////
	// COMPUTE THE SIGHT POLYGON //
	///////////////////////////////

	function getSightPolygon(point,walls){

		// Sight X & Sight Y
		var sightX = point.x;
		var sightY = point.y;

		// Get all unique points
		var points = (function(segments){
			var a = [];
			segments.forEach(function(seg){
				a.push(
					{x:seg.ax, y:seg.ay},
					{x:seg.bx, y:seg.by}
				);
			});
			return a;
		})(walls);
		var uniquePoints = (function(points){
			var set = {};
			return points.filter(function(p){
				var key = p.x+","+p.y;
				if(key in set){
					return false;
				}else{
					set[key]=true;
					return true;
				}
			});
		})(points);

		// Get all angles
		var uniqueAngles = [];
		for(var j=0;j<uniquePoints.length;j++){
			var uniquePoint = uniquePoints[j];
			var angle = Math.atan2(uniquePoint.y-sightY,uniquePoint.x-sightX);
			uniquePoint.angle = angle;

			// Actually make the angles unique!
			if(uniqueAngles.indexOf(angle)==-1){
				uniqueAngles.push(angle-0.00001,angle,angle+0.00001);
			}

		}

		// RAYS IN ALL DIRECTIONS
		var intersects = [];
		for(var j=0;j<uniqueAngles.length;j++){
			var angle = uniqueAngles[j];

			// Calculate dx & dy from angle
			var dx = Math.cos(angle);
			var dy = Math.sin(angle);

			// Ray to that angle
			var ray = {
				a:{x:sightX,y:sightY},
				b:{x:sightX+dx,y:sightY+dy}
			};

			// Find CLOSEST intersection
			var closestIntersect = null;
			for(var i=0;i<walls.length;i++){
				var intersect = getIntersection(ray,walls[i]);
				if(!intersect) continue;
				if(!closestIntersect || intersect.param<closestIntersect.param){
					closestIntersect=intersect;
				}
			}

			// Intersect angle
			if(!closestIntersect) continue;
			closestIntersect.angle = angle;

			// Add to list of intersects
			intersects.push(closestIntersect);

		}

		// Sort intersects by angle
		intersects = intersects.sort(function(a,b){
			return a.angle-b.angle;
		});

		// Polygon is intersects, in order of angle
		return intersects;

	}



	/////////////////////////////////
	// IS A POINT INSIDE A POLYGON //
	/////////////////////////////////

	function isInPolygon(point,polygon){

		// Ray just going right
		var ray = {
			a:{x:point.x,y:point.y},
			b:{x:point.x+1,y:point.y}
		};

		// Get # of total intersection with polygon walls
		var numIntersections = 0;
		for(var i=0;i<polygon.length;i++){
			// Line from this point to the next
			var startPoint = polygon[i];
			var endPoint = (i==polygon.length-1) ? polygon[0] : polygon[i+1];
			var segment = {
				ax:startPoint.x, ay:startPoint.y,
				bx:endPoint.x, by:endPoint.y
			};
			if(getIntersection(ray,segment)){
				numIntersections++;
			}
		}

		// If and only if it's odd, it's inside
		return (numIntersections%2==1);

	}



	/////////////////////////////
	// SPOOKY SCARY SINGLETONS //
	/////////////////////////////

	exports.SightAndLight = {};
	SightAndLight.compute = getSightPolygon;
	SightAndLight.inPolygon = isInPolygon;


})(window);