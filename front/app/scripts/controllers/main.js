'use strict';

var app = angular.module('crawlerApp')

function deepSearch(data, s) {
  var regexp = new RegExp(s, 'gi');
  var mapped = [];
  if (data.childs) {
    mapped = data.childs.map(function(x){
      if (regexp.test(x.url)) {
        return { url: x.url }
      } else {
        return deepSearch(x, s)
      }
    }).filter(function(x) {
      return x !== false;
    })
    if (mapped.length > 0) {
      return {
        url: data.url,
        childs: mapped      
      }
    } else {
      return false;
    }
  } else {
    if (regexp.test(data.url)) {
      return { url: data.url } 
    } else {
      return false
    }
  }
}

app.controller('MainCtrl', function ($scope, $rootScope, $timeout, crawler) {
  $scope.url = 'http://leagueathletics.com';
  $scope.step = 1;
  $scope.getData = function(url) {
    crawler
      .get(url)
      .then(function(data){
        $scope.data = data;
        $scope.step = 2;
      })
  }

  $scope.togg = function(scope) {
    scope.toggle();
  }
  $scope.goBack = function() {
    $scope.step = 1;
  }
  $scope.deepfilter = function(data, s) {
    $scope.data = ( (!s) || (s === "")) ? 
      crawler.links() : 
      deepSearch(crawler.links(), s);
  }
});


app.factory('crawler', function($http, $q, $rootScope) {
  var gurl = 'https://gist.githubusercontent.com/DanielSchaffer/1311d617bb5dd27bd9f6b891a2d06298/raw/22d8072d5d32212509184ebc88160edfcabb3131/results.json';
  var links = {};
  return {
    links: function() {
      return angular.copy(links);
    },
    get: function(url) {
      console.log(url);
      return $q(function(resolve, reject) {
        $rootScope.isLoading = true;
        $http
          .get(gurl)
          .then(function(res) {
            $rootScope.isLoading = false;
            links = angular.copy(res.data);
            resolve(res.data)   
          }, function(err) {
            $rootScope.isLoading = false;
            reject(err);
          })
      })
    }
  }
})


