'use strict';

/**
 * @ngdoc function
 * @name chicagoPdApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chicagoPdApp
 */
angular.module('chicagoPdApp')
    .controller('MainCtrl', function ($scope) {
        $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
        var margin = {
                top: 20,
                right: 30,
                bottom: 30,
                left: 40
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // scale to ordinal because x axis is not numerical
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

        //scale to numerical value by height
        var y = d3.scale.linear().range([height, 0]);

        var chart = d3.select(".jumbotron")
            .append("svg") //append svg element inside #chart
            .attr("width", width + (2 * margin.left) + margin.right) //set width
            .attr("height", height + margin.top + margin.bottom); //set height
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom"); //orient bottom because x-axis will appear below the bars

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        d3.json("https://data.cityofchicago.org/resource/ijzp-q8t2.json", function (error, unsorteddata) {

            var data = d3.nest().key(function (d) {
                return d.primary_type
            }).rollup(function (d) {
                return d.length
            }).entries(unsorteddata)

            x.domain(data.map(function (d) {
                return d.key
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.values
            })]);

            var bar = chart.selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + x(d.key) + ", 0)";
                });

            bar.append("rect")
                .attr("y", function (d) {
                    return y(d.values);
                })
                .attr("x", function (d, i) {
                    return x.rangeBand() + (margin.left / 4);
                })
                .attr("height", function (d) {
                    return height - y(d.values);
                })
                .attr("width", x.rangeBand()); //set width base on range on ordinal data

            bar.append("text")
                .attr("x", x.rangeBand() + margin.left)
                .attr("y", function (d) {
                    return y(d.values) - 10;
                })
                .attr("dy", ".75em")
                .text(function (d) {
                    return d.values;
                });

            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + "," + height + ")")
                .call(xAxis);

            chart.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");
        });

        function type(d) {
            d.key = +d.key; // coerce to number
            return d;
        }
    });
//---------------------------------------------------------------------