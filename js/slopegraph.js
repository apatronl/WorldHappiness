/**
 * Draws a slopegraph showing how the ranks of the top 10 happiest countries have changed in the past three years (2015, 2016, 2017).
 *
 * @author Alejandrina Patrón
 */

var slopeGraphSVG = d3.select('#ranks_slope_graph svg');

var slopeGraphSVGWidth = +slopeGraphSVG.attr('width');
var slopeGraphSVGHeight = +slopeGraphSVG.attr('height');

var margin = {t: 40, r: 100, b: 40, l: 100};

var graphWidth = slopeGraphSVGWidth - margin.l - margin.r;
var graphHeight = slopeGraphSVGHeight - margin.t - margin.b;

var x1 = margin.l;
var x2 = margin.l + graphWidth / 2;
var x3 = graphWidth + margin.l;

var years = [2015, 2016, 2017];
var coords = [x1, x2, x3];
var stroke = 2.6;

// Color mapping by region
var regionColors = {'America': '#49f47f', 'Europe': '#f44949', 'Africa': '#49c9f4', 'Asia': '#f4b642'};

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
    function(error, slopeGraphDataset) {
        if (error) {
            console.error('Error while loading datasets.');
            console.error(error);
            return;
        }

        slopeGraphDataByCountry = d3.nest()
            .key(function(d) {
                return d.country;
            })
            .entries(slopeGraphDataset);

        data = [];
        for (var i = 0; i < 10; i++) {
            countryData = slopeGraphDataByCountry[i];
            dict = { country: countryData.key };
            for (var j = 0; j < countryData.values.length; j++) {
                yearData = countryData.values[j];
                dict[yearData.year] = yearData.rank;
            }
            dict.region = yearData.region;
            data.push(dict);
        }
        drawSlopeGraph();
    });

function drawSlopeGraph() {
    var scale = d3.scaleLinear()
        .domain([1, 10])
        .range([margin.t, graphHeight]);

    slopeGraphSVG.selectAll('.year')
        .data(years)
        .enter()
        .append('text')
        .text(function(d) {
            return d;
        })
        .attr('fill', '#888')
        .attr('text-anchor', 'middle')
        .attr('x', function(d, i) {
            return coords[i];
        })
        .attr('y', margin.t / 2);

    var lines = slopeGraphSVG.selectAll('line')
        .data(data);

    lines.enter()
        .append('line')
        .on('mouseover', function(d) {
            slopeMouseEnter(d.country);
        })
        .on('mouseout', function(d) {
            slopeMouseLeave();
        })
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
        .style("stroke", function(d) {
            return regionColors[d.region];
        })
		.attr("stroke-width", stroke);

    lines.enter()
        .append('line')
        .on('mouseover', function(d) {
            slopeMouseEnter(d.country);
        })
        .on('mouseout', function(d) {
            slopeMouseLeave();
        })
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
        .style("stroke", function(d) {
            return regionColors[d.region];
        })
        .attr("stroke-width", stroke);

    lines.enter()
        .append('circle')
        .on('mouseover', function(d) {
            slopeMouseEnter(d.country);
        })
        .on('mouseout', function(d) {
            slopeMouseLeave();
        })
        .attr('r', stroke*4)
        .attr('cx', x1)
        .attr('cy', function(d) {
            return scale(d['2015']);
        })
        .attr('fill', function(d) {
            return regionColors[d.region];
        });

    lines.enter()
        .append('circle')
        .on('mouseover', function(d) {
            slopeMouseEnter(d.country);
        })
        .on('mouseout', function(d) {
            slopeMouseLeave();
        })
        .attr('r', stroke*4)
        .attr('cx', x2)
        .attr('cy', function(d) {
            return scale(d['2016']);
        })
        .attr('fill', function(d) {
            return regionColors[d.region];
        });

    lines.enter()
        .append('circle')
        .on('mouseover', function(d) {
            slopeMouseEnter(d.country);
        })
        .on('mouseout', function(d) {
            slopeMouseLeave();
        })
        .attr('r', stroke*4)
        .attr('cx', x3)
        .attr('cy', function(d) {
            return scale(d['2017']);
        })
        .attr('fill', function(d) {
            return regionColors[d.region];
        });

    lines.enter()
        .append('text')
        .on('mouseover', function(d) {
            slopeMouseEnter(d.country);
        })
        .on('mouseout', function(d) {
            slopeMouseLeave();
        })
        .text(function(d) {
            return d.country;
        })
        .attr('id', 'countryName')
        .attr('text-anchor', 'end')
        .style('font-size', 13)
        .attr('fill', '#888')
        .attr('transform', function(d) {
            return 'translate(' + [x1/1.2, scale(d['2015']) + 4] + ')';
        });

    lines.enter()
        .append('text')
        .text(function(d, i) {
            return i + 1;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', 13)
        .attr('fill', '#fff')
        .attr('transform', function(d, i) {
            return 'translate(' + [x1, scale(i+1) + 5] + ')';
        });

    lines.enter()
        .append('text')
        .text(function(d, i) {
            return i + 1;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', 13)
        .attr('fill', '#fff')
        .attr('transform', function(d, i) {
            return 'translate(' + [x2, scale(i+1) + 5] + ')';
        });

    lines.enter()
        .append('text')
        .text(function(d, i) {
            return i + 1;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', 13)
        .attr('fill', '#fff')
        .attr('transform', function(d, i) {
            return 'translate(' + [x3, scale(i+1) + 5] + ')';
        });
}

function slopeMouseEnter(country) {
    slopeGraphSVG.selectAll('line')
        .attr('opacity', function(d) {
            return d.country == country ? 1 : 0.3;
        });

    slopeGraphSVG.selectAll('circle')
        .attr('opacity', function(d) {
            return d.country == country ? 1 : 0.3;
        });

    slopeGraphSVG.selectAll('#countryName')
        .attr('opacity', function(d) {
            return d.country == country ? 1 : 0.3;
        });
}

function slopeMouseLeave() {
    slopeGraphSVG.selectAll('line')
        .attr('opacity', 1);

    slopeGraphSVG.selectAll('circle')
        .attr('opacity', 1);

    slopeGraphSVG.selectAll('#countryName')
        .attr('opacity', 1);
}
