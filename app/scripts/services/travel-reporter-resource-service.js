rtpots_travel_reporter.factory('TravelReporterResource',['$http', 'StatusService',
    function ($http, StatusService) {

	//maintain a record of latest seq_no for each unit so that we can make request since last
		//is this worth it? Is there really that much overhead in requesting entire dataset again compared to a small portion?
	var mostRecentReqs = {
		
	};

	var mostRecentErrReqs = {
		
	};

        return {

            getMostRecentPositions: function (successCallback){
                $http.get('/unit_travel/most_recent_positions')
			.then(function(resp){
					successCallback(resp.data)
					StatusService.createStatus("Java", "GOOD");
					StatusService.createStatus("Database", "GOOD");
				}, 
				function(errResp){
					console.log(errResp);
					//errResp.status === 502
					//502 when java is down -> Bad Gateway
					//errResp.status === 500
					//500 when database is down -> Internal Server Error
					if(errResp.status === 502)
					{
						StatusService.createStatus("Java", "BAD");
						StatusService.createStatus("Database", "UNKNOWN");
					} 
					else if (errResp.status === 500)
					{
						StatusService.createStatus("Java", "GOOD");
						StatusService.createStatus("Database", "BAD");
					}
				});
            },

	    getUpdatesForUnit: function(unit, successCallback, max){
		var url = '/unit_travel/unit_history/' + unit;

		//max is now a sequence

		if(max != mostRecentReqs[unit]) {
			$http.get(url, {params: {seqno_start: mostRecentReqs[unit], seqno_end: max}})
				.then(function(resp){
					successCallback(resp.data);

					if(resp.data.length > 0)
					{
						var newMax = resp.data.reduce((max, p) => p.sequence > max ? p.sequence : max, resp.data[0].sequence);
						mostRecentReqs[unit] = newMax;
					}

					StatusService.createStatus("Java", "GOOD");
					StatusService.createStatus("Database", "GOOD");
				}, 
				function(errResp){
					console.log(errResp);
					//errResp.status === 502
					//502 when java is down -> Bad Gateway
					//errResp.status === 500
					//500 when database is down -> Internal Server Error
					if(errResp.status === 502)
					{
						StatusService.createStatus("Java", "BAD");
						StatusService.createStatus("Database", "UNKNOWN");
					} 
					else if (errResp.status === 500)
					{
						StatusService.createStatus("Java", "GOOD");
						StatusService.createStatus("Database", "BAD");
					}
				});
		}
	    },

            getUpdatesForFaults: function (unit, successCallback, max){
		var url = '/unit_travel/errors/' + unit;

		if(max != mostRecentErrReqs[unit]) {
			$http.get(url, {params: {since: mostRecentErrReqs[unit], until: max}})
				.then(function(resp){
					successCallback(resp.data);

					if(resp.data.length > 0)
					{
						var max = resp.data.reduce((max, p) => p.second_event.time > max ? p.second_event.time : max, resp.data[0].second_event.time);
						mostRecentErrReqs[unit] = max;
					}

					StatusService.createStatus("Java", "GOOD");
					StatusService.createStatus("Database", "GOOD");
				}, 
				function(errResp){
					console.log(errResp);
					//errResp.status === 502
					//502 when java is down -> Bad Gateway
					//errResp.status === 500
					//500 when database is down -> Internal Server Error
					if(errResp.status === 502)
					{
						StatusService.createStatus("Java", "BAD");
						StatusService.createStatus("Database", "UNKNOWN");
					} 
					else if (errResp.status === 500)
					{
						StatusService.createStatus("Java", "GOOD");
						StatusService.createStatus("Database", "BAD");
					}
				});
		}

            },

	    adjustMostRecent: function(odometerObj, successCallback){
		$http.put('/unit_travel/most_recent_positions/' + odometerObj.unit, odometerObj)
			.then(function(resp){
				successCallback(resp.data);
				StatusService.createStatus("Java", "GOOD");
				StatusService.createStatus("Database", "GOOD");
			}, 
			function(errResp){
				console.log(errResp);
				if(errResp.status === 502)
				{
					StatusService.createStatus("Java", "BAD");
					StatusService.createStatus("Database", "UNKNOWN");
				} 
				else if (errResp.status === 500)
				{
					StatusService.createStatus("Java", "GOOD");
					StatusService.createStatus("Database", "BAD");
				}
			});
	    },

	    resetUpdatesForUnit: function(unit){
		delete mostRecentReqs[unit];
	    },

	    resetFaultUpdatesForUnit: function(unit){
		delete mostRecentErrReqs[unit];
	    }
	}
    }
]);
