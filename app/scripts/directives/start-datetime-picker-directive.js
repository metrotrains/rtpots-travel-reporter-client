rtpots_travel_reporter.directive('startDatetimePicker', function ($timeout) {
    	return {
		scope: {datepickers: '='},
		templateUrl: 'components/start-datetime-picker.html',
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
						if (newVals[1] != oldVals[1]) {
							//end has changed
							element.datetimepicker('maxDate', newVals[1]);
						}
					}
				});
			});
        	}
    	};
});
