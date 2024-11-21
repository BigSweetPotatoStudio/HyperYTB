import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";

import {
  Button,
  Table,
  Switch,
  Tooltip,
  Modal,
  message,
  Radio,
  Input,
  Tabs,
  ConfigProvider,
  Popconfirm,
  Popover,
  Dropdown,
  Space,
  MenuProps,
  Select,
  Spin,
  Progress,
} from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { getText } from "./pages/locale";

import {
  DownOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import { HeaderContext } from "./common/context";
import { sleep } from "./common/sleep";
import logo from "../public/logo.webp";

import dayjs from "dayjs";

import { Mobile } from "./pages/mobile";
import { call } from "./common/call";

let t = getText("default");

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Mobile />} />
          {/* <Route path="pc" element={<Home />} /> */}

          <Route path="/404" element={<NoMatch />} />
          <Route path="*" element={<Mobile />} />
        </Route>
      </Routes>
    </div>
  );
}

let currLang = localStorage.getItem("currLang") || "zhCN";

function Layout() {
  let [user, setUser] = useState({ permissions: [] } as any);
  let [isLoading, setIsLoading] = useState(true);
  let [percent, setPercent] = useState(0);
  useEffect(() => {
    (async () => {
      if (process.env.NODE_ENV === "development") {
      }
    })().catch((e) => {
      console.log(e);
    });
  }, []);

  const [locale, setLocal] = useState(currLang == "zhCN" ? zhCN : enUS);

  return (
    <ConfigProvider locale={locale}>
      <div style={{ width: "100%", margin: "0px auto" }}>
        <div style={{ marginTop: 0 }}>
          <HeaderContext.Provider value={{ user }}>
            <Outlet />
          </HeaderContext.Provider>
        </div>
      </div>
    </ConfigProvider>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
