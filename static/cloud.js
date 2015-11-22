function drawCloud(frequency_list) {
    document.getElementById('legend').innerHTML = '';
    var color = d3.scale.linear()
      .domain([0,1,2,3,4,5,6,10,15,20,100])
      .range(["#d33", "#3c3", "#33b", "#609", "#ff0", "#f60", "#733", "#363", "#335", "#433", "#333", "#233"]);


    var pagewidth = document.body.clientWidth;
    d3.layout.cloud().size([pagewidth*.8, 300])
        .words(frequency_list)
        .rotate(0)
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select(document.getElementById('legend')).append("svg")
            .attr("width", pagewidth*.8 + 50)
            .attr("height", 350)
            .attr("class", "wordcloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(320,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}