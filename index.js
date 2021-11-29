var svg = d3.select("svg");
var margin = 200;
var width = svg.attr("width") - margin;
var height = svg.attr("height") - margin;

var x = d3.scaleBand().range([0, width]).padding(0.0);
var y = d3.scaleLinear().range([height, 0]);

var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");


function onMouseOver(d, i) {
    d3.select(this).attr('class', 'highlight');
        d3.select(this)
          .transition()
          .duration(200)
          .attr('width', x.bandwidth() + 5)
          .attr("y", function(d) { return y(d.population) - 10; })
          .attr("height", function(d) { return height - y(d.population) + 10; });


        // g.append("text")
        //  .attr('class', 'val') 
        //  .attr('x', function() {
        //      return x(d.state);
        //  })
        //  .attr('y', function() {
        //      return y(d.population) - 15;
        //  })
        //  .text(function() {
        //      return [d.state + ', ' + d.population];
        //  });
}

function onMouseOut(d, i) {
    // use the text label class to remove label on mouseout
    d3.select(this).attr('class', 'bar');
    d3.select(this)
      .transition()     // adds animation
      .duration(200)
      .attr('width', x.bandwidth())
      .attr("y", function(d) { return y(d.population); })
      .attr("height", function(d) { return height - y(d.population); });

    d3.selectAll('.val')
      .remove()
}



d3.tsv('state_population_gdp.tsv').then(function(data) {
    console.log(data);
    data.forEach((d) => {
        d.population = +d.population;
        d.gdp = +d.gdp;
    });
    x.domain(data.map(function(d) { return d.state; }));
    y.domain([0, d3.max(data, function(d) { return d.population; })]);

    g.append("g")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-5.1em")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Population");

   g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.state); })
    .attr("y", function(d) { return y(d.population); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.population); })
    .on("mouseover", onMouseOver) //Add listener for the mouseover event
    .on("mouseout", onMouseOut)   //Add listener for the mouseout event
    .append('title')
    .text((d) => d.state + ', ' + d.population);
});