rtpots_travel_reporter.factory('StatusService',[
    function(){

	/* Statuses can be GOOD BAD UNKNOWN */
	
	var statuses = {};

	var statusStyles = {
		'GOOD' : "greenBg",
		'BAD' : "redBg",
		'UNKNOWN' : "blueBg"
	};

	//type describes the bootstrap 'alert' class type to be used (either alert-success, alert-info, alert-warning, or alert-danger).
	function Status(systemName, statusEnum) {
		this.systemName = systemName; 
		this.statusEnum = statusEnum; 
		this.statusStyle = statusStyles[statusEnum];
        };

	//var addStatus = function(key, classType, strongText = "", text, isDisplayed, isDismissible){ // No ES6 in IE
	var addStatus = function(systemName, statusEnum){
		statuses[systemName] = (new Status(systemName, statusEnum));
	};

	//set statuses how we wants them on start-up (should probably do this in app.js instead.)
	//addStatus("not-safe", "alert-warning", "Warning!", "TLP", false, false);
	addStatus("Java", "UNKNOWN");
	addStatus("Database", "UNKNOWN");

        return {

		getStatuses: function(){
			return statuses;
		},

		createStatus: function(){
			addStatus.apply(null, arguments);
		}

        };
        
    }
]);
