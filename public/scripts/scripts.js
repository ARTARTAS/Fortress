//получение текущей датs МСК (сегодня)
function getMoscowDate() {
    var offset = new Date().getTimezoneOffset()
    var utcDate = new Date(new Date().getTime() + offset * 60 * 1000);
    var mskDate = new Date(utcDate.getTime() + 3 * 60 * 60 * 1000);
    return mskDate;
};

// Подготовка числа к выводу на UI (user interface)
function NumberProcessing(num) {
    return (num < 10) ? "0" + num : num;
};

// сегодня (дата месяц)
var currentDay = NumberProcessing(getMoscowDate().getDate());
var currentMonth = NumberProcessing(getMoscowDate().getMonth() + 1);

//вчера (дата месяц)
var yesterday = new Date(getMoscowDate().getTime() - (24 * 60 * 60 * 1000));
var dayYesterday = NumberProcessing(yesterday.getDate());
var monthYesterday = NumberProcessing(yesterday.getMonth() + 1);

//завтра (дата месяц)
var tomorrow = new Date(getMoscowDate().getTime() + (24 * 60 * 60 * 1000));
var dayTomorrow = NumberProcessing(tomorrow.getDate());
var monthTomorrow = NumberProcessing(tomorrow.getMonth() + 1);


// определение первого дня (.day1)
$(function () {
    var now = getMoscowDate()
    var hour = now.getHours();

    if (hour >= 7 & hour < 24) {
        $(".day1").text(currentDay + "." + currentMonth)
    }
    if (hour >= 0 & hour < 7) {
        $(".day1").text(dayYesterday + "." + monthYesterday)
    }
},
    setTimeout(60 * 1000)
);
// определение второго дня (.day2)
$(function () {
    var now = getMoscowDate()
    var hour = now.getHours();

    if (hour >= 7 & hour < 24) {
        $(".day2").text(dayTomorrow + "." + monthTomorrow)
    }
    if (hour >= 0 & hour < 7) {
        $(".day2").text(currentDay + "." + currentMonth)
    }
},
    setTimeout(60 * 1000)
);

// ограничение импута даты
var year = new Date().getFullYear();
$('.input__date')
    .attr("min", year + "-" + currentMonth + "-" + currentDay + "T07:00")
    .attr("max", year + "-" + monthTomorrow + "-" + dayTomorrow + "T05:59");


// Change input data event
function ChangeData(element) {
    let dataTime = {
        day: $(element).val().split('T')[0].split('-')[2],
        month: $(element).val().split('T')[0].split('-')[1],
        hour: $(element).val().split('T')[1].split(':')[0]
    }
    // разбивка списка часов по дням
    var list = $('.hour-list').children().toArray();
    var day1List = $(list).slice(0, 17).toArray();
    var day2List = $(list).slice(17, list.lenth).toArray();

    //соответствие указанной даты 1му дню
    CheckDays(element, currentDay, dataTime, day1List, 0);

    //соответствие указанной даты 2му дню
    CheckDays(element, dayTomorrow, dataTime, day2List, 17);
}

function CheckDays(element, day, dataTime, list, differ) {
    if (day == dataTime.day & currentMonth == dataTime.month) { 
        var pos = 0;
        list.forEach(el => {
            if ($(el).text().split(":")[0] == dataTime.hour) {
                InputAllTimes(pos + differ, element);
            }
            pos++;
        });
    }
}


function InputAllTimes(startPosition, element) { //вывод в таблицу

    let hour = $(element).val().split('T')[1].split(':')[0];

    let minutes = $(element).val().split('T')[1].split(':')[1];

    var parent = $(element).parent().parent();

    var tableList = $(parent).children(".hour-list__item").toArray();

    tableReset(tableList);

    var i = 0;
    tableList.forEach(el => {
        if (i == startPosition) {
            $(el).text(hour + ":" + minutes).css("color", "black").css("background-color", "#a4c2f4");
            var num = i;
            var time = parseInt(hour, 10) + 5;
            while (num < 18) {
                var newNum = num + 5;
                var newElem = $(tableList)[newNum];
                if (time >= 24) {
                    var nextTime = parseInt(time, 10) - 24;
                    $(newElem).text(nextTime + ":" + minutes).css("color", "black").css("background-color", "#a4c2f4");
                } else {
                    $(newElem).text(time + ":" + minutes).css("color", "black").css("background-color", "#a4c2f4");
                }
                time += 5;
                num += 5;
            }
        }
        i++;
    }
    )
}

function tableReset(row) { //сброс табилцы
    row.forEach(el => {
        $(el).text("").css("background-color", "white");
    })
}


