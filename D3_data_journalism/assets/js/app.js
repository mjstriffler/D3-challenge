// @TODO: YOUR CODE HERE!
// set up the chart area 
var svgWidth = 906;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom:80,
    left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(povertyData) {
    console.log(povertyData);


// parse data
povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare
  });

  // xLinearScale function above csv import
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d => d.poverty)])
    .range([width, 0]);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d => d.healthcare)])
    .range([height, 0]);

    // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    
  chartGroup.append("g")
    .call(leftAxis);

 //create the circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "red")
    .attr("opacity", ".5");

    // tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

      //create tooltip in the chart
      chartGroup.call(toolTip);

      //create event listeners
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("fill", "black")
        .style("font", "20px sans-serif")
        .style("font-weight", "bold")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)"); 

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .style("font", "20px sans-serif")
        .style("font-weight", "bold")
        .text("In Poverty (%)");

    }).catch(function(error) {
    console.log(error);
});