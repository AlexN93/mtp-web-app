'use strict';

angular.module('mtpApp.table', [
	'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/table', {
  		templateUrl: 'views/table.html',
   		controller: 'tableController'
  	});
}])
.controller('tableController', ['$scope', '$http', 'socketio', 'DataService', 'SocketService', 'ActiveController', 'HostService',
    function ($scope, $http, socketio, DataService, SocketService, ActiveController, HostService) {
      ActiveController.setActiveController("table");
    	$scope.formattedData = [];

    	DataService.getHttp($http, HostService.getApiHost() + "/listTransactions").success(function(data) {
    		$scope.formattedData = DataService.formatTableData(data);
    		$scope.drawTable();
		});

		socketio.on('new transaction', function (transaction) {
        	if(ActiveController.getActiveController() == "table") {
                var array = SocketService.addTableData(transaction);
                $scope.formattedData.push(array);
                $scope.drawTable();
            }
      	});

      	$scope.drawTable = function() {
            var data = new google.visualization.DataTable({
    			cols: [
    				{id: 'UserID', label: 'User ID', type: 'number'},
           			{id: 'CurrencyFrom', label: 'Currency From', type: 'string'},
           			{id: 'CurrencyTo', label: 'Currency To', type: 'string'},
           			{id: 'AmountSell', label: 'Amount Sell', type: 'number'},
           			{id: 'AmountBuy', label: 'Amount Buy', type: 'number'},
           			{id: 'Rate', label: 'Rate', type: 'number'},
           			{id: 'TimePlaced', label: 'Time Placed', type: 'string'},
           			{id: 'OriginatingCountry', label: 'Originating Country', type: 'string'}
           		]
           	});
           	data.addRows($scope.formattedData);
            var table = new google.visualization.Table(document.getElementById('tablediv'));
        	table.draw(data, {showRowNumber: true});
        }
    }
]);