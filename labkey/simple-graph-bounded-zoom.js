
<!DOCTYPE html>
<html>
  <head>
    <title>Restricted zoom behavior in d3</title>
    <meta charset="utf-8">
    <script src="http://d3js.org/d3.v3.min.js"></script>
    <style>
    </style>
  </head>
  <body>
    <script>
    // This seems like a much better zoom implementation:
    // http://bl.ocks.org/shawnbot/6518285
    function intersperseZeros(pointArray) { 
        var result = []; 
        pointArray.forEach(function(element) { 
            var z = { 
                x: element.x, 
                y: 0 
            }; 
            result.push(z); 
            result.push(element) 
            result.push(z); 
        }); 
        return result; 
    }

      var data = 
      [
        { x:10 , y:20},
        { x:30 , y:30},
        { x:55 , y:15},
      ];

      // first, define your viewport dimensions
      var width = 960,
          height = 500;

      // then, create your svg element and a <g> container
      // for all of the transformed content
      var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", randomColor),
          g = svg.append("g");

      // then, create the zoom behvavior
      var zoom = d3.behavior.zoom()
        // only scale up, e.g. between 1x and 50x
        .scaleExtent([1, 50])
        .on("zoom", function() {
          // the "zoom" event populates d3.event with an object that has
          // a "translate" property (a 2-element Array in the form [x, y])
          // and a numeric "scale" property
          var e = d3.event,
              // now, constrain the x and y components of the translation by the
              // dimensions of the viewport
              tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
              ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
          // then, update the zoom behavior's internal translation, so that
          // it knows how to properly manipulate it on the next movement
          zoom.translate([tx, ty]);
          // and finally, update the <g> element's transform attribute with the
          // correct translation and scale (in reverse order)
          g.attr("transform", [
            "translate(" + [tx, ty] + ")",
            "scale(" + e.scale + ")"
          ].join(" "));
        });

      // then, call the zoom behavior on the svg element, which will add
      // all of the necessary mouse and touch event handlers.
      // remember that if you call this on the <g> element, the even handlers
      // will only trigger when the mouse or touch cursor intersects with the
      // <g> elements' children!
      svg.call(zoom);

      // then, let's add some circles
      var circle = g.selectAll("circle")
        .data(data.forEach(function(element) {
          return {
            x: element.x,
            y: element.y,
            r: 10,
            color: randomColor()
          };
        }).sort(function(a, b) {
          return d3.descending(a.r, b.r);
        }))
        .enter()
        .append("circle")
          .attr("fill", function(d) { return d.color; })
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return d.r; });

      function randomColor() {
        return "hsl(" + ~~(60 + Math.random() * 180) + ",80%,60%)";
      }

    </script>
  </body>
</html>