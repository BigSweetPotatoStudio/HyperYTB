import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'dart:collection';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import 'package:url_launcher/url_launcher.dart';
import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:awesome_notifications/android_foreground_service.dart';
import 'package:auto_orientation/auto_orientation.dart';
import 'package:flutter/services.dart' show rootBundle;

const isDev = kDebugMode;
const notificationId = 10;

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class Injects {
  String ad = "";
  String backgroundplay = "";
  String vconsole = "";
  String userscript = "";
  Injects(
      {this.ad = "",
      this.backgroundplay = "",
      this.vconsole = "",
      this.userscript = ""});
}

class _MyAppState extends State<MyApp> {
  InAppWebViewController? webViewController;
  // String contents = "";
  Injects injects = Injects();
  bool isLoading = true;
  bool skipAD = false;
  bool backPlay = false;
  Future<void> loadAsset() async {
    // String userscript = await rootBundle
    //     .loadString('assets/inject/userscript.js', cache: false);
    // debugPrint("userscript: $userscript");
    var directory = await getApplicationDocumentsDirectory();
    File file = File('${directory.path}/data.json');

    if (await file.exists()) {
      var str = await file.readAsString();
      debugPrint("settingJSON: $str");
      injects = Injects(
          userscript: await rootBundle.loadString('assets/inject/userscript.js',
              cache: false),
          ad: await rootBundle.loadString('assets/inject/ad.js', cache: false),
          backgroundplay: await rootBundle
              .loadString('assets/inject/backgroundplay.js', cache: false),
          vconsole: await rootBundle.loadString('assets/inject/vconsole.js',
              cache: false));

      var json = jsonDecode(str);
      setState(() {
        isLoading = false;
        skipAD = json["skipAD"];
        backPlay = json["backPlay"];
      });
    }
  }

