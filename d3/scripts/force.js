Promise.all([d3.csv("data/flights.csv"), d3.csv("data/Top20AirportDelay.csv")])
  .then(function(files) {
    flights = files[0];
    airports = files[1].map(d => d.IATA_CODE);
    console.log(flights);
    console.log(airports);

    var nodes = files[1].map(function(d) {
        return { id: d.IATA_CODE, value: +d.DELAY };
    });
    console.log(nodes);

    var links = [];
    flights.forEach(function(d) {
        if (airports.includes(d.ORIGIN) && airports.includes(d.DEST))
            links.push({
                source: airports.indexOf(d.ORIGIN), 
                target: airports.indexOf(d.DEST)
            });
    });

    var dataset = {
        nodes: nodes,
        links: links
    };

    console.log(dataset);

    //Width and height
    var w = 900;
    var h = 400;

    //Initialize a simple force layout, using the nodes and edges in dataset
    var force = d3.forceSimulation(dataset.nodes)
                  .force("charge", d3.forceManyBody())
                  .force("link", d3.forceLink(dataset.links))
                  .force('collide', d3.forceCollide(function(d) {
                      return d.id === "j" ? 80 : 40; }))
                  .force("center", d3.forceCenter().x(w/2).y(h/2));

    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    //Create SVG element
    var svg = d3.select("#div_force")//fix
                .append("svg")
                .attr("id", "svg_force")
                .attr("width", w)
                .attr("height", h)
                ;
    
    //Create edges as lines
    var edges = svg.append("g").selectAll("line")
                    .data(dataset.links)
                    .enter()
                    .append("line")
                    .style("stroke", "#ccc")
                    .style("stroke-width", 1.5);

    var min_delays = Math.min.apply(Math, nodes.map(d => d.value));
    console.log(min_delays);
    
    //Create nodes as circles
    var nodes = svg.append("g").selectAll("circle")
                    .data(dataset.nodes)
                    .enter()
                    .append("circle")
                    .attr("r", function(d, i) {
                      console.log(d);
                      return 5 * (d.value / min_delays);
                    })
                    .style("fill", function(d, i) {
                        return colors(i);
                    })
                    .call(d3.drag()  //Define what to do on drag events
                        .on("start", dragStarted)
                        .on("drag", dragging)
                        .on("end", dragEnded))
                    ;

    var text = svg.append("g")
                  .selectAll("text")
                  .data(dataset.nodes)
                  .enter()
                  .append("text")
                  .attr("x", 8)
                  .attr("y", ".31em")
                  .text(function(d) { return d.id; });

    //Add a simple tooltip
    nodes.append("title")
          .text(function(d) { return d.id; });


    nodes.append("text")
      .text(function (d) { return d.id; })
      .style("text-anchor", "middle")
      .style("fill", "red")
      .style("font-family", "Arial")
      .style("font-size", 8);
    
    //Every time the simulation "ticks", this will be called
    force.on("tick", function() {

      edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
  
      nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

      text.attr("x", function(d) { return d.x + 5 * (d.value / min_delays); })
          .attr("y", function(d) { return d.y + 5 * (d.value / min_delays); });

    });

    //Define drag event functions
    function dragStarted(event, d) {
      if (!event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragging(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) force.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
);
