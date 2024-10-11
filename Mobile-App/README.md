### Project Requirements
    node: v16.15.0
    npm: v8.1.3
    ionic: v7.1.1
    cordova: 10.1.2
### Build Apk
    Debug: `ionic cordova run android --prod` OR `ionic cordova build android --prod`
    Release: `ionic cordova build android --prod --release --buildConfig=build.json` OR `ionic cordova build android --prod --release --buildConfig=build.json -- -- --packageType=bundle`
    