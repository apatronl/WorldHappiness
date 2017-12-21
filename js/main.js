var selectedYear = 2015;
var selectedIndicator = 'family';
var selectedCountry = '';

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
var colors = {white: '#fff', lightGray: '#888', purple: '#a442f4'};

var chartWidth = (svgWidth * 2/3) - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var bubbleChartG = svg.append('g')
    .attr('transform', 'translate(' + [padding.l, padding.t] + ')');

var detailsGroup = svg.append('g')
    .attr('transform', 'translate(' + [padding.l*2 + chartWidth, padding.t] + ')');

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

// var dystopiaFilter = filtersGroup.append('g')
//     .attr('class', 'filter')
//     .attr('value', 'dystResidual')
//     .on('click', function() {
//         onFilterChanged(d3.select(this));
//     });
// dystopiaFilter.append('rect')
//     .attr('height', 20)
//     .attr('width', 102)
//     .attr('x', 188)
//     .attr('y', 30)
//     .attr('rx', 3)
//     .attr('ry', 3);
// dystopiaFilter.append('text')
//     .attr('x', 192)
//     .attr('dy', '4em')
//     .text('Dystopia Residual');

// Country details on bubble chart hover
var countryDetailsWidth = (svgWidth * 1/3) - padding.l;
var countryDetailsHeight = chartHeight * 4/5;
var countryDetailsX = (((svgWidth * 1/3) - padding.l) / 2) - (countryDetailsWidth/2);
var countryDetailsY = chartHeight - (chartHeight * 3/4) - padding.b;

var countryDetailsGroup = detailsGroup.append('g')
    .attr('class', 'countryDetails')
    .attr('transform', 'translate(' + [countryDetailsX, countryDetailsY] + ')');

var countryDetailsBarChartG = countryDetailsGroup.append('g')
    .attr('transform', 'translate(' + [countryDetailsX, 3.8*countryDetailsY] + ')');

var barChartWidth = countryDetailsWidth;
var barChartHeight = countryDetailsHeight / 1.8;

var years = [2015, 2016, 2017];

// Color mapping by region
var regionColors = {'America': '#49f47f', 'Europe': '#f44949', 'Africa': '#49c9f4', 'Asia': '#f4b642'};

var radius = 6;

d3.csv('./data/yearlyData.csv',
    function(d) {
        return {
            country: d.Country,
            year: +d.Year,
            region: d.Region,
            rank: +d['Happiness Rank'],
            score: +(+d['Happiness Score']).toFixed(3),
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
                return 100*d.family/d.score;
            }))
            .range([0, chartWidth]);
        xAxis = d3.axisBottom(xScale).tickFormat(function(d) { return d + '%'; });
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
            .text('Family Percent Contribution to Happiness Score');

        bubbleChartG.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'translate(' + [padding.l/2, -padding.t / 4] + ')')
            .text('Happiness Score');

        updateChart(2015, 'family');
        showCountryDetails(dataByCountry[0].values[0]);
        updateCountryDetails(dataByCountry[0].values[0]);
        selectedCountry = dataByCountry[0].values[0].country;
    });

/** Helper functions **/

