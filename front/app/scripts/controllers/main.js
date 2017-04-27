'use strict';

/**
 * @ngdoc function
 * @name crawlerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the crawlerApp
 */
var app = angular.module('crawlerApp')
/*
app.controller('MainCtrl', function ($scope, $http) {
  $scope.tree = [{referer: 'http://leagueathletics.com', nodes: [], isLoading: false}];
  $scope.getData = function(data) {
    data.isLoading = true;
    $http
      .get('http://localhost:8080/getsite/?url=' + data.referer)
      .then(function(res) {
        data.isLoading = false;
        data.nodes = res.data.map(function(x) {
          return { referer: x, nodes: [], isLoading: false}
        });
      })
  }
});
*/

app.controller('MainCtrl', function ($scope, $http) {
  $scope.url = 'http://leagueathletics.com';
  $scope.isLoading = false;
  $scope.getData = function(url) {

    $scope.isLoading = true;
    $http
      .get('http://localhost:8080/rec/?url=' + url)
      .then(function(res) {
        $scope.isLoading = false;
        $scope.data = res.data    
      })
  }

});
