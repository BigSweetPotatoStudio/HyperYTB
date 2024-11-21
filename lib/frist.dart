import 'dart:io';

import 'package:audio_bridge/ytb.dart';
import 'package:flutter/foundation.dart';
import 'dart:collection';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:path_provider/path_provider.dart';
import 'package:url_launcher/url_launcher.dart';

class FirstRoute extends StatefulWidget {
  const FirstRoute({super.key});

  @override
  _FirstRouteState createState() => _FirstRouteState();
}

class _FirstRouteState extends State<FirstRoute>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool isLoading = true;
  Injects injects = Injects();
  @override
  void initState() {
    super.initState();
    loadAsset();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
      lowerBound: 0.0,
      upperBound: 0.1,
    )..addListener(() {
        setState(() {});
      });
    _animation = Tween<double>(begin: 1.0, end: 0.9).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> loadAsset() async {
    injects = Injects(
        userscript: await rootBundle.loadString('assets/inject/userscript.js',
            cache: false),
        ad: await rootBundle.loadString('assets/inject/ad.js', cache: false),
        backgroundplay: await rootBundle
            .loadString('assets/inject/backgroundplay.js', cache: false),
        vconsole: await rootBundle.loadString('assets/inject/vconsole.js',
            cache: false));
    // debugPrint(injects.userscript);

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      // 加载中显示的组件
      return const CircularProgressIndicator();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('HyperYTB'),
      ),
      body: Container(
        child: Column(children: <Widget>[
          Expanded(
              child: InAppWebView(
            initialUserScripts: UnmodifiableListView<UserScript>([
              UserScript(
                  source: "console.log('start userscript');",
                  injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START),
              UserScript(
                  source: injects.vconsole,
                  injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START),
              UserScript(
                  source: "console.log('end userscript');",
                  injectionTime: UserScriptInjectionTime.AT_DOCUMENT_END),
            ]),
            initialSettings: InAppWebViewSettings(
              mediaPlaybackRequiresUserGesture: false,
              allowBackgroundAudioPlaying: true,
              allowsInlineMediaPlayback: true,
              isInspectable: kDebugMode,
            ),
            initialUrlRequest: URLRequest(
                url: isDev
                    ? WebUri("http://localhost:18192/webview/index.html")
                    : WebUri("http://localhost:18192/webview/index.html")),
            onWebViewCreated: (controller) {},
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
                    var directory = await getApplicationDocumentsDirectory();
                    return directory.path;
                  });
              controller.addJavaScriptHandler(
                  handlerName: 'readFile',
                  callback: (args) async {
                    // print("readFile $args");
                    String fileName = args[0];
                    var directory = await getApplicationDocumentsDirectory();
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
                    var directory = await getApplicationDocumentsDirectory();
                    File file = File('${directory.path}/$fileName');
                    await file.writeAsString(content);
                  });
              controller.addJavaScriptHandler(
                  handlerName: 'readDir',
                  callback: (args) async {
                    var directory = await getApplicationDocumentsDirectory();
                    List<FileSystemEntity> files = directory.listSync();
                    List<String> fileNames =
                        files.map((file) => file.path).toList();
                    return fileNames;
                  });
              controller.addJavaScriptHandler(
                  handlerName: 'startYoutube',
                  callback: (args) async {
                    debugPrint("startYoutube $args");
                    _controller.forward().then((_) {
                      _controller.reverse();
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const MyApp()),
                      );
                    });
                  });
            },
            shouldOverrideUrlLoading: (controller, navigationAction) async {
              var uri = navigationAction.request.url;
              // var scheme = uri?.scheme;
              // debugPrint('shouldOverrideUrlLoading: $uri $scheme');

              // if (uri != null && uri.scheme == "mailto") {
              //   // debugPrint('Launched test');
              //   if (await canLaunchUrl(uri)) {
              //     await launchUrl(uri);
              //   }
              //   return NavigationActionPolicy.CANCEL;
              // }
              if (uri != null &&
                  uri.toString().startsWith("http://localhost")) {
                return NavigationActionPolicy.ALLOW;
              }
              if (uri != null) {
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri);
                }
                return NavigationActionPolicy.CANCEL;
              }
              // return NavigationActionPolicy.ALLOW;
              return NavigationActionPolicy.CANCEL;
            },
            onLoadStop: (controller, url) async {
              debugPrint('onLoadStop: $url');

              // var result = await controller.evaluateJavascript(
              //     source:
              //         "setTimeout(() => {window.href='http://localhost:18191/index.html';}, 10000); 123123");

              // debugPrint(result.toString()); // 2
            },
          ))
        ]),
      ),
    );
  }
}
