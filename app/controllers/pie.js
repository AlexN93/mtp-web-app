'use strict';

angular.module('mtpApp.pie', [
	'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/pie', {
    	templateUrl: 'views/pie.html',
    	controller: 'pieChartController'
  	});
}])
.controller('pieChartController', ['$scope', '$http', 'socketio', 'DataService', 'SocketService', 'ActiveController', 'HostService',
    function ($scope, $http, socketio, DataService, SocketService, ActiveController, HostService) {    
        ActiveController.setActiveController("chart");
        $scope.formattedData = [];

        DataService.getHttp($http, HostService.getApiHost() + "/transactionsPerCountry").success(function(data) { 
            $scope.formattedData = DataService.formatData(data);
            $scope.drawPieChart();
        });
        
        socketio.on('new transaction', function (transaction) {
            if(ActiveController.getActiveController() == "chart") {
                $scope.formattedData = SocketService.addData(transaction, $scope.formattedData);
                $scope.drawPieChart();
            }
        });

        $scope.drawPieChart = function() {
            var data = google.visualization.arrayToDataTable($scope.formattedData);
            var options = {
                title: 'Transactions per country',
                is3D: true,
            };
            var chart = new google.visualization.PieChart(document.getElementById('piechartdiv'));
            chart.draw(data, options);
        }
    }
]);