rtpots_travel_reporter.directive('sidebar', function ($timeout, $compile) {
    	return {
		scope: {
			distinctUnits: '=',
			mostRecentSelect: '=',
			unitHistorySelect: '=',
			odometerSelect: '=',
			faultSelect: '=',
			activeSection: '=',
			setUnitHistory: '='
		},
		restrict: 'E',
		templateUrl: 'components/sidebar.html',
        	link: function (scope, element, attr) {
        	},
		controller: function($scope){
			$scope.options = [];

			$scope.setUnitHistory = function(unit){
				$scope.unitHistorySelect = [unit];
				$scope.activeSection = 'unitHistory';
			};

			$scope.activeSection = 'mostRecent';
		}
    	};
});
