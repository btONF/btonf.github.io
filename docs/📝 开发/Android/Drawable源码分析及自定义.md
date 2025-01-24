## 表现

1. `drawable `可以是图片文件，也可以是xml，常用于背景,`ImageView`等
2. 代码中修改背景支持直接使用id设置，也支持使用`Drawable`对象设置
3. 通常使用`context.getResourse().getDrawable(int resid) `的方式去获取Drawable对象，断点时可以发现不同的资源产生的Drawable类型不同

## 疑问

1. 为何可以对一个view设置 `background `属性，设置 `drawable` 文件就可以使其能够显示一个图像
2. 当drawable设置为图片，或xml文件时，结果会变得不一样，底层是如何处理的
3. 假如当前使用了 `shape `标签，直接在标签内定义的属性，及内部定义的标签如何被解析

## 源码探索

### 从源头`getDrawable()`开始

给一个View设置背景最常用的方法`view.setBackground(Drawable drawable)`一定不陌生，当我们想使用存放在drawable目录下的资源时，通常使用`context.getResourse().getDrawable(int resid) `的方式去获取，深入以下具体实现

```java
public Drawable getDrawable(@DrawableRes int id, @Nullable Theme theme)
        throws NotFoundException {
    return getDrawableForDensity(id, 0, theme);
}

public Drawable getDrawableForDensity(@DrawableRes int id, int density, @Nullable Theme theme) {
    final TypedValue value = obtainTempTypedValue();
    try {
        // 读取configuration里的属性
        final ResourcesImpl impl = mResourcesImpl;
        impl.getValueForDensity(id, density, value, true);
        // 获取drawable
        return loadDrawable(value, id, density, theme);
    } finally {
        releaseTempTypedValue(value);
    }
}
Drawable loadDrawable(@NonNull TypedValue value, int id, int density, @Nullable Theme theme)
        throws NotFoundException {
    // 最终走到实现类的加载drawable方法
    return mResourcesImpl.loadDrawable(this, value, id, density, theme);
}
```
```java
@Nullable
Drawable loadDrawable(@NonNull Resources wrapper, @NonNull TypedValue value, int id,
        int density, @Nullable Resources.Theme theme)
        throws NotFoundException {

	...
    try {
		...
    	// 纯色背景，看起来设置了color即可，实际上仍然还是一个ColorDrawable对象
        final boolean isColorDrawable;
        final DrawableCache caches;
        final long key;
        ...
        // 判断是否有缓存可以用，对于同配置的同一id的资源，会优先取上次解析缓存返回，省去解析流程
        // 题外话，这就是为什么drawable会有mutate()方法隔离属性，因为不同view持有的drawable是同一个对象
        if (!mPreloading && useCache) {
            final Drawable cachedDrawable = caches.getInstance(key, wrapper, theme);
            if (cachedDrawable != null) {
                cachedDrawable.setChangingConfigurations(value.changingConfigurations);
                return cachedDrawable;
            }
        }
        Drawable dr;
        boolean needsNewDrawableAfterCache = false;
        if (cs != null) {
            dr = cs.newDrawable(wrapper);
        } else if (isColorDrawable) {
            dr = new ColorDrawable(value.data);
        } else {
            // 创建drawable对象并加入缓存
            dr = loadDrawableForCookie(wrapper, value, id, density);
        }
        ...
        return dr;
    } catch (Exception e) {
       ...
    }
}

```

### loadDrawable

