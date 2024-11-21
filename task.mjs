import { createClient } from "webdav";
import pack from "./webview/package.json" assert { type: "json" };

if (os.type() === "Windows_NT") {
  usePowerShell();
}
$.verbose = true;

const webdavClient = createClient(
  "https://alist.dadigua.men/dav/static/downloads/HyperYTB",
  {
    username: "dadigua",
    password: "qweQWE1!@#",
  }
);
await webdavClient.getDirectoryContents("/");

if (argv.dev) {
  await within(() => {
    return Promise.all([
      $({
        cwd: path.resolve(__dirname, "webview"),
      })`npx cross-env NODE_ENV=development webpack -w --config webpack.inject.js`,
      $({
        cwd: path.resolve(__dirname, "webview"),
      })`npm run watch`,
    ]);
  });
}
if (argv.webviewprod) {
  await within(() => {
    return Promise.all([
      $({
        cwd: path.resolve(__dirname, "webview"),
      })`npx cross-env NODE_ENV=webview webpack --config webpack.inject.js`,
      $({
        cwd: path.resolve(__dirname, "webview"),
      })`npm run build`,
    ]);
  });
}
if (argv.androidprod) {
  await $`flutter build apk --release`;
  let p = path.resolve(__dirname, `./dist/${pack.version}`);
  await fs.copy(
    "./build/app/outputs/flutter-apk/app-release.apk",
    p + `/app-release-${pack.version}.apk`,
    { overwrite: true }
  );
}
if (argv.iosprod) {
  // react-native
  await $`flutter build ipa --release`;
  let p = path.resolve(__dirname, `./dist/${pack.version}`);
  await fs.copy(
    `./build/ios/ipa/flutter_app.ipa`,
    p + `/flutter-app-${pack.version}.ipa`,
    {
      overwrite: true,
    }
  );
}

if (argv.prod) {
  await $`zx task.mjs --webviewprod`;
  await $`zx task.mjs --androidprod`;
  await $`zx task.mjs --iosprod`;

  await uploadDirectory("./dist", "");
}

console.log("done");

async function uploadDirectory(sourceDir, targetDir) {
  const files = await fs.readdir(sourceDir);
  for (const file of files) {
    console.log("file : ", file);
    if (file.endsWith(".ipa") || file.endsWith(".aab")) {
      continue;
    }
    const sourcePath = `${sourceDir}/${file}`;
    const targetPath = `${targetDir}/${file}`;
    const stat = await fs.stat(sourcePath);
    if (stat.isDirectory()) {
      let isExist = await webdavClient.exists(targetPath);
      if (!isExist) {
        await webdavClient.createDirectory(targetPath);
      }
      await uploadDirectory(sourcePath, targetPath);
    } else {
      const fileContent = await fs.readFile(sourcePath);
      await retry(3, () =>
        webdavClient.putFileContents(targetPath, fileContent, {})
      );
      // await webdavClient.putFileContents(targetPath, fileContent, {});
    }
  }
}
