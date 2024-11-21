// ==UserScript==
// @name         youtube-adb
// @name:zh-CN   YouTube去广告
// @name:zh-TW   YouTube去廣告
// @name:zh-HK   YouTube去廣告
// @name:zh-MO   YouTube去廣告
// @namespace    https://github.com/iamfugui/youtube-adb
// @version      6.20
// @description         A script to remove YouTube ads, including static ads and video ads, without interfering with the network and ensuring safety.
// @description:zh-CN   脚本用于移除YouTube广告，包括静态广告和视频广告。不会干扰网络，安全。
// @description:zh-TW   腳本用於移除 YouTube 廣告，包括靜態廣告和視頻廣告。不會干擾網路，安全。
// @description:zh-HK   腳本用於移除 YouTube 廣告，包括靜態廣告和視頻廣告。不會干擾網路，安全。
// @description:zh-MO   腳本用於移除 YouTube 廣告，包括靜態廣告和視頻廣告。不會干擾網路，安全。
// @match        *://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459541/YouTube%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/459541/YouTube%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
console.log(`YouTube去`);
(function () {
  `use strict`;

  //界面广告选择器
  window.dev = true; //开发使用

  /**
   * 将标准时间格式化
   * @param {Date} time 标准时间
   * @param {String} format 格式
   * @return {String}
   */
  function moment(time) {
    // 获取年⽉⽇时分秒
    let y = time.getFullYear();
    let m = (time.getMonth() + 1).toString().padStart(2, `0`);
    let d = time.getDate().toString().padStart(2, `0`);
    let h = time.getHours().toString().padStart(2, `0`);
    let min = time.getMinutes().toString().padStart(2, `0`);
    let s = time.getSeconds().toString().padStart(2, `0`);
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  }

  /**
   * 输出信息
   * @param {String} msg 信息
   * @return {undefined}
   */
  function log(...args) {
    if (!window.dev) {
      return false;
    }
    console.log(window.location.href);
    console.log(`${moment(new Date())}`, ...args);
  }

  setInterval(() => {
    var skip = document.querySelector(`.ytp-ad-player-overlay`);
    var video = document.querySelector(`video`);
    if (skip && video) {
      log(skip, video.currentTime, video.duration);
      if (isFinite(video.duration) && video.currentTime != video.duration) {
        log("跳过广告");
        video.currentTime = video.duration;
        video.muted = true;
        return;
      } else {
        console.error("video.duration 不是一个有限的数值, 或者一样");
      }
    }
    if (window.location.pathname.startsWith("/watch")) {
      var mainvidieo = document.querySelector(
        ".html5-main-video",
      ) as HTMLVideoElement;
      if (mainvidieo && mainvidieo.muted) {
        log("静音关闭");
        mainvidieo.muted = !mainvidieo.muted;
      }
    }
  }, 1000);
})();
