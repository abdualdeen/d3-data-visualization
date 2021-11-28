// const height = 400;
// const width = 800;
// const margin = {top:50, bottom:50, left:50, right:20};

const svg = d3.select("svg");
const margin = 200;
const width = svg.attr("width") - margin;
const height = svg.attr("height") - margin;

const x = d3.scaleBand().range([0, width]).padding(0.4);
const y = d3.scaleLinear().range([height, 0]);

const g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.tsv('state_population_gdp.tsv', (...data) => {
    // console.log(data);
    data.forEach((d) => {
        d.population = +d.population;
        d.gdp = +d.gdp;
    });
    // console.log(data);
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.population; })]);

    g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x))
         .append("text")
         .attr("y", height - 250)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Name");

    g.append("g")
    .call(d3.axisLeft(y).tickFormat(function(d){
        return "$" + d;
    })
    .ticks(10))
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
    .attr("x", function(d) { return x(d.name); })
    .attr("y", function(d) { return y(d.population); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.population); });
});