rtpots_travel_reporter.directive('endDatetimePicker', function ($timeout) {
    	return {
		scope: {datepickers: '='},
		templateUrl: 'components/end-datetime-picker.html',
        	link: function (scope, element, attr) {

			var maxDate = new Date();
                        maxDate.setSeconds(maxDate.getSeconds() + 1);

			var initialise = function(){
				element.datetimepicker({
					useCurrent: false,
					format: 'DD/MM/YYYY HH:mm',
					maxDate: maxDate
				});
			};

			//need this timeout to wait for interpolations to be compiled
			$timeout(function(){
				scope.$watchGroup(['datepickers.start', 'datepickers.end'], function(newVals, oldVals){
					if(!newVals[0] && !newVals[1]) {
						$timeout(function(){
							initialise();
						});
					} else {
						if(newVals[0] != oldVals[0]) {
							//start has changed
							element.datetimepicker('minDate', newVals[0]);
						}
					}
				});
			});
        	}
    	};
});
