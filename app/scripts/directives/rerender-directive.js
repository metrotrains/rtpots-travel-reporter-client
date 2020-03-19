rtpots_travel_reporter.directive('rerender', function ($timeout) {
    	return {
		scope: {
			dtInstance: "="
		},
		restrict: 'A',
		link: function(scope, element) {
		},
		controller: function($scope){
			console.log($scope);
			var index;
			$scope.$watch('$parent.$index', function(newVal, oldVal){
				if(newVal != oldVal)
				{
					//console.log(newVal + " " + oldVal);
					//if(typeof $scope.dtInstance.rerender === "function") $scope.dtInstance.rerender();
				}
			});
		}
    	};
});
