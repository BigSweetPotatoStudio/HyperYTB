import dayjs from "dayjs";

/* eslint-disable */
function main() {
  // or using a global flag variable
  // const args = [1, true, ["bar", 5], { foo: "baz" }];
  // window.flutter_inappwebview.callHandler("scan", ...args);
  // window.flutter_inappwebview.callHandler("log", "WebView LOG:");
  // then, somewhere in your code
  window.ext = {
    invert: (name, args) => {
      return window.flutter_inappwebview.callHandler(name, ...args);
    },
  };
  console.log("injectedRN");
  if (window.injectedRN) {
    console.log("injectedRN return");
    return;
  }
  window.injectedRN = true;
  console.log = function () {
    // oldLog(...arguments);
    window.flutter_inappwebview.callHandler(
      "log",
      `WebView LOG ${dayjs().format("HH:mm:ss.SSS")}: ` +
        Array.from(arguments).join(" "),
    );
  };
  console.error = function () {
    // oldError(...arguments);
    window.flutter_inappwebview.callHandler(
      "log",
      "WebView ERROE: " + Array.from(arguments).join(" "),
    );
  };
}
let isFlutterInAppWebViewReady = false;

window.addEventListener("flutterInAppWebViewPlatformReady", function (event) {
  isFlutterInAppWebViewReady = true;
});
function isInit() {
  return isFlutterInAppWebViewReady;
}
if (window?.flutter_inappwebview?.callHandler == null) {
  isFlutterInAppWebViewReady = true;
} else {
  main();
}

export { isInit };
//   window.exposedFetch = async (url, options) => {
//     return new Promise((resolve, reject) => {
//       window.ReactNativeWebView.postMessage(
//         JSON.stringify({
//           type: 'FETCH',
//           url,
//           options,
//         }),
//       );

//       window.fetchResponseHandler = response => {
//         resolve(new Response(response));
//       };

//       window.fetchErrorHandler = error => {
//         reject(error);
//       };
//     });
//   };

//   // 替换原生 fetch
//   window.originalFetch = window.fetch;
// window.fetch = window.exposedFetch;
// console.log(window.fetch.toString());
// window.fetch("https://google.com").than(e=>console.log(e.text())