function updateChart(year, indicator) {
    d3.selectAll('.d3-tip').remove();

    var yearData = allData.filter(function(d) {
        return d.year == year;
    });

    var circles = bubbleChartG.selectAll('.country')
        .data(yearData, function(d) {
            return d.country; // Object constancy by country
        });

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

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
          return "<strong>" + d.country + "</strong>";
      });

    circles.merge(circleEnter).call(tip);

    circles.merge(circleEnter)
        .select('circle')
        .on('mouseenter', tip.show)
        .on('mouseleave', tip.hide)
        .on('mouseover', function(d) {
            selectedCountry = d.country;
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
            return xScale(100*d[indicator]/d.score)
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
    xAxisLabel.text(indicatorToLabel[indicator] + ' Percent Contribution to Happiness Score');
    xScale.domain(d3.extent(allData, function(d) {
        return 100*d[indicator]/d.score;
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
        .attr('class', 'countryDetails')
        .attr('id', 'happinessScore')
        .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t*4] + ')')
        .text('Happiness Score: ' + countryData.score);

    countryDetailsGroup.append('text')
        .attr('class', 'countryName')
        .text('What makes ' + countryData.country + ' happy?')
        .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t/2] + ')');

    // x-axis
    xScaleDetails = d3.scaleLinear()
        // .domain(d3.extent(countryData.factors))
        .domain([0, 4])
        .range([0, barChartWidth - padding.l*2]);
    xAxisDetails = d3.axisBottom(xScaleDetails).ticks(5);//.tickSizeOuter(0);
    xAxisDetailsG = countryDetailsGroup.append('g')
        .attr('transform', 'translate(' + [padding.l*2, countryDetailsHeight + 35] + ')')
        .attr('class', 'x axis')
        .call(xAxisDetails);

    countryDetailsGroup.append('text')
        .attr('class', 'axis-label-small')
        .attr('transform', 'translate(' + [countryDetailsWidth/1.45, countryDetailsHeight + 36*2] + ')')
        .text('Factor Contribution to Happiness Score');

    countryDetailsGroup.append('text')
        .attr('class', 'axis-label-small')
        .attr('transform', 'translate(' + [countryDetailsWidth/1.45, countryDetailsHeight + 36*2.4] + ')')
        .text('Points | Percent of Score');


    factorsLabels = countryDetailsGroup.selectAll('#indicatorLabel')
        .data(countryData.factors)
        .enter()
        .append('g')
        .attr('id', 'indicatorLabel');

    factorsLabels.append('text').text(function(d, i) {
            key = Object.keys(indicatorToLabel)[i];
            return indicatorToLabel[key];
        })
        .attr('class', 'detailsBarLabel')
        .style('text-anchor', 'end')
        .attr('x', padding.l * 1.9)
        .attr('y', function(d, i) {
            return 250 + 26.5 + (i*21);
        });

}

function updateCountryDetails(countryData) {
    countryDetailsGroup.select('.countryName').text('What makes ' + countryData.country + ' happy?');
    countryDetailsGroup.select('.countryFlag')
        .attr('xlink:href', function() {
            return './img/' + countryData.country + '.png';
        });
    countryDetailsGroup.select('#rank').text('Rank: ' + countryData.rank);
    countryDetailsGroup.select('#happinessScore').text('Happiness Score: ' + countryData.score);

    var bars = countryDetailsGroup.selectAll('.bar')
        .data(countryData.factors, function(d, i) {
            return countryData.country + i;
        });

    var barEnter = bars.enter()
        .append('g')
        .attr('class', 'bar');

    barEnter.append('rect')
        .style('fill', function() { return colors.purple; })
        .attr('rx', 3);

    barEnter.append('text');

    bars.merge(barEnter)
        .select('rect')
        .attr('x', padding.l*2)
        .attr('y', function(d, i) {
            return 250 + 15 + (i*21);
        })
        .transition().duration(450)
        .attr('width', function(d) { return xScaleDetails(d); })
        .attr('height', 15);

    bars.merge(barEnter)
        .select('text')
        .text(function(d) {
            return d.toFixed(2) + ' | ' + (100*d/countryData.score).toFixed(0) + '%';
        })
        .attr('class', 'detailsBarLabel')
        .attr('id', 'factorContribution')
        .style('text-anchor', 'start')
        .transition().duration(450)
        .attr('x', function(d) { return padding.l * 2 + xScaleDetails(d) + 3; })
        .attr('y', function(d, i) {
            return 250 + 26.5 + (i*21);
        });
}

function updateCountryDetailsOnYearChange() {
    yearToIdx = {2015:0, 2016:1, 2017:2};
    countryDetailsGroup.select('#year').text('Year ' + selectedYear);

    // TODO: update country rank and indicator distribution
    // if (dataByCountry[selectedCountry][yearToIdx[selectedYear]]) {
    //     updateCountryDetails(dataByCountry[selectedCountry][yearToIdx[selectedYear]]);
    // } else {
    //     updateCountryDetails(dataByCountry[0].values[yearToIdx[selectedYear]]);
    // }
}
