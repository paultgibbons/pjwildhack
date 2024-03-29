function drawGraph(values) {
document.getElementById('wcg').innerHTML = '';
// A formatter for counts.
var formatCount = d3.format(",.0f");

var pagewidth = document.body.clientWidth;
var margin = {top: 10, right: pagewidth/5, bottom: 30, left: pagewidth/5},
    width = 6 * pagewidth/10,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, 15])
    .range([0, width]);

var data = d3.layout.histogram()
    .bins(x.ticks(15))
    (values);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// var svg = d3.select("body").append("svg")
var svg = d3.select(document.getElementById("wcg")).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function(d) { return height - y(d.y); });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", x(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
}