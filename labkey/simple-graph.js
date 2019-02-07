registerKeyboardHandler = function(callback) {
  var callback = callback;
  d3.select(window).on("keydown", callback);  
};

// Define the div for the tooltip



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
SimpleGraph = function(elemid, options) {
  var self = this;
  this.chart = document.getElementById(elemid);
  this.cx = this.chart.clientWidth;
  this.cy = this.chart.clientHeight;
  this.options = options || {};
  this.options.xmax = options.xmax || 30;
  this.options.xmin = options.xmin || 0;
  this.options.ymax = options.ymax || 10;
  this.options.ymin = options.ymin || 0;

  this.padding = {
     "top":    this.options.title  ? 40 : 20,
     "right":                 30,
     "bottom": this.options.xlabel ? 60 : 10,
     "left":   this.options.ylabel ? 70 : 45
  };

  this.size = {
    "width":  this.cx - this.padding.left - this.padding.right,
    "height": this.cy - this.padding.top  - this.padding.bottom
  };

  // x-scale
  this.x = d3.scale.linear()
      .domain([this.options.xmin, this.options.xmax])
      .range([0, this.size.width]);

  // drag x-axis logic
  this.downx = Math.NaN;

  // y-scale (inverted domain)
  this.y = d3.scale.linear()
      .domain([this.options.ymax, this.options.ymin])
      .nice()
      .range([0, this.size.height])
      .nice();

  // drag y-axis logic
  this.downy = Math.NaN;

  // this.dragged = this.selected = null;

  this.line = d3.svg.line()
      .x(function(d, i) { return this.x(this.points[i].x); })
      .y(function(d, i) { return this.y(this.points[i].y); });

  var xrange =  (this.options.xmax - this.options.xmin),
      yrange = (this.options.ymax - this.options.ymin);




  this.points = intersperseZeros(options.data)

  this.circle_points = data.map(function(datum)
    {
      if(datum.y>0) 
        {
          return {x:datum.x,y:datum.y};
        }
      else
      {
        return {x:0,y:-10};
      }
    },
    self);
  

  this.vis = d3.select(this.chart).append("svg")
      .attr("width",  this.cx)
      .attr("height", this.cy)
      .append("g")
        .attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")");

  this.plot = this.vis.append("rect")
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      // .style("fill", "#EEEEEE")
      .attr("pointer-events", "all");
  
  this.vis.append("svg")
      .attr("top", 0)
      .attr("left", 0)
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .attr("viewBox", "0 0 "+this.size.width+" "+this.size.height)
      .attr("class", "line")
      .append("path")
          .attr("class", "line")
          .attr("d", this.line(this.points));

  // add Chart Title
  if (this.options.title) {
    this.vis.append("text")
        .attr("class", "axis")
        .text(this.options.title)
        .attr("x", this.size.width/2)
        .attr("dy","-0.8em")
        .style("text-anchor","middle");
  }

  // Add the x-axis label
  if (this.options.xlabel) {
    this.vis.append("text")
        .attr("class", "axis")
        .text(this.options.xlabel)
        .attr("x", this.size.width/2)
        .attr("y", this.size.height)
        .attr("dy","2.4em")
        .style("text-anchor","middle");
  }

  // add y-axis label
  if (this.options.ylabel) {
    this.vis.append("g").append("text")
        .attr("class", "axis")
        .text(this.options.ylabel)
        .style("text-anchor","middle")
        .attr("transform","translate(" + -40 + " " + this.size.height/2+") rotate(-90)");
  }
  self.div = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

  this.redraw()();
};
  

SimpleGraph.prototype.update = function() {
  var self = this;
  var lines = this.vis.select("path").attr("d", this.line(this.points));
  
  var circle = this.vis.select("svg").selectAll("circle")
      .data(this.circle_points, function(d) { return d; });

  circle.enter().append("circle")
      .attr("class", function(d) { return d === self.selected ? "selected" : null; })
      .attr("cx",    function(d) { return self.x(d.x); })
      .attr("cy",    function(d) { return self.y(d.y); })
      .attr("r", 10.0)
      .on("mouseover", function(d) {    
            self.div.transition().duration(200).style("opacity", .9);    
            self.div.html(d.x + "<br/>"  + d.y).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            self.div.transition().duration(500).style("opacity", 0); 
        });

      // .on("mouseover", function(d) {console.log(d.x)});    
      // div.transition()    
      //     .duration(200)    
      //     .style("opacity", .9);    
      // div.html(d.x + "<br/>"  + d.y)  
      //     .style("left", (d3.event.pageX) + "px")   
      //     .style("top", (d3.event.pageY - 28) + "px");  
      // })          
      // .on("mouseout", function(d) {   
      //     div.transition()    
      //         .duration(500)    
      //         .style("opacity", 0); 
      // });
      // .text(function(d) { return d.x; });
      // .on("mouseover", function(d) {    
      // div.transition()    
      //     .duration(200)    
      //     .style("opacity", .9);    
      // div.html(d.x + "<br/>"  + d.y)  
      //     .style("left", (d3.event.pageX) + "px")   
      //     .style("top", (d3.event.pageY - 28) + "px");  
      // })          
      // .on("mouseout", function(d) {   
      //     div.transition()    
      //         .duration(500)    
      //         .style("opacity", 0); 
      // });

  circle.exit().remove();

  if (d3.event && d3.event.keyCode) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}


SimpleGraph.prototype.redraw = function() {
  var self = this;
  return function() {
    var tx = function(d) { 
      return "translate(" + self.x(d) + ",0)"; 
    },
    ty = function(d) { 
      return "translate(0," + self.y(d) + ")";
    },
    stroke = function(d) { 
      return d ? "#ccc" : "#666"; 
    },
    fx = self.x.tickFormat(10),
    fy = self.y.tickFormat(10);

    // Regenerate x-ticks…
    var gx = self.vis.selectAll("g.x")
        .data(self.x.ticks(10), String)
        .attr("transform", tx)
        ;

    gx.select("text")
        .text(fx);


    var gxe = gx.enter().insert("g", "a")
        .attr("class", "x")
        .attr("transform", tx);

    gxe.append("line")
        .attr("stroke", stroke)
        .attr("y1", 0)
        .attr("y2", self.size.height);

    gxe.append("text")
        .attr("class", "axis")
        .attr("y", self.size.height)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(fx);

    // gx.exit().remove();

    // Regenerate y-ticks…
    var gy = self.vis.selectAll("g.y")
        .data(self.y.ticks(10), String)
        .attr("transform", ty);

    gy.select("text")
        .text(fy);

    var gye = gy.enter().insert("g", "a")
        .attr("class", "y")
        .attr("transform", ty)
        .attr("background-fill", "#FFEEB6");

    gye.append("line")
        .attr("stroke", stroke)
        .attr("x1", 0)
        .attr("x2", self.size.width);

    gye.append("text")
        .attr("class", "axis")
        .attr("x", -3)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(fy);
          
    self.update();    
  }  
}
