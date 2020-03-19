'use strict';
var rtpots_travel_reporter = angular.module('rtpots_travel_reporter', ['ui.router', 'datatables']);

rtpots_travel_reporter.constant('config', {
});

rtpots_travel_reporter.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

	$stateProvider

	.state('home', {
          url: "/",
          params: {
          },
          templateUrl: 'views/client-view.html',
          controller: 'TravelReporterCtrl'
        });

    }
]);
