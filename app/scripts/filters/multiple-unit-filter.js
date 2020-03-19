rtpots_travel_reporter.filter('multipleUnitFilter', function () {
    return function (objsToFilter, filterFields) {

	var items = {
		filterFields: filterFields,
		out: []
	};

	angular.forEach(objsToFilter, function (value, key) {
		if(filterFields == null || filterFields.length == 0) {
			this.out.push(value);	
            	} else if (items.filterFields.includes(value.unit)) {
                	this.out.push(value);
            	}
        }, items);

        return items.out;
    };
});
