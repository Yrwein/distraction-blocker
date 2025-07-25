
function loadSettings(onSettings) {
	const defaultSettings = {
		enabled: true,
		blockedUrls: ``
	};
	const settingsPromise = browser.storage.local.get("settings");
	settingsPromise.then(function (item) {
	  if (item.settings && item.settings[0]) { // firefox prior 52
	    onSettings(item.settings[0]);
	  } else if (item.settings) {
	    onSettings(item.settings);
	  } else {
	    onSettings(defaultSettings);
	  }
	}, function (error) {
	  console.log(`Error: ${error}`);
	  onSettings(defaultSettings);
	});
}
