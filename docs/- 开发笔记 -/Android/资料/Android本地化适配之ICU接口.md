---
dg-publish: true
tags:
  - ICU
  - 多语言
---
> [!FAQ] 转载
> 转自 https://juejin.cn/post/7211745375921029181
#### 背景：

在多语言项目中，我们经常会遇到本地化适配不规范导致的问题。例如 **月份翻译错误**、**数字显示格式不正确** 或者 **数字显示形式与本地习惯不符** 等。为了寻求一种更精准高效的适配方案，我在网上查阅了相关资料。发现Google提供了一个本地化API接口——ICU API。它可以利用ICU和CLDR提供Unicode和其他国际化支持。从而提升软件的本地化质量。

#### 本地化适配场景

本地化适配所涉及到的问题，基本上都可以归纳为：在不同的语言和地区，同一个信息所显示翻译不同、格式不同或者一个事物表现规则不同。通过归纳总结，我们把常见的本地化适配分为以下几个类型：**时间信息**、**数字信息**、**文件大小及其单位**、**历法规则**、**测量单位和时区信息**。

#### 本地化接口使用

针对以上所述本地化场景，我们分别介绍相关接口以及接口使用方法。

常见格式如日期、单位等，在 `data/locales` 目录中有详细说明。，我们可以下载 [data/locales/zh.txt](https://link.juejin.cn?target=https%3A%2F%2Fandroid.googlesource.com%2Fplatform%2Fexternal%2Ficu4c%2F%2B%2Fabf6d5f6c5eb283cd91a39fcf9169136f6dc49cb%2Fdata%2Flocales%2Fzh.txt "https://android.googlesource.com/platform/external/icu4c/+/abf6d5f6c5eb283cd91a39fcf9169136f6dc49cb/data/locales/zh.txt") 文件查看不同标签对应内容含义。

例如我们要查看星期在各国翻译下的内容：

- 首先我们在 `data/locales/zh.txt` 中查找星期一对应标签 `dayNames` 下面。其中wide表示全称，short表示简称。
- 打开 `data/locales` 其它国家对应语言码txt文件。比如查看法语下翻译情况时打开 `fr.txt` 文件。
- 同样查找 `dayNames` 标签对应翻译，并与手机上显示翻译比对是否一致。

除了 `data/locales` 目录外还有几个目录需要关注：

- data/unit 常用单位
- data/curr 货币单位
- data/lang 语言描述

#### 时间日期格式

DateFormat#getInstanceForSkeleton 、SimpleDateFormat.getDateInstance

说明：

1.这些接口能够解决x年x月x日星期x x时x分x秒这类时间信息格式问题。比如年月日出现先后顺序不同情况。这个格式与本地人使用习惯相关。

好的，我已经输出了你的文章的前半部分，下面是后半部分：

因此使用这个接口能够很好地解决时间显示格式问题。

#### 时间日期格式

DateFormat#getInstanceForSkeleton 、SimpleDateFormat.getDateInstance

说明：

1.这些接口能够解决 `x年x月x日` 、`星期x` 、`x时x分x秒` 这类时间信息格式问题。比如年月日出现先后顺序不同情况，这个格式与本地人使用习惯是相关的。因此使用这个接口能够很好地解决时间显示格式问题。

2.同时这个接口 **还能解决时间表述中翻译问题**，不用再单独考虑翻译问题。 **这个翻译的准确度，往往要高于翻译公司的准确度**。

3.使用其中一些特殊接口能够解决一些特殊字串翻译问题。比如使用以下接口可以获取 `星期一` 、 `二月` 等相关特殊时间在本地语言翻译字符。这个翻译准确度往往高于翻译公司准确度。希望有类似字串显示场景可以研究这个接口并进行使用。[developer.android.com/reference/j…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.com%2Freference%2Fjava%2Futil%2FCalendar%23getDisplayName(int%2C%2520int%2C%2520java.util.Locale) "https://developer.android.com/reference/java/util/Calendar#getDisplayName(int,%20int,%20java.util.Locale)")

以下只就说明进行一个简单举例：下面的getDateInstance可以不传第二个参数，那么就会根据当前系统预设来输出结果。

```java
DateFormat df = DateFormat.getDateInstance(DateFormat.LONG, Locale.FRANCE); myDate = df.parse(myString);
... 
January 12, 1952
```


具体格式由第一个参数控制，模块可根据需求自行定制，给出以下使用案例

```java
DateFormat.getInstanceForSkeleton(DateFormat.ABBR_MONTH_DAY, Locale.getDefault()).format(new Date()); 
... 
3月16日 Mar 16 

DateFormat.getInstanceForSkeleton(DateFormat.MONTH_WEEKDAY_DAY, Locale.getDefault()).format(new Date()); 
... 
3月16日星期四 Thursday,March 16 

DateFormat.getInstanceForSkeleton("MMMEdd", locale1).format(new Date()); 
... 
3月16日星期四 Thursday,Mar 16 

DateFormat.getInstanceForSkeleton(DateFormat.YEAR_MONTH_DAY, Locale.getDefault()).format(new Date()); DateFormat.getInstanceForSkeleton(DateFormat.YEAR_MONTH_DAY, Locale.ENGLISH).format(new Date()); 
... 
2023年3月16 March 16,2023 

DateFormat.getInstanceForSkeleton("yyyyMMdd", Locale.getDefault()).format(new Date()); 
... 
2023/03/16 03/16/2023 

DateFormat.getInstanceForSkeleton("hhmma", Locale.getDefault()).format(new Date()); 
...
下午7:51 7:51 PM 

SimpleDateFormat.getDateInstance(DateFormat.MEDIUM, Locale.getDefault()).format(new Date()); 
... 
2023年03月16日 Mar 16, 2023 

// 使用工具类 
DateUtils.formatDateTime(context, time, DateUtils.FORMAT_ABBREV_MONTH); DateUtils.formatDateTime(context, time, DateUtils.FORMAT_SHOW_YEAR);
```
`

#### 日期/时间区间：

```java
DateInterval dateInterval = new DateInterval(time1, time2); DateIntervalFormat.getInstance(DateFormat.YEAR_ABBR_MONTH_DAY, Locale.getDefault()).format(dateInterval, new StringBuffer(""), new FieldPosition(0)); ... 
2023年3月16日至7月16日 Mar 16 – Jul 16, 2023
```

#### 数字信息格式

NumberFormat#getInstance、NumberFormat#getCurrencyInstance、NumberFormat#getPercentInstance

说明：

1.这些接口能够解决数字信息格式问题。比如数字显示形式应该是本地字母而不是阿拉伯数字、小数点和千分位符号位置不同等。 2.同时这些接口还能解决货币单位和百分比符号的本地化显示问题。 3.使用其中一些特殊接口还能解决一些特殊数字信息的本地化显示问题。比如使用以下接口可以获取本地语言对应的序数词（第一、第二等）或者序列号（1st、2nd等）。

以下只就说明进行一个简单举例：下面的getInstance可以不传参数，那么就会根据当前系统预设来输出结果。

```java
NumberFormat nf = NumberFormat.getInstance(Locale.FRENCH); 
myNumber = nf.parse(myString);
```


输出当地习惯显示的数字格式，或者当地文字


```java
NumberFormat.getInstance(Locale.getDefault()).format(100001.23); 
... 
100,000.89 100,000.89 

DecimalFormat.getPercentInstance(Locale.getDefault()).format(0.53); 
...
53% 53% 

CompactDecimalFormat.getInstance(locale, CompactDecimalFormat.CompactStyle.SHORT).format(100000); 
... 
10万 100K
```


#### 文件大小及其单位格式

FileSizeUtils#formatFileSize(Context context,long numberBytes)

说明：

1.这个接口能够解决文件大小及其单位格式问题。比如文件大小显示形式应该是KB而不是kB、单位之间是否有空格等。 2.同时这个接口还能根据当前系统预设自动选择合适的单位和精度来显示文件大小。

给出一个简单举例：

`public static String formatFileSize(Context context, long sizeBytes);` 

将内容大小格式化为字节、千字节、兆字节等形式。 显示的数字，会根据当地习惯，用逗号分开，或者用点号隔开，或者数字用当地字母显示。 文件大小的单位，也会根据当地习惯显示为Mb或者MB等不同形式。

[developer.android.com/reference/a…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.com%2Freference%2Fandroid%2Ftext%2Fformat%2FFormatter "https://developer.android.com/reference/android/text/format/Formatter")

Android O开始使用标准的单位制 1KB = 1000 bytes

```java
Formatter.formatFileSize(this, 15345); 
... 
//15.35 KB 
//乌克兰语 15,61 КБ 

Formatter.formatShortFileSize(this, 15612524); 
... 
16 MB
16 MB 
16 КБ

```


#### 测量单位

MeasureFormat

在需要显示测量单位的场景，可以使用此接口做好本地化信息展示。以下简单介绍毫升的显示。同样的，其他测量单位，都可以采用类似的方式获取， 只是把参数替换一下即可。

说明： 对于长度，质量，体积，货币、卡路里、ml等测量单位的本地化显示。目前基本都基于翻译拼接来完成。后面建议使用google官方接口来实现。 1.数字+单位

支持的测量单位可参考[developer.android.google.cn/reference/a…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Freference%2Fandroid%2Ficu%2Futil%2FMeasureUnit "https://developer.android.google.cn/reference/android/icu/util/MeasureUnit") ，调整传参即可

```java
Measure measure = new Measure(30.5, MeasureUnit.CELSIUS); MeasureFormat.getInstance(Locale.getDefault(),MeasureFormat.FormatWidth.SHORT).format(measure); 
... 
30.5°C 30.5°C 

Measure measure = new Measure(30.5, MeasureUnit.HOUR); MeasureFormat.getInstance(Locale.getDefault(),MeasureFormat.FormatWidth.SHORT).format(measure);
... 
30.5小时 30.5hr 

Measure measure = new Measure(224, MeasureUnit.GIGABYTE); MeasureFormat.getInstance(Locale.getDefault(),MeasureFormat.FormatWidth.SHORT).format(measure); 
... 
**224吉字节****数字单位常量中文与预期不符，可能需要单独处理** 
224GB

```


针对部分场景，需要区分数字和单位大小，可以结合MeasureFormat和NumberFormat，分别拿到完整字符串和数字部分字符串，计算index后设置样式即可（注意：不要拆分成两个字符串分别布局）

```java
NumberFormat instance = NumberFormat.getInstance(Locale.getDefault()); 
String celsius = MeasureFormat.getInstance(Locale.getDefault(), MeasureFormat.FormatWidth.SHORT, instance).formatMeasures(measure); 
String number = instance.format(30.5); SpannableString spannableString = new SpannableString(celsius); 
spannableString.setSpan(new AbsoluteSizeSpan(30, true), celsius.indexOf(number), celsius.indexOf(number) + number.length(), 0); 
textView.setText(spannableString);
```


#### 日期格式符号

说明：获取星期、月份列表等，支持获取format形式和standalone形式，wide、narrow、short

```java
DateFormatSymbols dateFormatSymbols = new DateFormatSymbols(Locale.getDefault); dateFormatSymbols.getWeekdays(); dateFormatSymbols.getWeekdays(DateFormatSymbols.STANDALONE,DateFormatSymbols.WIDE); dateFormatSymbols.getMonths();
```



接口记录：

1、TextUtils#expandTemplate [developer.android.google.cn/reference/k…](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.android.google.cn%2Freference%2Fkotlin%2Fandroid%2Ftext%2FTextUtils%23expandtemplate "https://developer.android.google.cn/reference/kotlin/android/text/TextUtils#expandtemplate")

```xml
// string.xml 
<string name="storage_size_large_alternate"><xliff:g id="number" example="128">^1</xliff:g> <font size="15"><xliff:g id="unit" example="KB">^2</xliff:g></font></string> 
TextUtils.expandTemplate(getText(R.string.storage_size_large_alternate), "128", "GB");

```



#### 常见问题FAQ

[iculocal](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbricklayers%2Ficulocal "https://github.com/bricklayers/iculocal")

  