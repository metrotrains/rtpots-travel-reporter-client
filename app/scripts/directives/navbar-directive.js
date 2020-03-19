rtpots_travel_reporter.directive('navbar', ['StatusService', function (StatusService) {
    	return {
		restrict: 'E',
		templateUrl: 'components/navbar.html',
        	link: function (scope, element, attr) {
        	},
		controller: function($scope){
			$scope.statuses = StatusService.getStatuses();
		}
    	};
}]);
