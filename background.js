
function cancelRequest(requestDetails) {
  console.log("Blocking: " + requestDetails.url);
  return { cancel: true };
}

function refreshBlocker(enabled, blockedUrls) {
  // set correct browser action icon
  browser.browserAction.setIcon({ path: enabled ? "icons/browser-action-enabled.png" : "icons/browser-action-disabled.png" });

  // refresh listener
  browser.webRequest.onBeforeRequest.removeListener(cancelRequest);
  if (enabled && blockedUrls.length) {
    browser.webRequest.onBeforeRequest.addListener(cancelRequest, { urls: blockedUrls }, [ "blocking" ]);
  }
}

function initialize(settings) {
  refreshBlocker(settings.enabled, settings.blockedUrls);

  browser.browserAction.onClicked.addListener(function () {
    settings.enabled = ! settings.enabled;
    browser.storage.local.set({ settings : settings });
  });

  browser.storage.onChanged.addListener(function (changes) {
    settings = changes.settings.newValue;
    refreshBlocker(settings.enabled, settings.blockedUrls);
  });
}

var defaultSettings = {
  enabled: true,
  blockedUrls: [
    "*://*.facebook.com/*"
  ]
}
var settingsPromise = browser.storage.local.get("settings");
settingsPromise.then(function (item) {
  if (item.settings && item.settings[0]) { // firefox prior 52
    initialize(item.settings[0]);
  } else if (item.settings) {
    initialize(item.settings);
  } else {
    initialize(defaultSettings);
  }
}, function (error) {
  console.log(`Error: ${error}`);
  initialize(defaultSettings);
});