```java
private Drawable loadDrawableForCookie(@NonNull Resources wrapper, @NonNull TypedValue value,
        int id, int density) {
	...
    try {
       ...
        try {
            // 解析文件，区分文件类型1.xml 2.常规图片类型
            if (file.endsWith(".xml")) {
                final String typeName = getResourceTypeName(id);
                if (typeName != null && typeName.equals("color")) {
                    dr = loadColorOrXmlDrawable(wrapper, value, id, density, file);
                } else {
                    dr = loadXmlDrawable(wrapper, value, id, density, file);
                }
            } else {
                final InputStream is = mAssets.openNonAsset(
                        value.assetCookie, file, AssetManager.ACCESS_STREAMING);
                final AssetInputStream ais = (AssetInputStream) is;
                dr = decodeImageDrawable(ais, wrapper, value);
            }
        } finally {
            stack.pop();
        }
    } catch (Exception | StackOverflowError e) {
        Trace.traceEnd(Trace.TRACE_TAG_RESOURCES);
        final NotFoundException rnf = new NotFoundException(
                "File " + file + " from drawable resource ID #0x" + Integer.toHexString(id));
        rnf.initCause(e);
        throw rnf;
    }
	 ...
    return dr;
}

private Drawable loadXmlDrawable(@NonNull Resources wrapper, @NonNull TypedValue value,
        int id, int density, String file)
        throws IOException, XmlPullParserException {
    try (
            XmlResourceParser rp =
                    loadXmlResourceParser(file, id, value.assetCookie, "drawable")
    ) {
        // 最终走到了Drawable的解析xml的方法内
        return Drawable.createFromXmlForDensity(wrapper, rp, density, null);
    }
}
```

### createFromXmlForDensity

```java
public static Drawable createFromXmlForDensity(@NonNull Resources r,
        @NonNull XmlPullParser parser, int density, @Nullable Theme theme)
        throws XmlPullParserException, IOException {
   ...
	// 调用静态方法创建drawable对象
    Drawable drawable = createFromXmlInnerForDensity(r, parser, attrs, density, theme);

    if (drawable == null) {
        throw new RuntimeException("Unknown initial tag: " + parser.getName());
    }

    return drawable;
}

static Drawable createFromXmlInnerForDensity(@NonNull Resources r,
        @NonNull XmlPullParser parser, @NonNull AttributeSet attrs, int density,
        @Nullable Theme theme) throws XmlPullParserException, IOException {
    return r.getDrawableInflater().inflateFromXmlForDensity(parser.getName(), parser, attrs,
            density, theme);
}
```

### inflate

