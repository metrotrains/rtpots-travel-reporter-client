rtpots_travel_reporter.directive('selectWatcher', function ($timeout) {
    	return {
		scope: {
			options: "=options",
			ngModel: '='
		},
        	link: function (scope, element, attr) {
			//only initialise once distinctUnits are available
			scope.$watch('options', function(newVal, oldVal) {
				//need this timeout to wait for interpolations to be compiled
				$timeout(function(){
					if(newVal != oldVal) {
						var html = "";
						newVal.forEach(function(opt){
							html += "<option>";
							html += opt;
							html += "</option>";
						});

						if(element[0].id === "first-select") {
							element.html(html).selectpicker({
								noneSelectedText: 'All Selected (default)'
							});
						} else if (element[0].id === "second-select") {
							element.html(html).selectpicker({
								noneSelectedText: 'None Selected (default)'
							});
						}
					}
				});
			}, true);

			scope.$watch('ngModel',function(newVal, oldVal){
				if(newVal !== oldVal) {
					element.selectpicker('val', newVal);
				}
			});
        	}
    	};
});
