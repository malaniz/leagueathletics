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
      .get('https://gist.githubusercontent.com/DanielSchaffer/1311d617bb5dd27bd9f6b891a2d06298/raw/22d8072d5d32212509184ebc88160edfcabb3131/results.json')
      .then(function(res) {
        $scope.isLoading = false;
        $scope.data = res.data    
      })
  }

  $scope.search = function(url) {
    console.log(url);

  }
});

function recSearch(items, s) {
  
  var ritems = items.map( function (x) {
    if (x.url.search(s) !== -1) {
      return x;
    } else if (x.childs){
      return {
        url: x.url,
        childs: recSearch( x.childs, s)
      };
    }
  })
  ritems = ritems.filter(function(x) {
    console.log(x);
    return x!== undefined;
  })
  return ritems;
}

app.filter('recfilter', function() {
  return function (input, x) {
    if (!x || !input) { 
      return input;
    } else {
      return recSearch(input, x);
    }
  }
});
