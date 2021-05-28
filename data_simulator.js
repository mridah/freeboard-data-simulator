// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ freeboard-data-simulator                                           │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ https://github.com/mridah/freeboard-data-simulator                 │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Freeboard data source plugin.                                      │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function()
{
    freeboard.loadDatasourcePlugin({
      "type_name": "data_simulator",
      "display_name": "Data Simulator",
      "description": "This a data simulator build for demo purposes",
      "settings": [
        {
          "name": "start_val",
          "display_name": "Start Value",
          "type": "number",
          "description": "Minimum value simulator should return",
          "required": true,
          "default_value": 0
        },
        {
          "name": "end_val",
          "display_name": "End Value",
          "type": "number",
          "description": "Maximum value simulator should return",
          "required": true,
          "default_value": 100
        },
        {
          "name": "integer_only",
          "display_name": "Integer only?",
          "type": "boolean",
          "description": "",
          "default_value": false
        },
        {
          "name": "incremental",
          "display_name": "Increment values?",
          "type": "boolean",
          "description": "If enabled, the values would keep incrementing one by one till it reaches the max limit",
          "default_value": false
        },
        {
          "name": "incremental_val",
          "display_name": "Incremental Value",
          "type": "number",
          "description": "Value to increment if increment values is enabled",
          "required": true,
          "default_value": 1
        },
        {
          "name": "refresh_interval",
          "display_name": "Refresh interval",
          "type": "number",
          "description": "Refresh interval in seconds",
          "required": true,
          "default_value": 5
        }
      ],

      newInstance: function(settings, newInstanceCallback, updateCallback) {
        newInstanceCallback(new dataSimulatorPlugin(settings, updateCallback));
      }
    });


    var dataSimulatorPlugin = function(settings, updateCallback)
    {
        var self = this;
        var currentSettings = settings;
        var lastVal = -9999;

        function randomIntFromInterval(min, max) { // min and max included
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        function randomFloatFromInterval(min, max) { // min and max included
            return parseFloat((Math.random() * (min - max) + max).toFixed(2));
        }

		function getData()
		{
            var newData;

            if(currentSettings.incremental) {
                if(lastVal == -9999) {
                    newData = currentSettings.start_val;
                }
                else {
                    newData = lastVal+currentSettings.incremental_val;
                    if(newData > currentSettings.end_val)
                        newData = currentSettings.start_val;
                }
                lastVal = newData;
            }
            else {
                if(currentSettings.integer_only) {
                    newData = randomIntFromInterval(currentSettings.start_val, currentSettings.end_val);
                }
                else {
                    newData = randomFloatFromInterval(currentSettings.start_val, currentSettings.end_val);
                }
            }

            noLastVal = false;
            updateCallback(newData);
		}

        var refreshTimer;

        function createRefreshTimer(interval)
		{
            interval = interval * 1000;

			if(refreshTimer)
			{
				clearInterval(refreshTimer);
			}

			refreshTimer = setInterval(function()
			{
                getData();
			}, interval);
		}

        self.onSettingsChanged = function(newSettings)
		{
            currentSettings = newSettings;
		}

        self.updateNow = function()
		{
            getData();
		}

        self.onDispose = function()
		{

            clearInterval(refreshTimer);
			refreshTimer = undefined;
		}

        createRefreshTimer(currentSettings.refresh_interval);
	}

}());
