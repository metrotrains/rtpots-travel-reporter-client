rtpots_travel_reporter.filter('timeFilter', function () {
    return function (objsToFilter, datetimePickers) {

	var momentFormatToDate = function(dateToConvert){
		if(dateToConvert != null)
		return new Date(dateToConvert.substring(6,10),
				dateToConvert.substring(3,5) - 1,
				dateToConvert.substring(0,2),
				dateToConvert.substring(11,13),
				dateToConvert.substring(14,16));
	}

	var items = {
		filterFields: {
			start: datetimePickers.start ? momentFormatToDate(datetimePickers.start) : 0, //this will either be 1970 or selected date
			end: datetimePickers.end ? momentFormatToDate(datetimePickers.end) : new Date()}, //this will either be now or selected date
		out: []
	};

	angular.forEach(objsToFilter, function (value, key) {
		var eventTime;
		if(!value.time) 
			eventTime = new Date(value.time_of_read); //added for odometerHistory.. Make a special filter in future
		else eventTime = new Date(value.time);


		if( (eventTime <= this.filterFields.end) && (eventTime >= this.filterFields.start)) {
			this.out.push(value);
		}
        }, items);

        return items.out;
    };
});
