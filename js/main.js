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

var highlighted = 1;
var visible = 0.8;
var invisible = 0.3;

// Creates a bootstrap-slider element
$("#yearSlider").slider({
    tooltip: 'always',
    tooltip_position:'bottom'
});

// Listens to the on "change" event for the slider
$("#yearSlider").on('change', function(event){
    // Update the chart on the new value
    selectedYear = event.value.newValue;
    updateCountryDetailsOnYearChange();
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
    .attr('x', 188)
    .attr('y', 30)
    .attr('rx', 3)
    .attr('ry', 3);
dystopiaFilter.append('text')
    .attr('x', 192)
    .attr('dy', '4em')
    .text('Dystopia Residual');

// Country details on bubble chart hover
var countryDetailsWidth = (svgWidth * 1/3) - padding.l;
var countryDetailsHeight = chartHeight * 4/5;
var countryDetailsX = (((svgWidth * 1/3) - padding.l) / 2) - (countryDetailsWidth/2);
var countryDetailsY = chartHeight - (chartHeight * 3/4) - padding.b;

// detailsGroup.append('rect')
//     .attr('fill', colors.white)
//     .attr('stroke', colors.lightGray)
//     .attr('x', countryDetailsX)
//     .attr('y', countryDetailsY)
//     .attr('height', countryDetailsHeight)
//     .attr('width', countryDetailsWidth)

var countryDetailsGroup = detailsGroup.append('g')
    .attr('class', 'countryDetails')
    .attr('transform', 'translate(' + [countryDetailsX, countryDetailsY] + ')');

var countryDetailsBarChartG = countryDetailsGroup.append('g')
    .attr('transform', 'translate(' + [countryDetailsX, 3.8*countryDetailsY] + ')');

var barChartWidth = countryDetailsWidth;
var barChartHeight = countryDetailsHeight / 1.8;

// countryDetailsGroup.append('rect')
//     .attr('fill', colors.white)
//     .attr('stroke', colors.lightGray)
//     .attr('x', countryDetailsX)
//     .attr('y', 3.8*countryDetailsY)
//     .attr('height', countryDetailsHeight / 1.8)
//     .attr('width', countryDetailsWidth);

var years = [2015, 2016, 2017];

// Color mapping by region
var regionColors = {'America': '#49f47f', 'Europe': '#f44949', 'Africa': '#49c9f4', 'Asia': '#f4f149'};

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
            dystResidual: +d['Dystopia Residual'],
            factors: [
                +d['Economy (GDP per Capita)'],
                +d.Family,
                +d['Health (Life Expectancy)'],
                +d.Freedom,
                +d.Generosity,
                +d['Trust (Government Corruption)'],
                +d['Dystopia Residual']
            ]

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
            bubbleChartG.selectAll('circle')
                .attr('opacity', function(e) {
                    return d.country == e.country ? highlighted : invisible;
                });
        })
        .on('mouseout', function(d) {
            bubbleChartG.selectAll('circle').attr('opacity', visible);
        })
        .transition()
        .duration(650)
        .attr('opacity', visible)
        .attr('r', function(d) {
            return radius;
        })
        .attr('cx', function(d) {
            return xScale(d[indicator])
        })
        .attr('cy', function(d) {
            return yScale(d.score)
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
    countryDetailsGroup.append('image')
        .attr('class', 'countryFlag')
        .attr('xlink:href', function() {
            return './img/' + countryData.country + '.png';
        })
        .attr('width', 130)
        .attr('height', 130)
        .attr('x', countryDetailsWidth / 2 - 65)
        .attr('y', padding.t/2);

    countryDetailsYear = countryDetailsGroup.append('text')
        .attr('class', 'countryDetails')
        .attr('id', 'year')
        .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t*3] + ')')
        .text('Year ' + selectedYear);

    countryDetailsGroup.append('text')
        .attr('class', 'countryDetails')
        .attr('id', 'rank')
        .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t*3.5] + ')')
        .text('Rank: ' + countryData.rank);

    countryDetailsGroup.append('text')
        .attr('class', 'countryName')
        .text('What makes ' + countryData.country + ' happy?')
        .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t/2] + ')');

    // x-axis
    xScaleDetails = d3.scaleLinear()
        .domain(d3.extent(countryData.factors))
        .range([0, barChartWidth - padding.l]);
    xAxisDetails = d3.axisBottom(xScaleDetails).ticks(5);//.tickSizeOuter(0);
    xAxisDetailsG = countryDetailsGroup.append('g')
        .attr('transform', 'translate(' + [padding.l, countryDetailsHeight + 36] + ')')
        .attr('class', 'x axis')
        .call(xAxisDetails);

    bars = countryDetailsGroup.selectAll('bar')
        .data(countryData.factors)
        .enter()

        .append('rect')
        .style('fill', function(d) { return colors.lightGray; })
        .attr('class', 'bar')
        .attr('x', padding.l)
        .attr('y', function(d, i) {
            return 250 + 15 + (i*21);
        })
        .transition().duration(550)
        .attr('width', function(d) { return xScaleDetails(d); })
        .attr('height', 15);
}

function updateCountryDetails(countryData) {
    countryDetailsGroup.select('.countryName').text('What makes ' + countryData.country + ' happy?');
    countryDetailsGroup.select('.countryFlag')
        .attr('xlink:href', function() {
            return './img/' + countryData.country + '.png';
        });
    countryDetailsGroup.select('#rank').text('Rank: ' + countryData.rank);

    xScaleDetails.domain(d3.extent(countryData.factors));
    xAxisDetailsG.transition().duration(550).call(xAxisDetails);
    countryDetailsGroup.selectAll('.bar').remove();
    countryDetailsGroup.selectAll('.bar')
        .data(countryData.factors)
        .enter()
        .append('rect')
        .style('fill', function(d) { return colors.lightGray; })
        .attr('class', 'bar')
        .attr('x', padding.l)
        .attr('y', function(d, i) {
            return 250 + 15 + (i*21);
        })
        //.transition().duration(550)
        .attr('width', function(d) { return xScaleDetails(d); })
        .attr('height', 15);
}

function updateCountryDetailsOnYearChange() {
    countryDetailsGroup.select('#year').text('Year ' + selectedYear);
    // TODO: update country rank and indicator distribution
}
