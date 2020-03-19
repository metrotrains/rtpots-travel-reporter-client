rtpots_travel_reporter.controller('TravelReporterCtrl', ['$scope', '$timeout', '$interval', 'TravelReporterResource', 'UtilsService', 'DTOptionsBuilder',
    function TravelReporterCtrl($scope, $timeout, $interval, TravelReporterResource, UtilsService, DTOptionsBuilder) {

	$scope.distinctUnits = [];
	$scope.utils = UtilsService;

	$scope.datepickers = {
		start: null,
		end: null
	}

	$scope.dtInstances = {};

	$scope.mostRecentDTInstanceCallback = function(dtInstance){
		$scope.dtInstances['mostRecent'] = dtInstance;
	};

	$scope.unitHistoryDTInstanceCallback = function(dtInstance){
		$scope.dtInstances['unitHistory'] = dtInstance;
	};

	$scope.faultsDTInstanceCallback = function(dtInstance){
		$scope.dtInstances['faults'] = dtInstance;
	};

	$scope.mostRecent = {
		data: [],
		display: true,
		select: [],
		lastRender: $timeout(function(){
			
		})
	};

	$scope.unitHistory = {
		data: [],
		display: true,
		select: [],
		lastRender: $timeout(function(){
			
		})
	};

	$scope.faults = {
		data: [],
		display: true,
		select: [],
		lastRender: $timeout(function(){
			
		})
	};

	$scope.dtOptions = DTOptionsBuilder.newOptions()
		.withOption('order', [[1, 'desc']])
		.withOption('retrieve', true)
		.withOption('stateSave', true);

	$scope.$watchGroup(['datepickers.start', 'datepickers.end', 'mostRecent.select'], function(newVals, oldVals){
		//due to a bug in ng-datatable affecting pagination following angularjs filtering, 
			//it's necessary to rerender tables after a filter has been applied

		if(newVals !== oldVals) {
			$scope.mostRecent.display = false;
			$scope.unitHistory.display = false;
			$scope.faults.display = false;

                        rerenderTables();

			$timeout(function(){
				//hide pagination bug until rerender is complete
				$scope.mostRecent.display = true;
				$scope.unitHistory.display = true;
				$scope.faults.display = true;
			});
		} 
	});

	$scope.$watch('unitHistory.select', function(newVal, oldVal){
		if(newVal.length >= oldVal.length) {
			var difference = newVal.filter(unit => !oldVal.includes(unit));
			difference.forEach(unit => fetchUpdatesForUnit(unit));
		}
		else if (oldVal.length > newVal.length) {
			var difference = oldVal.filter(unit => !newVal.includes(unit));
			TravelReporterResource.resetUpdatesForUnit(difference[0]);
			$scope.unitHistory.data = $scope.unitHistory.data.filter(function(unit){
				return (difference.indexOf(unit.unit) == -1);
			});
		} 
		else {
			//what do we have here?
		}
	});

	$scope.$watch('faults.select', function(newVal, oldVal){
		if(newVal.length >= oldVal.length) {
			var difference = newVal.filter(unit => !oldVal.includes(unit));
			difference.forEach(unit => fetchUpdatesForUnitFaults(unit));
		}
		else if (oldVal.length > newVal.length) {
			var difference = oldVal.filter(unit => !newVal.includes(unit));
			TravelReporterResource.resetFaultUpdatesForUnit(difference[0]);
			$scope.faults.data = $scope.faults.data.filter(function(fault){
				return (difference.indexOf(fault.first_event.unit) == -1);
			});
		} 
		else {
			//what do we have here?
		}
	});

	$scope.submitOdometerReading = function(reading){
		//reading.time_of_read = $scope.utils.convertDatetimeToUnix(reading.time_of_read);
		console.log(reading);
		TravelReporterResource.adjustMostRecent(reading, function(newRow){
			//$scope.odometer.data.push(newRow);
			fetchUpdatesForMostRecent(function(){
				fetchUpdatesForUnits();
			});
		});
	};

	var extractUnits = function(){
		$scope.distinctUnits = $scope.mostRecent.data.map((val) => {
			return val.unit;
		});

		//order units numerically
		$scope.distinctUnits.sort(function(a, b){
			var aIndexOfM = a.indexOf('M');
			var bIndexOfM = b.indexOf('M');

			if(aIndexOfM == -1 && bIndexOfM != -1)
			{
				return 0;
			}

			if((aIndexOfM != -1 && bIndexOfM == -1) || (aIndexOfM == -1 && bIndexOfM == -1))
			{
				return 1;
			}

			var aFirstMotorNum = a.substr(0, aIndexOfM);
			var bFirstMotorNum = b.substr(0, bIndexOfM);

			return aFirstMotorNum - bFirstMotorNum;
		});
	};

	var rerenderTables = function(){
		for(var key in $scope.dtInstances)
                {
			rerenderTable(key);
                }
	};

	var rerenderTable = function(key){
		var instance = $scope.dtInstances[key];
		try{
			//if timeout hasn't fired, cancel and prolong another 500ms?
			$timeout.cancel($scope[key].lastRender);
			$scope[key].lastRender = $timeout(function(){
				if(typeof instance.rerender === "function") instance.rerender();
			});
		} 
		catch (e) {
			console.log(e);
		}
	};

	var fetchUpdatesForMostRecent = function(callback){
		TravelReporterResource.getMostRecentPositions(function(responseData){
			if(angular.toJson($scope.mostRecent.data) != angular.toJson(responseData))
			{
				$scope.mostRecent.data = responseData;
				rerenderTable('mostRecent');

				if(typeof callback === "function")
					callback();

			} else {
				//console.log("Not updating, data is the same");
			}
		});
	};

	var fetchUpdatesForUnits = function(){
		$scope.unitHistory.select.forEach(selectedUnit => fetchUpdatesForUnit(selectedUnit));
	};

	var fetchUpdatesForFaults = function(){
		$scope.faults.select.forEach(fault => fetchUpdatesForUnitFaults(fault));
	};

	var fetchUpdatesForUnit = function(unit){
		var latestEventForUnit = $scope.mostRecent.data.filter(function(newEvent){
                        return unit == newEvent.unit;
                });

                TravelReporterResource.getUpdatesForUnit(unit, function success(responseData){
                        responseData.forEach(position => $scope.unitHistory.data.push(position));
			rerenderTable('unitHistory');
                }, latestEventForUnit[0].sequence);
	};

	var fetchUpdatesForUnitFaults = function(unit){
		var latestEventForUnit = $scope.mostRecent.data.filter(function(newEvent){
                        return unit == newEvent.unit;
                });

                TravelReporterResource.getUpdatesForFaults(unit, function success(responseData){
                        responseData.forEach(position => $scope.faults.data.push(position));
			rerenderTable('faults');
                }, latestEventForUnit[0].time);
	};

	var init = function(){
		fetchUpdatesForMostRecent(function(){
			extractUnits();
		});
	};

	init();

	$interval(function(){
		fetchUpdatesForMostRecent();
		fetchUpdatesForUnits();
		fetchUpdatesForFaults();
	}, 30000);

    }
]);
