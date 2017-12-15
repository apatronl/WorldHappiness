// Creates a bootstrap-slider element
$("#yearSlider").slider({
    tooltip: 'always',
    tooltip_position:'bottom'
});

// Listens to the on "change" event for the slider
$("#yearSlider").on('change', function(event){
    // Update the chart on the new value
    updateChart(event.value.newValue);
});

var svg = d3.select('#bubble_chart svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 60, l: 50};

var chartWidth = (svgWidth * 2/3) - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var bubbleChartG = svg.append('g')
    // .attr('id', 'graph')
    .attr('transform', 'translate(' + [padding.l, padding.t] + ')');

var countryG = svg.append('g')
    .attr('transform', 'translate(' + [padding.l*2 + chartWidth, padding.t] + ')');
countryG.append('rect')
    .attr('fill', '#fff')
    .attr('stroke', '#888')
    .attr('height', chartHeight)
    .attr('width', (svgWidth * 1/3) - padding.l);

var years = [2015, 2016, 2017];

// Color mapping based on region
// Western Europe
// North America
// Australia and New Zealand
// Middle East and Northern Africa
// Latin America and Caribbean
// Southern Asia
// Southeastern Asia
// Central and Eastern Europe
// Eastern Asia
// Sub-Saharan Africa

var regionColors = {'Western Europe': '#f44949', 'North America': '#49f47f',
    'Australia and New Zealand': '#f4f149', 'Middle East and Northern Africa': '#49c9f4', 'Latin America and Caribbean': '#f449da',
    'Southern Asia': '#49f4ce', 'Southeastern Asia': '#c6cad1', 'Central and Eastern Europe': '#f7b44a', 'Eastern Asia': '#775826', 'Sub-Saharan Africa': '#ad4ee5'};

var radius = 6;

d3.csv('./data/yearlyData.csv',
    function(d) {
        return {
            country: d.Country,
            year: +d.Year,
            region: d.Region,
            rank: +d['Happiness Rank'],
            score: +d['Happiness Score'],
            gdpPercap: +d['Economy (GDP per Capita)'],
            family: +d.Family,
            health: +d['Health (Life Expectancy)'],
            freedom: +d.Freedom,
            generosity: +d.Generosity,
            trust: +d['Trust (Government Corruption)'],
            dystResidual: +d['Dystopia Residual']
        }
    },
    function(error, dataset) {
        if (error) {
            console.error('Error while loading datasets.');
            console.error(error);
            return;
        }

        dataByCountry = d3.nest()
            .key(function(d) {
                return d.country;
            })
            .entries(dataset);

            dataByRegion = d3.nest()
                .key(function(d) {
                    return d.region;
                })
                .entries(dataset);
                console.log(dataByRegion);

        allData = dataset;

        // Create bubble chart

        // x-axis
        xScale = d3.scaleLinear()
            .domain(d3.extent(allData, function(d) {
                return d.family;
            }))
            .range([0, chartWidth]);
        var xAxis = d3.axisBottom(xScale);
        var xAxisG = bubbleChartG.append('g')
            .attr('transform', 'translate(' + [0, chartHeight] + ')')
            .attr('class', 'axis')
            .call(xAxis);

        // y-axis
        yScale = d3.scaleLinear()
            .domain([0, 10])
            .range([chartHeight, 0]);

        var yAxis = d3.axisLeft(yScale).ticks(10);
        var yAxisG = bubbleChartG.append('g')
            .attr('class', 'axis')
            .call(yAxis);
        bubbleChartG.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'translate(' + [-padding.l / 2, -padding.t / 2] + ')')
            .text('Happiness Score');

        updateChart(2015)
    });

function updateChart(year) {
    // Remove previous tooltip
    d3.selectAll('.d3-tip').remove();

    var yearData = allData.filter(function(d) {
        return d.year == year;
    });

    var circles = bubbleChartG.selectAll('.country')
        .data(yearData, function(d) {
            return d.country; // Object constancy by country
        });

    // Append circle
    var circleEnter = circles.enter()
        .append('g')
        .attr('class', 'country');

    circleEnter.append('circle')
        .attr('fill', function(d) {
            if (regionColors[d.region]) {
                return regionColors[d.region];
            }
            return '#fff';
        })
        .style('stroke', '#888');

    // Append tooltip
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function(d) {
          return "<strong>" + d.country + "</strong>";
      });


    // Update circle and tooltip when data changes
    circles.merge(circleEnter).call(tip);

    circles.merge(circleEnter)
        .select('circle')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .transition()
        .duration(750)
        .attr('opacity', 0.8)
        .attr('r', function(d) {
            return radius;
        })
        .attr('cx', function(d) {
            return xScale(+d.family)
        })
        .attr('cy', function(d) {
            return yScale(+d.score)
        });

    // Remove some countries for which data in a given year might not be present
    circles.exit().remove();
}
