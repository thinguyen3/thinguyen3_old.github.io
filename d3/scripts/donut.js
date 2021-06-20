function draw_donut(dataset) {
  //Width and height
  var w = 300;
  var h = 300;
			
  var outerRadius = w / 2;
  var innerRadius = w / 3;
  var arc = d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);
			
  var pie = d3.pie().value(function(d) { 
    return d.value; 
  }); ///change here
			
  //Easy colors accessible via a 10-step ordinal scale
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  //Create SVG element
  var svg = d3.select("#div_donut")
              .append("svg")
              .attr("id", "svg_donut")
              .attr("width", w)
              .attr("height", h);
			
  //Set up groups
  var arcs = svg.selectAll("g.arc")
                .data(pie(dataset))
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
			
  //Draw arc paths
  arcs.append("path")
      .attr("fill", function(d, i) {
        return color(i);
      })
      .attr("d", arc);
  
  //Labels
  arcs.append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")

      .call(text => text.append("tspan")
      .attr("y", "-0.4em")
      .text(d => d.data.group))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
      .attr("x", 0)
      .attr("y", "0.7em")
      .attr("fill-opacity", 0.7)
      .attr("fill", "black")
      .text(d => d.data.value.toLocaleString()))
    ;
}

var rowConverter = function(d) {
  return {
    group: d.group,
    value: parseInt(d.value)
  };
}

function draw_donut_from_csv(fn) { 
  d3.csv(fn, rowConverter).then(function(data) {
    console.log(data);
    draw_donut(data);
  });
}
draw_donut_from_csv('data/Visua2Donut.csv');