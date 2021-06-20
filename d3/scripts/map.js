function draw_chart() {
  //Width and height
  var w = 1100;
  var h = 500;//600

  //Define map projection
  var projection = d3.geoAlbersUsa()
                      .translate([w/2, h/2])
                      .scale(800);

  //Define path generator
  var path = d3.geoPath().projection(projection);
                
  //Define quantize scale to sort data values into buckets of color
  var color = d3.scaleQuantize()
                .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
                //Colors derived from ColorBrewer, by Cynthia Brewer, and included in
                //https://github.com/d3/d3-scale-chromatic

  //Create SVG element
  var svg = d3.select("#div_map")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  //Load in agriculture data
  d3.csv("data/StateDelay.csv").then(function(data) {
    d3.csv("data/us_state_names.csv").then(function(states) {
      console.log(data);
      console.log(states);

      var statesMap = new Map(states.map(s => [s.code, s.name]));
      console.log(statesMap);

      //Set input domain for color scale
      color.domain([
        d3.min(data, function(d) { return d.Delay; }), 
        d3.max(data, function(d) { return d.Delay; })
      ]);

      //Load in GeoJSON data
      d3.json("data/us-states.json").then(function(json) {
        //Merge the ag. data and GeoJSON
        //Loop through once for each ag. data value
        for (var i = 0; i < data.length; i++) {
          //Grab state name
          var dataState = statesMap.get(data[i].State);
          // console.log(dataState);
          
          //Grab data value, and convert from string to float
          var dataValue = parseFloat(data[i].Delay);
            
          //Find the corresponding state inside the GeoJSON
          for (var j = 0; j < json.features.length; j++) {
                
            var jsonState = json.features[j].properties.name;
      
            if (dataState == jsonState) {
          
              //Copy the data value into the JSON
              json.features[j].properties.value = dataValue;
              
              //Stop looking through the JSON
              break;
                    
            }
          }		
        }

        //Bind data and create one path per GeoJSON feature
        svg.append("g")
            .selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d) {
              //Get data value
              var value = d.properties.value;
              
              if (value) {
                //If value exists…
                return color(value);
              } else {
                //If value is undefined…
                return "#ccc";
              }
            });

        // Add a layer for displaying state names
        var names = new Map(states.map(s => [+s.id, s.code]));
        console.log(names);
        svg.append("g")
          .attr("class", "states-names")
          .selectAll("text")
          .data(json.features)
          .enter()
          .append("svg:text")
          .text(function(d){
            return names.get(+d.id);
          })
          .attr("x", function(d){
            return path.centroid(d)[0];
          })
          .attr("y", function(d){
            return  path.centroid(d)[1];
          })
          .attr("text-anchor","middle")
          .attr('fill', 'white')
          .style("font-size", 7);
              
      });
    })
  });
}

draw_chart();