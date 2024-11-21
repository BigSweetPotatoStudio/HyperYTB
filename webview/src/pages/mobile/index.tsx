import React, {
  useState,
  useEffect,
  version,
  useCallback,
  useContext,
  useRef,
} from "react";
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
  Progress,
  Card,
  Flex,
  Tag,
  Space,
  Form,
  InputNumber,
  List,
  Select,
  Checkbox,
} from "antd";
import { call } from "../../common/call";
import client, { Socket } from "socket.io-client";
import SimplePeer from "simple-peer";
import {
  Mic,
  Speaker,
  Settings,
  HelpCircle,
  AlertCircle,
  Wifi,
} from "lucide-react";
import { data } from "../../common/data";
import { sleep } from "../../common/sleep";
import { LoadingOutlined } from "@ant-design/icons";
import * as echarts from "echarts";

export function Mobile() {
  const [num, setNum] = useState(0);
  function refresh() {
    setNum((num) => num + 1);
  }

  useEffect(() => {
    (async () => {
      console.log(data.get());
      if (data.get().isAutoLauncher) {
        await sleep(300);
        await call("startYoutube");
      }
    })();
  }, []);

  return (
    <div className="pl-4 pr-4">
      <Tabs
        tabPosition="top"
        defaultActiveKey="1"
        animated={{ inkBar: true, tabPane: true }}
        items={[
          {
            key: "1",
            label: `开始使用`,
            children: (
              <div
                className="fixed"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                <Form
                  layout="horizontal"
                  name="sssss"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={data.get()}
                  autoComplete="off"
                >
                  <Form.Item label="后台播放" name="backPlay">
                    <Switch
                      onChange={(e) => {
                        data.get().backPlay = e;
                        data.save();
                      }}
                    ></Switch>
                  </Form.Item>
                  <Form.Item label="跳过广告" name="skipAD">
                    <Switch
                      onChange={(e) => {
                        data.get().skipAD = e;
                        data.save();
                      }}
                    ></Switch>
                  </Form.Item>
                  <Form.Item
                    label="下次自动打开YouTube"
                    name="isAutoLauncher"
                    valuePropName="checked"
                  >
                    <Checkbox
                      onChange={(e) => {
                        data.get().isAutoLauncher = e.target.checked;
                        data.save();
                      }}
                    ></Checkbox>
                  </Form.Item>
                </Form>
                <Button
                  type="primary"
                  onClick={async () => {
                    await sleep(300);
                    call("startYoutube");
                  }}
                >
                  打开YouTube
                </Button>

                <div className="mt-4 text-red-500">本软件仅供学习使用。</div>
              </div>
            ),
          },
          {
            key: "2",
            label: `更多`,
            children: (
              <div>
                <div>
                  <div>
                    {/* <Form
                      layout="vertical"
                      name="basicSitting"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      initialValues={{}}
                      autoComplete="off"
                    >
                      <Form.Item label="教程" name="safas">
                        <a href="https://www.dadigua.men/blog?path=%F0%9F%8C%90markdown%E9%A1%B5%E9%9D%A2/%E5%A3%B0%E6%A1%A5AudioBridge.md">
                          查看教程
                        </a>
                      </Form.Item>
                    </Form> */}
                    <div className="text-red-500">
                      本软件是免费软件，欢迎大家关注我，我将带来跟多的工具类软件。
                    </div>
                    <Form
                      layout="vertical"
                      name="sdfasdfadfz"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      initialValues={{
                        // port: data.get().port,
                        isAutoLauncher: data.get().isAutoLauncher,
                      }}
                      autoComplete="off"
                    >
                      <Form.Item label="作者邮箱">
                        <a href="mailto:develop@dadigua.men">
                          develop@dadigua.men
                        </a>
                      </Form.Item>
                      <Form.Item label="小红书">
                        <a
                          target="_blank"
                          href="https://www.xiaohongshu.com/user/profile/5f0dc4fc0000000001005234"
                        >
                          大地瓜的小红书
                        </a>
                      </Form.Item>
                      <Form.Item label="X(Twitter)">
                        <a target="_blank" href="https://x.com/ddg85479319">
                          大地瓜的Twitter
                        </a>
                      </Form.Item>
                      <Form.Item label="Bilibili">
                        <a
                          target="_blank"
                          href="https://space.bilibili.com/96150707"
                        >
                          大地瓜的Bilibili
                        </a>
                      </Form.Item>

                      <Form.Item label="Telegram">
                        <a target="_blank" href="https://t.me/dadigua001">
                          https://t.me/dadigua001
                        </a>
                      </Form.Item>
                      <Form.Item label="QQ群">759977131</Form.Item>
                    </Form>
                  </div>
                </div>
                {process.env.myEnv != "prod" && (
                  <a
                    onClick={() => {
                      location.href = "http://192.168.10.148:8080";
                    }}
                  >
                    test
                  </a>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
