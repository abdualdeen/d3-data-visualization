var margin = {top: 40, right: 40, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

d3.select("svg").remove();

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
var div = d3.select("body").append("div")
  .attr("class", "#dot")
  .style("opacity", 0);

d3.tsv("state_population_gdp.tsv").then(function(data) {

  data.forEach((d) => {
    d.population = +d.population;
    d.gdp = +d.gdp;
    d.sate = +d.state;
  });

  x.domain(d3.extent(data, function(d) { return d.population; })).nice();
  y.domain(d3.extent(data, function(d) { return d.gdp; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("id", "circle")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.population); })
      .attr("cy", function(d) { return y(d.gdp); })
      .on('mouseover', function (d) {
        d3.select(this).attr("fill", "green");
        d3.select(this).transition()
             .duration('100')
             .attr("r", 7)
      })

      
      .on('mouseout', function (d) {
        div.style("opacity", 0)
        d3.select(this).attr("fill", "black");
        d3.select(this).transition()
             .duration('200')
             .attr("r", 3.5);
      })
      
      .append('title')
      .text((d) => d.state + ": " + Math.ceil((d.gdp / d.population) * 100) / 100);

  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("Population");
  
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .text("GDP");
});

