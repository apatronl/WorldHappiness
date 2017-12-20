var map = d3.select('#map');
var mapWidth = +map.attr('width');
var mapHeight = +map.attr('height');

var atlLatLng = new L.LatLng(31.7917, -3.0926);
var myMap = L.map('map').setView(atlLatLng, 1);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 5,
    minZoom: 1.5,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA'
}).addTo(myMap);


var svgLayer = L.svg();
svgLayer.addTo(myMap);

var lowColor = '#f2f3f4';
var highColor = '#3182bd';

d3.queue()
    .defer(d3.csv, './data/2017.csv', function(row) {
        return {
            country: row.Country,
            score: +(+row['Happiness Score']).toFixed(3)
        };
    })
    .defer(d3.json, './json/countries.geo.json')
    .await(draw);

function draw(error, data, countries) {
    if (error) {
        console.error('Error while loading datasets.');
        console.error(error);
        return;
    }
    colorScale = d3.scaleLinear()
        .domain(d3.extent(data, function(d) {
            return d.score;
        }))
        .range([lowColor, highColor]);

    countriesDict = {};
    for (var i = 0; i < data.length; i++) {
        countriesDict[data[i].country] = data[i].score;
    }
    countriesLayer = L.geoJson(countries, {style: style});
    countriesLayer.addTo(myMap);
}

function style(feature) {
    var country = feature.properties.name;
    var score = countriesDict[country];
    if (score) {
        return {
           fillColor: colorScale(score),
           weight: 1,
           opacity: 1,
           color: 'white',
           dashArray: '0',
           fillOpacity: 0.9
       };
    }
    return {
       fillColor: '#888',
       weight: 1,
       opacity: 1,
       color: 'white',
       dashArray: '0',
       fillOpacity: 0.9
   };
}
