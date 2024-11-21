console.log("process.env.myEnv", process.env.myEnv);

// import VConsole from "vconsole";
// if (process.env.myEnv != "prod") {
//   const vConsole = new VConsole();
// }

import { isInit } from "./injectedRN";
await new Promise((resolve) => {
  let t = window.setInterval(() => {
    if (isInit()) {
      clearInterval(t);
      resolve(0);
    }
  }, 50);
});
import React from "react";
import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom";
import App from "./App";
import { call } from "./common/call";
import "./tailwind.css";
import { ConfigProvider } from "antd";
import { StyleProvider, px2remTransformer } from "@ant-design/cssinjs";
import Clarity from "@microsoft/clarity";
import p from "../package.json";

Clarity.init("ozan8dgqkr");
Clarity.consent();

Clarity.event("openApp");
Clarity.event(`openApp-${process.env.NODE_ENV}-${p.version}`);
Clarity.setTag("version", p.version);
Clarity.setTag("env", process.env.NODE_ENV);

console.log("start");
const px2rem = px2remTransformer({
  rootValue: 16, // 32px = 1rem; @default 16
});

if (document.getElementById("root")) {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    // <React.StrictMode>
    <ConfigProvider>
      <StyleProvider transformers={[px2rem]} layer>
        <HashRouter>
          <App />
        </HashRouter>
      </StyleProvider>
    </ConfigProvider>,
    // </React.StrictMode>
  );
}

// setTimeout(() => {
//   console.log("call");
// }, 5000);
