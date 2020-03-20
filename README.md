# delivery-time-picker

仿美团外卖的一个送达时间选择控件

# [Demo 地址](https://guolaopi.github.io/delivery-time-picker/).

# 示意（gif）：

![demo.gif](img/demo.gif)

# 引用（Reference）：

```html
<script src="js/delivery-time-picker.js"></script>
<link type="text/css" rel="stylesheet" href="css/delivery-time-picker.css" />
```

# 用法（Usage）：

```js
// 在页面加载时初始化控件，参数1是控件选项，参数2是一个dom的id字符串且可以忽略
DeliveryTimePicker.init(
    {
        dayRange: 10, // 日期的显示数量，从今天起往后推
        timeInterval: 60, // 时间的间隔，单位分钟
        startTime: 8, // 时间范围的开始（开始营业的时间）
        endTime: 24, // 时间范围的结束（结束营业的时间）
        showDate: false, // 显示‘今天/明天/后天’还是全部显示日期
        showWeekday: true, // 是否显示周几
        clickOutside: true, // 点击选择器外部关闭，默认true开启
        // 选择时间后的回调函数
        callback: function(str, time) {
            // 参数1是 “yyyy-MM-dd HH:mm”格式的字符串
            // 参数2是js的一个Date()对象
            console.log("选择了：", str, time);
            document.getElementById("result").innerHTML = "选择了：" + str;
        }
    },
    "#root" // 要将控件添加到指定的dom下面，注意要加#号，此参数如果不写默认添加到body最后
);

// 显示控件
DeliveryTimePicker.show();

// ~~~建议在不用时销毁控件
DeliveryTimePicker.destory();
```
