 
// A function that create / update the plot for a given variable:
function update(data, n) {
  console.log("Run update");
  console.log(data);
  d3.select("#svg_bar").remove();

  // set the dimensions and margins of the graph
  var margin = {top: 60, right: 30, bottom: 70, left: 60},
  width = 400 - margin.left - margin.right, 
  height = 500 - margin.top - margin.bottom; 

  // append the svg object to the body of the page
  var svg = d3.select("#div_bar")
    .append("svg")
    .attr("id", "svg_bar")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.group; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d.value))])
    .range([height, 0]);
  svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));

  var u = svg.selectAll("rect")
    .data(data);

  u
    .enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x(d.group); })
      .attr("y", function(d) { console.log(d); return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", n == 0 ? "#637cd6" : "#de7a16");

  var u = svg.selectAll(".label")
    .data(data);

  u
    .enter()
    .append("text")
    .merge(u)
    .transition()
    .duration(1000)
    .attr("x", function(d) {
      return x(d.group) + x.bandwidth()/2;
    })
    .attr('dx', 0)
    .attr("y", function(d) {
        return y(d.value) - 3;
    })
    .attr('dy', -6)
    .text(function(d) {
					return d.value;
				})
    .attr("font-size", "12px")
    .attr('text-anchor', 'middle');

}
// Initialize the plot with the first dataset
var rowConverter = function(d) {
    return {
      group: d.group,
      value: parseInt(d.value)
    };
  }

function draw_bar_from_csv(fn, n) { 
  d3.csv(fn, rowConverter).then(function(data) {
    console.log(data);
    update(data, n);
  });
}

function dropDownHandler() {
  var fn = document.getElementById("barDD").value;
  var i = document.getElementById("barDD").selectedIndex;
  console.log(i);
  console.log(fn);
  draw_bar_from_csv(fn, i);
}

draw_bar_from_csv('data/Visua1.1.csv', 0);
