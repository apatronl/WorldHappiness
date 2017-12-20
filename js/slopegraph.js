var svg = d3.select('#ranks_slope_graph svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 50, b: 40, l: 50};

var graphWidth = svgWidth - padding.l - padding.r;
var graphHeight = svgHeight - padding.t - padding.b;

var x1 = padding.l;
var x2 = graphWidth / 2;
var x3 = graphWidth;

var years = [2015, 2016, 2017];
var stroke = 1.5;

d3.csv('./data/yearlyData.csv',
    function(d) {
        return {
            country: d.Country,
            year: +d.Year,
            region: d.Region,
            rank: +d['Happiness Rank'],
            score: +(+d['Happiness Score']).toFixed(3)
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

        data = [];
        for (var i = 0; i < dataByCountry.length; i++) {
            countryData = dataByCountry[i];
            dict = { country: countryData.key };
            for (var j = 0; j < countryData.values.length; j++) {
                yearData = countryData.values[j];
                dict[yearData.year] = yearData.rank;
            }
            data.push(dict);
        }
        console.log(data);
        drawSlopeGraph();
    });

function drawSlopeGraph() {
    var scale = d3.scaleLinear()
        .domain([1, 158])
        .range([0, graphHeight]);

    var lines = svg.selectAll('line')
        .data(data);

    lines.enter()
        .append('line')
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', function(d, i) {
            if (d['2015']) {
                return padding.t + scale(d['2015']);
            }
            return 0;
        })
        .attr('y2', function(d, i) {
            if (d['2016']) {
                return padding.t + scale(d['2016']);
            }
            return 0;
        })
        .style("stroke", "black")
		.attr("stroke-width", stroke);

    lines.enter()
        .append('line')
        .attr('x1', x2)
        .attr('x2', x3)
        .attr('y1', function(d, i) {
            if (d['2016']) {
                return padding.t + scale(d['2016']);
            }
            return 0;
        })
        .attr('y2', function(d, i) {
            if (d['2017']) {
                return padding.t + scale(d['2017']);
            }
            return 0;
        })
        .style("stroke", "black")
        .attr("stroke-width", stroke);

    // i = padding.t;
    //
    // lines.enter()
    //     .append('line')
    //     .attr('x1', x2)
    //     .attr('x2', x3);
        // .attr(y1);
}
