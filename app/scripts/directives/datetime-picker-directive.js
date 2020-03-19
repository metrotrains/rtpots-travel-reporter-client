rtpots_travel_reporter.directive('datetimePicker', function ($timeout) {
    	return {
		scope: {ngModel: '='},
		templateUrl: 'components/datetime-picker.html',
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

			initialise();
        	}
    	};
});
