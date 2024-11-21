import 'package:audio_bridge/frist.dart';
import 'package:audio_bridge/ytb.dart';
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

final InAppLocalhostServer localhostServer =
    InAppLocalhostServer(documentRoot: 'assets', port: 18192);
Future main() async {
  WidgetsFlutterBinding.ensureInitialized();

  if (!kIsWeb) {
    // start the localhost server
    try {
      await localhostServer.start();
    } catch (e) {
      debugPrint(e.toString());
    }
    debugPrint("started");
  }

  if (!isDev && !kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
    await InAppWebViewController.setWebContentsDebuggingEnabled(kDebugMode);
  }

  runApp(const MaterialApp(home: FirstRoute()));
}
