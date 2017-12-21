var slopeGraphSVG = d3.select('#ranks_slope_graph svg');

var svgWidth = +slopeGraphSVG.attr('width');
var svgHeight = +slopeGraphSVG.attr('height');

var margin = {t: 40, r: 100, b: 40, l: 100};

var graphWidth = svgWidth - margin.l - margin.r;
var graphHeight = svgHeight - margin.t - margin.b;

var x1 = margin.l;
var x2 = margin.l + graphWidth / 2;
var x3 = graphWidth + margin.l;

var years = [2015, 2016, 2017];
var stroke = 1.8;

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
        // for (var i = 0; i < dataByCountry.length; i++) {
        for (var i = 0; i < 10; i++) {
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
        .domain([1, 10])
        .range([margin.t, graphHeight]);

    var lines = slopeGraphSVG.selectAll('line')
        .data(data);

    lines.enter()
        .append('line')
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', function(d, i) {
            if (d['2015']) {
                return scale(d['2015']);
            }
            return 0;
        })
        .attr('y2', function(d, i) {
            if (d['2016']) {
                return scale(d['2016']);
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
                return scale(d['2016']);
            }
            return 0;
        })
        .attr('y2', function(d, i) {
            if (d['2017']) {
                return scale(d['2017']);
            }
            return 0;
        })
        .style("stroke", "black")
        .attr("stroke-width", stroke);

    lines.enter()
        .append('text')
        .text(function(d) {
            return d.country;
        })
        .attr('text-anchor', 'end')
        .attr('transform', function(d) {
            return 'translate(' + [x1/1.06, scale(d['2015'])] + ')';
        });
}
