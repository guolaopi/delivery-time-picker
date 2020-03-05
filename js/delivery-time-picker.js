var DeliveryTimePicker = {
    rootEl: "",
    option: {},
    dayList: [],
    weekdayName: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    dayName: ["今天", "明天", "后天"],
    currentDayIndex: -1,
    isShow: false,
    createDiv: function(rootEl) {
        var closeDom = document.createElement("div");
        closeDom.className = "close-btn";
        closeDom.click = DeliveryTimePicker.close;
        var headerDom = document.createElement("div");
        headerDom.className = "picker-header";
        headerDom.textContent = "选择预计送达时间";
        headerDom.appendChild(closeDom);
        var dayUlDom = document.createElement("ul");
        dayUlDom.id = "pickerDay";
        var timeUlDom = document.createElement("ul");
        timeUlDom.id = "pickerTime";
        var contentDom = document.createElement("div");
        contentDom.className = "picker-content";
        contentDom.appendChild(dayUlDom);
        contentDom.appendChild(timeUlDom);
        var boxDom = document.createElement("div");
        boxDom.className = "picker-box";
        boxDom.appendChild(headerDom);
        boxDom.appendChild(contentDom);
        var pickerDom = document.createElement("div");
        pickerDom.id = "deliveryTimePicker";
        pickerDom.appendChild(boxDom);
        if (rootEl) {
            DeliveryTimePicker.rootEl = rootEl;
            document
                .getElementById(rootEl.split("#")[1])
                .appendChild(pickerDom);
        } else {
            document.body.appendChild(pickerDom);
        }
    },
    init: function(option, rootEl) {
        DeliveryTimePicker.createDiv(rootEl);
        document.addEventListener("click", DeliveryTimePicker.clickToClose);
        option = option ? option : {};
        option.dayRange = option.dayRange ? option.dayRange : 3;
        option.timeInterval = option.timeInterval ? option.timeInterval : 60;
        option.showDate = option.showDate ? option.showDate : false;
        option.startTime = option.startTime ? option.startTime : 0;
        option.endTime = option.endTime ? option.endTime : 23;
        Date.prototype.addDays = function(number) {
            return new Date(this.getTime() + 24 * 60 * 60 * 1000 * number);
        };
        Date.prototype.addMins = function(number) {
            return new Date(this.getTime() + 60 * 1000 * number);
        };
        DeliveryTimePicker.option = option;
        DeliveryTimePicker.updateTime();
    },
    destory: function() {
        document.removeEventListener("click", DeliveryTimePicker.clickToClose);
        Date.prototype.addDays = null;
        Date.prototype.addMins = null;
        var pickerDom = document.getElementById("deliveryTimePicker");
        if (DeliveryTimePicker.rootEl) {
            document
                .getElementById(DeliveryTimePicker.rootEl.split("#")[1])
                .removeChild(pickerDom);
        } else {
            document.body.removeChild(pickerDom);
        }
        DeliveryTimePicker = null;
    },
    clickToClose: function(e) {
        if (
            DeliveryTimePicker.isShow &&
            !document
                .querySelector("#deliveryTimePicker .picker-box")
                .contains(e.target)
        ) {
            DeliveryTimePicker.close();
        }
    },
    updateTime: function() {
        var currentTime = new Date();
        var dayDom = document.getElementById("pickerDay");
        dayDom.innerHTML = "";
        DeliveryTimePicker.dayList = [];
        for (var i = 0; i < DeliveryTimePicker.option.dayRange; i++) {
            var newDay = currentTime.addDays(i);
            DeliveryTimePicker.dayList.push({
                year: newDay.getFullYear(),
                month: newDay.getMonth() + 1,
                date: newDay.getDate(),
                day: newDay.getDay()
            });
            var dayStr = newDay.getMonth() + 1 + "月" + newDay.getDate() + "日";
            if (!DeliveryTimePicker.option.showDate && i <= 2) {
                dayStr = DeliveryTimePicker.dayName[i];
            }
            if (DeliveryTimePicker.option.showWeekday) {
                dayStr +=
                    "（" +
                    DeliveryTimePicker.weekdayName[newDay.getDay()] +
                    "）";
            }
            var liStr =
                "<li" +
                (i == 0 ? ' class="active"' : " ") +
                ' onclick="DeliveryTimePicker.changeDay(' +
                i +
                ')">' +
                dayStr +
                "</li>";
            dayDom.innerHTML += liStr;
        }
        DeliveryTimePicker.changeDay(0);
        dayDom.scrollTop = 0;
    },
    show: function() {
        DeliveryTimePicker.updateTime();
        document.getElementById("deliveryTimePicker").style.display = "block";
        setTimeout(function() {
            document.querySelector(
                "#deliveryTimePicker .picker-box"
            ).style.bottom = "0";
            DeliveryTimePicker.isShow = true;
        }, 80);
    },
    close: function() {
        document.querySelector("#deliveryTimePicker .picker-box").style.bottom =
            "-35%";
        setTimeout(function() {
            document.getElementById("deliveryTimePicker").style.display =
                "none";
            DeliveryTimePicker.isShow = false;
        }, 180);
    },
    setTimeList: function() {
        var currentTime = new Date();
        var timeDom = document.getElementById("pickerTime");
        timeDom.innerHTML = "";
        if (
            (DeliveryTimePicker.currentDayIndex == 0 &&
                currentTime.getHours() < DeliveryTimePicker.option.startTime) ||
            DeliveryTimePicker.currentDayIndex > 0
        ) {
            currentTime.setHours(DeliveryTimePicker.option.startTime, 0);
        }
        var newTime = currentTime;
        var index = 0;
        while (
            newTime.getDay() == currentTime.getDay() &&
            newTime.getHours() * 100 + newTime.getMinutes() <
                (DeliveryTimePicker.option.endTime - 1) * 100 + 59
        ) {
            var hourStr =
                newTime.getHours() >= 10
                    ? newTime.getHours().toString()
                    : "0" + newTime.getHours().toString();
            var minStr =
                newTime.getMinutes() >= 10
                    ? newTime.getMinutes().toString()
                    : "0" + newTime.getMinutes().toString();
            var liStr =
                '<li onclick="DeliveryTimePicker.chooseTime(' +
                index +
                ')">' +
                hourStr +
                ":" +
                minStr +
                "</li>";
            timeDom.innerHTML += liStr;
            newTime = newTime.addMins(DeliveryTimePicker.option.timeInterval);
            index++;
        }
        timeDom.scrollTop = 0;
    },
    changeDay: function(index) {
        if (
            document.querySelector("#deliveryTimePicker #pickerDay").children
                .length > 0
        ) {
            if (index != DeliveryTimePicker.currentDayIndex) {
                var activeDom = document.querySelector(
                    "#deliveryTimePicker #pickerDay .active"
                );
                if (activeDom) {
                    activeDom.className = "";
                }
                document.querySelector(
                    "#deliveryTimePicker #pickerDay"
                ).children[index].className = "active";
                DeliveryTimePicker.currentDayIndex = index;
                DeliveryTimePicker.setTimeList();
            }
        }
    },
    chooseTime(index) {
        if (
            document.querySelector("#deliveryTimePicker #pickerTime").children
                .length > 0
        ) {
            var activeDom = document.querySelector(
                "#deliveryTimePicker #pickerTime .active"
            );
            if (activeDom) {
                activeDom.className = "";
            }
            var currentDom = document.querySelector(
                "#deliveryTimePicker #pickerTime"
            ).children[index];
            currentDom.className = "active";
            DeliveryTimePicker.close();
            var day =
                DeliveryTimePicker.dayList[DeliveryTimePicker.currentDayIndex];
            new Date("2020-3-5 20:15");
            var timeStr =
                day.year +
                "-" +
                (day.month < 10 ? "0" + day.month : day.month) +
                "-" +
                (day.date < 10 ? "0" + day.date : day.date) +
                " " +
                currentDom.textContent;
            var time = new Date(timeStr);
            if (
                DeliveryTimePicker.option.callback &&
                typeof DeliveryTimePicker.option.callback == "function"
            ) {
                DeliveryTimePicker.option.callback(timeStr, time);
            } else {
                console.log("chose time: ", timeStr, time);
                console.warn(
                    "option of DeliveryTimePicker.init(option) dosen't has callback function! ---from DeliveryTimePicker"
                );
            }
        }
    }
};