到这一步代码已经没法在sdk中查看了，剩余的代码在sdk内，继续分析
[http://aospxref.com/android-13.0.0_r3/xref/frameworks/base/graphics/java/android/graphics/drawable/DrawableInflater.java#89](http://aospxref.com/android-13.0.0_r3/xref/frameworks/base/graphics/java/android/graphics/drawable/DrawableInflater.java#89)
![[Pasted image 20250124155515.png]]

可以看到实际原生也是使用的xml标签解析，不同的xml对应不同类型的drawable实现，这里基本已经包含了所有的自带drawable了

> 系统还有部分其他Drawable，不支持标签使用，常用于代码使用，比如PaintDrawable,ShapeDrawable等等

### `<shape>`标签及其实现

```xml
<shape android:shape="rectangle">
    <solid android:color="@android:color/holo_blue_dark"/>
</shape>
```

通过这种写法，可以生成一个颜色为暗蓝色的背景，那么它是如何知道我们设置的颜色，并绘制出来呢

> Android中的自定义标签一般会预先定义在`attr`文件内，根据其描述及其解析位置，可以找寻到其实现类

通过选中`android:color`属性，找到以下源码

```xml
<!-- Used to fill the shape of GradientDrawable with a solid color. -->
<declare-styleable name="GradientDrawableSolid">
    <!-- Solid color for the gradient shape. -->
    <attr name="color" format="color" />
</declare-styleable>

```

源码干脆直接说明该属性被GradientDrawable使用
基于第四部中的标签对照，确实该标签对应的实现类为GradientDrawable
### GradientDrawable

当我们使用shape标签时，将会创建一个GradientDrawable对象用于绘制，那么除了attr之外，还有一些内部标签是怎么解析的呢

```java
public void inflate(@NonNull Resources r, @NonNull XmlPullParser parser,
        @NonNull AttributeSet attrs, @Nullable Theme theme)
        throws XmlPullParserException, IOException {
    super.inflate(r, parser, attrs, theme);

    mGradientState.setDensity(Drawable.resolveDensity(r, 0));
	// 自定义View使用的同款attr解析
    final TypedArray a = obtainAttributes(r, theme, attrs, R.styleable.GradientDrawable);
    updateStateFromTypedArray(a);
    a.recycle();
	// 解析子标签
    inflateChildElements(r, parser, attrs, theme);

    updateLocalState(r);
}
private void inflateChildElements(Resources r, XmlPullParser parser, AttributeSet attrs,
        Theme theme) throws XmlPullParserException, IOException {
    TypedArray a;
    int type;

    final int innerDepth = parser.getDepth() + 1;
    int depth;
    while ((type=parser.next()) != XmlPullParser.END_DOCUMENT
           && ((depth=parser.getDepth()) >= innerDepth
                   || type != XmlPullParser.END_TAG)) {
        if (type != XmlPullParser.START_TAG) {
            continue;
        }

        if (depth > innerDepth) {
            continue;
        }

        String name = parser.getName();
    	// 常见的size，solid，stroke等在此解析
        if (name.equals("size")) {
            a = obtainAttributes(r, theme, attrs, R.styleable.GradientDrawableSize);
            updateGradientDrawableSize(a);
            a.recycle();
        } else if (name.equals("gradient")) {
            a = obtainAttributes(r, theme, attrs, R.styleable.GradientDrawableGradient);
            updateGradientDrawableGradient(r, a);
            a.recycle();
        } else if (name.equals("solid")) {
            a = obtainAttributes(r, theme, attrs, R.styleable.GradientDrawableSolid);
            updateGradientDrawableSolid(a);
            a.recycle();
        } else if (name.equals("stroke")) {
            a = obtainAttributes(r, theme, attrs, R.styleable.GradientDrawableStroke);
            updateGradientDrawableStroke(a);
            a.recycle();
        } else if (name.equals("corners")) {
            a = obtainAttributes(r, theme, attrs, R.styleable.DrawableCorners);
            updateDrawableCorners(a);
            a.recycle();
        } else if (name.equals("padding")) {
            a = obtainAttributes(r, theme, attrs, R.styleable.GradientDrawablePadding);
            updateGradientDrawablePadding(a);
            a.recycle();
        } else {
            Log.w("drawable", "Bad element under <shape>: " + name);
        }
    }
}
```

### 其它细节

1. inflate方法是在创建后最先调用的方法，部分初始化逻辑可以放在这里
2. 在通过xml创建时，存在创建失败的情况，如不存在的标签，此时会走另一个方法进行创建，提供了可扩展性

![[Pasted image 20250124155712.png]]

当标签为drawable且存在class属性时，尝试使用class内容初始化，否则使用标签名初始化
### 流程总结

![[Pasted image 20250124155806.png]]
## 自定义阴影drawable

> 原生elevation不支持所有版本，颜色修改也有版本限制
> 原生elevation光源固定，导致不同屏幕位置的控件，阴影效果不完全相同

### 定义基类

```java
public class BaseShadowDrawable extends Drawable {

    protected Paint paint;
    // shadow x轴偏移
    protected float shadowDx;
    // shdaowY轴偏移
    protected float shadowDy;
    // shadow模糊半径
    protected float shadowRadius;
    // shadow颜色
    protected int shadowColor;
    public BaseShadowDrawable() {
        paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setColor(Color.TRANSPARENT);
    }

    @Override
    public void draw(@NonNull Canvas canvas) {
    }

    @Override
    public void setAlpha(int alpha) {

    }

    @Override
    public void setColorFilter(@Nullable ColorFilter colorFilter) {

    }

    @Override
    public int getOpacity() {
        return 0;
    }

    @Override
    public void inflate(@NonNull Resources r, @NonNull XmlPullParser parser, @NonNull AttributeSet attrs, @Nullable Resources.Theme theme) throws IOException, XmlPullParserException {
        super.inflate(r, parser, attrs, theme);
        TypedArray typedArray = r.obtainAttributes(attrs, R.styleable.BaseShadowDrawable);
        shadowColor = typedArray.getColor(R.styleable.BaseShadowDrawable_android_shadowColor, Color.GRAY);
        shadowRadius = typedArray.getFloat(R.styleable.BaseShadowDrawable_android_shadowRadius, 5);
        shadowDx = typedArray.getFloat(R.styleable.BaseShadowDrawable_android_shadowDx, 0);
        shadowDy = typedArray.getFloat(R.styleable.BaseShadowDrawable_android_shadowDy, 0);
        typedArray.recycle();
    }
}
```

### 矩形阴影实现类，可定义圆角

```java
public class RectShadowDrawable extends BaseShadowDrawable {

    protected int rectRadiusX;
    protected int rectRadiusY;

    @Override
    public void draw(@NonNull Canvas canvas) {
        paint.setShadowLayer(shadowRadius, shadowDx, shadowDy, shadowColor);
        Rect rect = getBounds();
        canvas.drawRoundRect(rect.left, rect.top, rect.right, rect.bottom, rectRadiusX, rectRadiusY, paint);
    }


    @Override
    public void inflate(@NonNull Resources r, @NonNull XmlPullParser parser, @NonNull AttributeSet attrs, @Nullable Resources.Theme theme) throws IOException, XmlPullParserException {
        super.inflate(r, parser, attrs, theme);
        TypedArray typedArray = r.obtainAttributes(attrs, R.styleable.RectShadowDrawable);
        int allRadius = typedArray.getDimensionPixelOffset(R.styleable.RectShadowDrawable_shadowRectRadius, 0);
        rectRadiusX = typedArray.getDimensionPixelOffset(R.styleable.RectShadowDrawable_shadowRectRadiusX, allRadius);
        rectRadiusY = typedArray.getDimensionPixelOffset(R.styleable.RectShadowDrawable_shadowRectRadiusY, allRadius);
        typedArray.recycle();
    }
}
```
### path阴影实现类,可使用vectordrawable的path
```java
public class PathShadowDrawable extends BaseShadowDrawable {

    protected Path path;

    @Override
    public void draw(@NonNull Canvas canvas) {
        paint.setShadowLayer(shadowRadius, shadowDx, shadowDy, shadowColor);
        canvas.drawPath(path, paint);
    }


    @Override
    public void inflate(@NonNull Resources r, @NonNull XmlPullParser parser, @NonNull AttributeSet attrs, @Nullable Resources.Theme theme) throws IOException, XmlPullParserException {
        super.inflate(r, parser, attrs, theme);
        TypedArray typedArray = r.obtainAttributes(attrs, R.styleable.PathShadowDrawable);
        String pathStr = typedArray.getString(R.styleable.PathShadowDrawable_shadowPath);
        path = PathParser.createPathFromPathData(pathStr);
        typedArray.recycle();
    }

}
```
### 使用方式

使用drawable标签+class属性自定义

```xml
<?xml version="1.0" encoding="utf-8"?>
<drawable class="com.bt.example.RectShadowDrawable"
  xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:app="http://schemas.android.com/apk/res-auto"
  android:shadowColor="#2196F3"
  android:shadowDx="10"
  android:shadowDy="10"
  android:shadowRadius="20"
  app:shadowRectRadius="20px" />
```

使用自定义标签

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.bt.example.PathShadowDrawable
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:shadowColor="#2196F3"
    android:shadowDx="0"
    android:shadowDy="0"
    android:shadowRadius="5"
    app:shadowPath="M20.808,19.797C21.198,19.407 21.831,19.407 22.222,19.797L30,27.576L37.778,19.797C38.141,19.435 38.713,19.409 39.105,19.72L39.192,19.797L40.203,20.808C40.593,21.198 40.593,21.831 40.203,22.222L22.222,40.203C21.831,40.593 21.198,40.593 20.808,40.203L19.797,39.192C19.407,38.802 19.407,38.169 19.797,37.778L27.576,30L19.797,22.222C19.435,21.859 19.409,21.287 19.72,20.895L19.797,20.808ZM39.192,40.203L40.203,39.192C40.593,38.802 40.593,38.169 40.203,37.778L35.556,33.131C35.165,32.741 34.532,32.741 34.142,33.131L33.131,34.142C32.741,34.532 32.741,35.165 33.131,35.556L37.778,40.203C38.169,40.593 38.802,40.593 39.192,40.203Z" />
```
### 效果

![[Pasted image 20250124155840.png]]