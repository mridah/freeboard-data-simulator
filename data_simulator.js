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
          "required": false,
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
          "description": "If enabled, the values would keep incrementing by the incremental factor till it reaches the max limit",
          "default_value": false
        },
        {
          "name": "incremental_val",
          "display_name": "Incremental Factor",
          "type": "number",
          "description": "Value to increment if increment values is enabled",
          "required": true,
          "default_value": 1
        },
        {
          "name": "decimal_places",
          "display_name": "Decimal places",
          "type": "number",
          "description": "Decimal places if Integer only is set to false",
          "required": false,
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
            return Math.random() * (min - max) + max;
        }

		function getData()
		{
            var newData, decimalHelper;
            decimalHelper = Math.pow(10,currentSettings.decimal_places);

            if(currentSettings.incremental) {
                if(lastVal == -9999) {
                    newData = currentSettings.start_val;
                }
                else {
                    newData = lastVal+currentSettings.incremental_val;
                    if(newData > currentSettings.end_val)
                        newData = currentSettings.start_val;
                }

                newData = Math.round(newData * decimalHelper)/decimalHelper;
                lastVal = newData;
            }
            else {
                if(currentSettings.integer_only) {
                    newData = randomIntFromInterval(currentSettings.start_val, currentSettings.end_val);
                }
                else {
                    newData = randomFloatFromInterval(currentSettings.start_val, currentSettings.end_val);
                    newData = Math.round(newData * decimalHelper)/decimalHelper;
                }
            }

            updateCallback(newData);
		}

        var refreshTimer;

        currentSettings.start_val = currentSettings.start_val ? currentSettings.start_val : 0;
        currentSettings.decimal_places = currentSettings.decimal_places ? currentSettings.decimal_places : 0;

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
            newSettings.start_val = newSettings.start_val ? newSettings.start_val : 0;
            newSettings.decimal_places = newSettings.decimal_places ? newSettings.decimal_places : 0;
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