  @override
  void initState() {
    debugPrint("kIsWeb: $kIsWeb isDev: $isDev");
    loadAsset();
    AwesomeNotifications().initialize(
        // 将图标设置为 null 以使用默认应用图标
        null,
        [
          NotificationChannel(
              channelGroupKey: 'basic_channel_group',
              channelKey: 'basic_channel',
              channelName: 'Basic notifications',
              channelDescription: 'Notification channel for basic tests',
              defaultColor: const Color(0xFF9D50DD),
              ledColor: Colors.white),
        ],
        // Channel groups are only visual and are not required
        channelGroups: [
          NotificationChannelGroup(
              channelGroupKey: 'basic_channel_group',
              channelGroupName: 'Basic group')
        ],
        debug: true);

    AwesomeNotifications().isNotificationAllowed().then((isAllowed) {
      if (!isAllowed) {
        // This is just a basic example. For real apps, you must show some
        // friendly dialog box before call the request method.
        // This is very important to not harm the user experience
        AwesomeNotifications().requestPermissionToSendNotifications();
      }
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {});

    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      // 加载中显示的组件
      return const CircularProgressIndicator();
    }
    // debugPrint("isLoading  $isLoading , backPlay: $backPlay");
    return WillPopScope(
        onWillPop: () async {
          if (webViewController != null) {
            bool canGoBack = await webViewController!.canGoBack();
            if (canGoBack) {
              webViewController!.goBack();
              return false;
            }
          }
          return true;
        },
        child: Scaffold(
          appBar: PreferredSize(
            preferredSize: const Size.fromHeight(0.0), // 设置高度为0
            child: AppBar(
                // 其他 AppBar 属性
                ),
          ),
          body: Column(children: <Widget>[
            Expanded(
              child: InAppWebView(
                initialUserScripts: UnmodifiableListView<UserScript>([
                  UserScript(
                      source: "console.log('start userscript');",
                      injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START),
                  // UserScript(
                  //     source: injects.vconsole,
                  //     injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START),
                  UserScript(
                      source: backPlay
                          ? injects.backgroundplay
                          : "console.log('backPlay false');",
                      injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START),
                  UserScript(
                      source:
                          skipAD ? injects.ad : "console.log('skipAD false');",
                      injectionTime: UserScriptInjectionTime.AT_DOCUMENT_END),
                ]),
                onWebViewCreated: (controller) {
                  webViewController = controller;
                },
                initialSettings: InAppWebViewSettings(
                    mediaPlaybackRequiresUserGesture: false,
                    allowBackgroundAudioPlaying: backPlay,
                    allowsInlineMediaPlayback: true,
                    // isInspectable: kDebugMode,
                    userAgent: Platform.isAndroid
                        ? 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
                        : 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
                    contentBlockers: []),
                initialUrlRequest:
                    URLRequest(url: WebUri("https://m.youtube.com/")),
                onLoadStart: (controller, url) {
                  debugPrint('onLoadStart: $url');

                  controller.addJavaScriptHandler(
                      handlerName: 'log',
                      callback: (args) {
                        // print arguments coming from the JavaScript side!
                        debugPrint("log $args");
                        // return data to the JavaScript side
                      });
                  controller.addJavaScriptHandler(
                      handlerName: 'getUserDataPath',
                      callback: (args) async {
                        var directory =
                            await getApplicationDocumentsDirectory();
                        return directory.path;
                      });
                  controller.addJavaScriptHandler(
                      handlerName: 'readFile',
                      callback: (args) async {
                        // print("readFile $args");
                        String fileName = args[0];
                        var directory =
                            await getApplicationDocumentsDirectory();
                        File file = File('${directory.path}/$fileName');
                        if (await file.exists()) {
                          return await file.readAsString();
                        } else {
                          return '';
                        }
                      });
                  controller.addJavaScriptHandler(
                      handlerName: 'writeFile',
                      callback: (args) async {
                        String fileName = args[0];
                        String content = args[1];
                        var directory =
                            await getApplicationDocumentsDirectory();
                        File file = File('${directory.path}/$fileName');
                        await file.writeAsString(content);
                      });
                  controller.addJavaScriptHandler(
                      handlerName: 'readDir',
                      callback: (args) async {
                        var directory =
                            await getApplicationDocumentsDirectory();
                        List<FileSystemEntity> files = directory.listSync();
                        List<String> fileNames =
                            files.map((file) => file.path).toList();
                        return fileNames;
                      });
                  controller.addJavaScriptHandler(
                      handlerName: 'createMediaNotification',
                      callback: (args) async {
                        if (Platform.isAndroid) {
                          await AndroidForegroundService
                              .startAndroidForegroundService(
                            foregroundStartMode: ForegroundStartMode.stick,
                            foregroundServiceType:
                                ForegroundServiceType.mediaPlayback,
                            content: NotificationContent(
                                id: notificationId,
                                actionType: ActionType.Default,
                                title: 'HyperYoutube playing!',
                                channelKey: 'basic_channel',
                                locked: true,
                                autoDismissible: false,
                                notificationLayout:
                                    NotificationLayout.MediaPlayer,
                                category: NotificationCategory.Service),
                          );
                        } else {
                          await AwesomeNotifications().createNotification(
                              content: NotificationContent(
                                  id: notificationId,
                                  channelKey: 'basic_channel',
                                  actionType: ActionType.Default,
                                  title: 'HyperYoutube playing!',
                                  locked: true,
                                  autoDismissible: false,
                                  notificationLayout:
                                      NotificationLayout.MediaPlayer));
                        }
                      });
                  controller.addJavaScriptHandler(
                      handlerName: 'closeMediaNotification',
                      callback: (args) async {
                        if (Platform.isAndroid) {
                          AndroidForegroundService.stopForeground(
                              notificationId);
                        } else {
                          AwesomeNotifications().dismiss(notificationId);
                        }
                      });
                },
                shouldOverrideUrlLoading: (controller, navigationAction) async {
                  var uri = navigationAction.request.url;
                  var scheme = uri?.scheme;
                  debugPrint('shouldOverrideUrlLoading: $uri $scheme');
                  if (uri != null &&
                      (uri.scheme == "mailto" || uri.scheme == "intent")) {
                    // debugPrint('Launched test');
                    if (await canLaunchUrl(uri)) {
                      await launchUrl(uri);
                    } else {
                      debugPrint('Could not launch');
                    }
                    return NavigationActionPolicy.CANCEL;
                  }
                  return NavigationActionPolicy.ALLOW;
                },
                onEnterFullscreen: (controller) {
                  debugPrint('onEnterFullscreen');
                  AutoOrientation.landscapeAutoMode();
                },
                onExitFullscreen: (controller) {
                  debugPrint('onExitFullscreen');
                  AutoOrientation.portraitAutoMode();
                },
                onLoadStop: (controller, url) async {
                  debugPrint('onLoadStop: $url');

                  //     controller.evaluateJavascript(source: '''
                  //   var __f__ = 0;
                  //   function addMediaEventListeners() {
                  //     const mediaElements = document.querySelectorAll('video, audio');
                  //     mediaElements.forEach(media => {
                  //       if(media.paused || media.ended){
                  //         if(__f__==1){
                  //           __f__ = 0;
                  //           window.flutter_inappwebview.callHandler('log', 'closeMediaNotification', __f__);
                  //           window.flutter_inappwebview.callHandler('closeMediaNotification');
                  //         }
                  //       } else {
                  //         if(__f__==0){
                  //           __f__ = 1;
                  //           window.flutter_inappwebview.callHandler('log', 'createMediaNotification', __f__);
                  //           window.flutter_inappwebview.callHandler('createMediaNotification');
                  //         }
                  //       }
                  //     });
                  //   }

                  //   // 调用函数以添加事件监听器
                  //   setInterval(() => {
                  //     addMediaEventListeners();
                  //   }, 1000);
                  //   addMediaEventListeners();
                  // ''');

                  // var result = await controller.evaluateJavascript(
                  //     source:
                  //         "setTimeout(() => {window.href='http://localhost:18191/index.html';}, 10000); 123123");

                  // debugPrint(result.toString()); // 2
                },
              ),
            )
          ]),
          // floatingActionButton: favoriteButton(),
        ));
  }
}
