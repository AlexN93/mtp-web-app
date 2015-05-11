'use strict';

angular.module('mtpApp', [
    'ngRoute',
    'mtpApp.map',
    'mtpApp.pie',
    'mtpApp.table'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/map'});
}])
.factory('socketio', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}])
.factory('DataService', ["$filter",
    function($filter) {
        var getHttpLogic = function($http, $url) {
            return $http.get($url);
        };
        var formatDataLogic = function(data) {
            var dataArray = [['Countries', 'Transaction count']];
            for(var i=0; i < data.length; i++) {
                dataArray.push([data[i]["TransactionOrigin"], parseInt(data[i]["TransactionCount"])]);
            }
            return dataArray;
        };
        var formatTableDataLogic = function(data) {
            var dataArray = [];
            for(var i=0; i < data.length; i++) {
                var array = [
                    parseInt(data[i]["TransactionUserID"]),
                    data[i]["TransactionCurrencyFrom"],
                    data[i]["TransactionCurrencyTo"],
                    parseFloat(data[i]["TransactionAmountSell"]),
                    parseFloat(data[i]["TransactionAmountBuy"]),
                    parseFloat(data[i]["TransactionRate"]),
                    data[i]["TransactionTime"]["date"],
                    data[i]["TransactionOrigin"]
                ];
                dataArray.push(array);
            }
            return dataArray;
        };
        return {
            getHttp: getHttpLogic,
            formatData: formatDataLogic,
            formatTableData: formatTableDataLogic
        };
    }
])
.factory('SocketService', ["$filter",
    function($filter) {
        var addDataLogic = function(transaction, data) {
            for(var i=0; i < data.length; i++) {
                if(transaction["originatingCountry"] == data[i][0]){
                    data[i][1] = parseInt(data[i][1]) + 1;
                }
            }
            return data;
        };
        var addTableDataLogic = function(transaction) {
            var array = [
                parseInt(transaction["userId"]),
                transaction["currencyFrom"],
                transaction["currencyTo"],
                parseFloat(transaction["amountSell"]),
                parseFloat(transaction["amountBuy"]),
                parseFloat(transaction["rate"]),
                transaction["timePlaced"],
                transaction["originatingCountry"]
            ];
            return array;
        };
        return {
            addData: addDataLogic,
            addTableData: addTableDataLogic
        };
    }
])
.factory('ActiveController', function () {
    var activeController;
    function setActiveController(name) {
        activeController = name;
    }
    function getActiveController() {
        return activeController;    
    }
    return {
        setActiveController: setActiveController,
        getActiveController: getActiveController
    }
})
.factory('HostService', function () {
    var apiHost = "https://mtp-api.herokuapp.com";
    function getApiHost() {
        return apiHost;
    }
    return {
        getApiHost: getApiHost
    }
});
google.load('visualization', '1', {packages: ['corechart','geochart','table']});