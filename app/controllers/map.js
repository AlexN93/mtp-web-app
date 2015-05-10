'use strict';

angular.module('mtpApp.map', [
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/map', {
    	templateUrl: 'views/map.html',
    	controller: 'mapChartController'
	});
}])
.controller('mapChartController', ['$scope', '$http', 'socketio', 'DataService', 'SocketService', 'ActiveController', 'HostService',
	function ($scope, $http, socketio, DataService, SocketService, ActiveController, HostService) {
        ActiveController.setActiveController("map");
        $scope.formattedData = [];

        DataService.getHttp($http, HostService.getApiHost() + "/transactionsPerCountry").success(function(data) { 
            $scope.formattedData = DataService.formatData(data);
            $scope.drawMap();
        });

        socketio.on('new transaction', function (transaction) {
            if(ActiveController.getActiveController() == "map") {
                $scope.formattedData = SocketService.addData(transaction, $scope.formattedData);
                $scope.drawMap();
            }
        });

        $scope.drawMap = function() {
            var data = google.visualization.arrayToDataTable($scope.formattedData);
            var options = {
                colorAxis: {colors: ['#e7711c', '#4374e0']}
            };
            var chart = new google.visualization.GeoChart(document.getElementById('mapchartdiv'));
            chart.draw(data, options);
        }
}]);