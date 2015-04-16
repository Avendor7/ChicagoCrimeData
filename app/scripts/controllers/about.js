'use strict';

/**
 * @ngdoc function
 * @name chicagoPdApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the chicagoPdApp
 */
angular.module('chicagoPdApp')
    .controller('AboutCtrl', function ($scope) {
        $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
        var w = 400;
        var h = 400;
        var r = h / 2;
        var color = d3.scale.category20c();

        d3.json("https://data.cityofchicago.org/resource/ijzp-q8t2.json", function (error, unsorteddata) {

            var data = d3.nest().key(function (d) {
                return d.district
            }).rollup(function (d) {
                return d.length
            }).entries(unsorteddata)

            x.domain(data.map(function (d) {
                return d.key
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.values
            })]);

            var vis = d3.select('.jumbotron').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
            var pie = d3.layout.pie().value(function (d) {
                return d.values;
            });

            // declare an arc generator function
            var arc = d3.svg.arc().outerRadius(r);

            // select paths, use arc generator to draw
            var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
            arcs.append("svg:path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", function (d) {
                    // log the result of the arc generator to show how cool it is :)
                    console.log(arc(d));
                    return arc(d);
                });

            // add the text
            arcs.append("svg:text").attr("transform", function (d) {
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";
            }).attr("text-anchor", "middle").text(function (d, i) {
                return data[i].label;
            });
        });
    });