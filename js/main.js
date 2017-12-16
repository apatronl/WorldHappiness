var selectedYear = 2015;
var selectedIndicator = 'family';

var indicatorToLabel = {
    gdpPercap: 'GDP per Capita',
    family: 'Family',
    health: 'Health (Life Expectancy)',
    freedom: 'Freedom',
    generosity: 'Generosity',
    trust: 'Trust',
    dystResidual: 'Dystopia Residual'
};

// Creates a bootstrap-slider element
$("#yearSlider").slider({
    tooltip: 'always',
    tooltip_position:'bottom'
});

// Listens to the on "change" event for the slider
$("#yearSlider").on('change', function(event){
    // Update the chart on the new value
    selectedYear = event.value.newValue;
    updateChart(selectedYear, selectedIndicator);
});

var svg = d3.select('#bubble_chart svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 60, l: 50};
var colors = {white: '#fff', lightGray: '#888'};

var chartWidth = (svgWidth * 2/3) - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var bubbleChartG = svg.append('g')
    .attr('transform', 'translate(' + [padding.l, padding.t] + ')');

var detailsGroup = svg.append('g')
    .attr('transform', 'translate(' + [padding.l*2 + chartWidth, padding.t] + ')');

// detailsGroup.append('rect')
//     .attr('fill', colors.white)
//     .attr('stroke', colors.lightGray)
//     .attr('height', chartHeight)
//     .attr('width', (svgWidth * 1/3) - padding.l);

// Filters for happiness indicators
var filtersGroup = detailsGroup.append('g');
filtersGroup.append('text')
    .text('Showing data for:');

var familyFilter = filtersGroup.append('g')
    .attr('class', 'filter selected')
    .attr('value', 'family')
    .on('click', function() {
        onFilterChanged(d3.select(this));
    });
familyFilter.append('rect')
    .attr('height', 20)
    .attr('width', 60)
    .attr('x', 3)
    .attr('y', 5)
    .attr('rx', 3)
    .attr('ry', 3);
familyFilter.append('text')
    .attr('x', 7)
    .attr('dy', '1.7em')
    .text('Family');

var gdpFilter = filtersGroup.append('g')
    .attr('class', 'filter')
    .attr('value', 'gdpPercap')
    .on('click', function() {
        onFilterChanged(d3.select(this));
    });
gdpFilter.append('rect')
    .attr('height', 20)
    .attr('width', 90)
    .attr('x', 68)
    .attr('y', 5)
    .attr('rx', 3)
    .attr('ry', 3);
gdpFilter.append('text')
    .attr('x', 72)
    .attr('dy', '1.7em')
    .text('GDP per Capita');

var healthFilter = filtersGroup.append('g')
    .attr('class', 'filter')
    .attr('value', 'health')
    .on('click', function() {
        onFilterChanged(d3.select(this));
    });
healthFilter.append('rect')
    .attr('height', 20)
    .attr('width', 60)
    .attr('x', 163)
    .attr('y', 5)
    .attr('rx', 3)
    .attr('ry', 3);
healthFilter.append('text')
    .attr('x', 167)
    .attr('dy', '1.7em')
    .text('Health');

var freedomFilter = filtersGroup.append('g')
    .attr('class', 'filter')
    .attr('value', 'freedom')
    .on('click', function() {
        onFilterChanged(d3.select(this));
    });
freedomFilter.append('rect')
    .attr('height', 20)
    .attr('width', 60)
    .attr('x', 3)
    .attr('y', 30)
    .attr('rx', 3)
    .attr('ry', 3);
freedomFilter.append('text')
    .attr('x', 7)
    .attr('dy', '4em')
    .text('Freedom');

var generosityFilter = filtersGroup.append('g')
    .attr('class', 'filter')
    .attr('value', 'generosity')
    .on('click', function() {
        onFilterChanged(d3.select(this));
    });
generosityFilter.append('rect')
    .attr('height', 20)
    .attr('width', 65)
    .attr('x', 68)
    .attr('y', 30)
    .attr('rx', 3)
    .attr('ry', 3);
generosityFilter.append('text')
    .attr('x', 72)
    .attr('dy', '4em')
    .text('Generosity');

var trustFilter = filtersGroup.append('g')
    .attr('class', 'filter')
    .attr('value', 'trust')
    .on('click', function() {
        onFilterChanged(d3.select(this));
    });
trustFilter.append('rect')
    .attr('height', 20)
    .attr('width', 45)
    .attr('x', 138)
    .attr('y', 30)
    .attr('rx', 3)
    .attr('ry', 3);
trustFilter.append('text')
    .attr('x', 142)
    .attr('dy', '4em')
    .text('Trust');

var dystopiaFilter = filtersGroup.append('g')
    .attr('class', 'filter')
    .attr('value', 'dystResidual')
    .on('click', function() {
        onFilterChanged(d3.select(this));
    });
dystopiaFilter.append('rect')
    .attr('height', 20)
    .attr('width', 102)
    .attr('x', 186)
    .attr('y', 30)
    .attr('rx', 3)
    .attr('ry', 3);
dystopiaFilter.append('text')
    .attr('x', 190)
    .attr('dy', '4em')
    .text('Dystopia Residual');

// Country details on bubble chart hover
var countryDetailsWidth = (svgWidth * 1/3) - padding.l;
var countryDetailsHeight = chartHeight * 4/5;
var countryDetailsX = (((svgWidth * 1/3) - padding.l) / 2) - (countryDetailsWidth/2);
var countryDetailsY = chartHeight - (chartHeight * 3/4) - padding.b;

detailsGroup.append('rect')
    .attr('fill', colors.white)
    // .attr('stroke', colors.lightGray)
    .attr('x', countryDetailsX)
    .attr('y', countryDetailsY)
    .attr('height', countryDetailsHeight)
    .attr('width', countryDetailsWidth)

var countryDetailsGroup = detailsGroup.append('g')
    .attr('class', 'countryDetails')
    .attr('transform', 'translate(' + [countryDetailsX, countryDetailsY] + ')');

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
        xAxis = d3.axisBottom(xScale);
        xAxisG = bubbleChartG.append('g')
            .attr('transform', 'translate(' + [0, chartHeight] + ')')
            .attr('class', 'x axis')
            .call(xAxis);

        // y-axis
        yScale = d3.scaleLinear()
            .domain([0, 10])
            .range([chartHeight, 0]);

        var yAxis = d3.axisLeft(yScale).ticks(10);
        var yAxisG = bubbleChartG.append('g')
            .attr('class', 'axis')
            .call(yAxis);

        // axis labels
        xAxisLabel = bubbleChartG.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'translate(' + [chartWidth/2, chartHeight + padding.t - padding.b/3] + ')')
            .text('Family Contribution to Happiness Score');

        bubbleChartG.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'translate(' + [padding.l/2, -padding.t / 4] + ')')
            .text('Happiness Score');

        updateChart(2015, 'family');
        showCountryDetails(dataByCountry[0].values[0]);
    });

