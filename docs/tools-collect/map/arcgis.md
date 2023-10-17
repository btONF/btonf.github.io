# Arcgis 地图库

## 旧版
旧版不再维护了，旧版文档见 [文档](/pdf/arcgis-runtime-sdk-android-guide-10.2.9.pdf)

## 新版
- ArcGIS Runtime API for Android （https://developers.arcgis.com/android/reference/system-requirements/）：
兼容至android6.0，使用java语言，使用OpenGL ES 2.0绘制2D图，3D需要OpenGL ES 3.0支持
Your apps can run on Android phones and tablets with the Android platform version 6.0, Marshmallow (API level 23) and above. Devices with the armeabi-v7a, arm64-v8a, and x86_64 architectures are supported. For additional information, see Reduce your APK size.

- ArcGIS Maps SDK for Kotlin（https://developers.arcgis.com/kotlin/）
Your apps can run on Android phones and tablets with the Android 8.0, Oreo (API level 26) or higher and above. Devices with the armeabi-v7a , arm64-v8a , and x86_64 architectures are supported. For additional information, see Reduce your APK size.
仅支持Android8.0及以上版本，使用了kotlin协程及其他的一些特性
## ArcGIS Runtime API for Android

### 引入
1. 添加maven仓
```
maven {
    url 'https://esri.jfrog.io/artifactory/arcgis'
}
```

2. gradle配置
```groovy
android {
    ...
    packagingOptions {
        exclude("META-INF/DEPENDENCIES")
    }
    ...
}
dependencies {

    ...
    implementation ("com.esri.arcgisruntime:arcgis-android:100.15.3")
}

```

3. Manifest
```
联网加载地图
<uses-permission android:name="android.permission.INTERNET" />
使用ES2.0绘制地图
<uses-feature
    android:glEsVersion="0x00020000"
    android:required="true" />
### Apikey
必须设置，否则无法加载地图
有免费额度限制，见https://developers.arcgis.com/pricing/
ArcGISRuntimeEnvironment.setApiKey("");

```

### 接口 
```java
去除powered by
mapView.setAttributionTextVisible(false);
```
