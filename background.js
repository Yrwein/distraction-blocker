
function cancel(requestDetails) {
  console.log("Blocking: " + requestDetails.url);
  return { cancel: true };
}

var blockedUrls = [
  "*://*.facebook.com/*"
];


browser.webRequest.onBeforeRequest.addListener(cancel, { urls: blockedUrls }, [ "blocking" ]);