/** Helper functions **/

function updateChart(year, indicator) {
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
            return colors.white;
        })
        .style('stroke', colors.lightGray);

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
        .on('mouseenter', tip.show)
        .on('mouseleave', tip.hide)
        .on('mouseover', function(d) {
            // Show country details
            updateCountryDetails(d);
        })
        .on('mouseout', function(d) {
            console.log('out');
        })
        .transition()
        .duration(750)
        .attr('opacity', 0.8)
        .attr('r', function(d) {
            return radius;
        })
        .attr('cx', function(d) {
            return xScale(d[indicator])
        })
        .attr('cy', function(d) {
            return yScale(+d.score)
        });

    // Remove some countries for which data in a given year might not be present
    circles.exit().remove();
}

function onFilterChanged(newFilter) {
    d3.select('.filter.selected').classed('selected', false);
    newFilter.classed('selected', true);
    selectedIndicator = newFilter.attr('value');
    updateXAxis(selectedIndicator);
    updateChart(selectedYear, selectedIndicator);
}

function updateXAxis(indicator) {
    xAxisLabel.text(indicatorToLabel[indicator] + ' Contribution to Happiness Score');
    xScale.domain(d3.extent(allData, function(d) {
        return d[indicator];
    }));
    xAxisG.transition().duration(750).call(xAxis);
}

function showCountryDetails(countryData) {
    countryDetailsGroup.append('text')
        .attr('class', 'countryName')
        .text(countryData.country)
        .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t/3] + ')');
}

function updateCountryDetails(countryData) {
    console.log(countryData.country);
    countryDetailsGroup.select('.countryName').text(countryData.country);
}
