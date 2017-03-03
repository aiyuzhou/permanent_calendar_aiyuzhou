/*
 * Created by Acer on 2016/4/6.
 */
/*
 * 公历
 * */
/*获取UTC时间*/
function getAnyDay()
{
    //考虑时差;
    var anyDay = new Date(Date.UTC.apply(Date, arguments));
    anyDay.setHours(anyDay.getHours() - 8);
    return anyDay;
}
/*本月第一天*/
function FirstDay(theDay)
{
    return getAnyDay(theDay.getFullYear(), theDay.getMonth(), 1);
}
/*判断是否为闰年*/
function isLeapYear(year)
{
    if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0))
    {
        return true;
    }
    else
    {
        return false;
    }
}
/*前一个月有多少天 */
function getMonthDays(day)
{
    /*当前月份为31天*/
    if (day.getMonth() == 0 || day.getMonth() == 2 || day.getMonth() == 4
        || day.getMonth() == 6 || day.getMonth() == 7 || day.getMonth() == 9
        || day.getMonth() == 11)
    {
        return 31;
    }
    /*当前月份为30天*/
    else if (day.getMonth() == 3 || day.getMonth() == 5 || day.getMonth() == 8 || day.getMonth() == 10)
    {
        return 30;
    }
    /*当前月份是三月份，前一个月是二月，需考虑是否为闰年*/
    else if (day.getMonth() == 1)
    {
        if (isLeapYear(day.getFullYear()))
        {//是闰年，二月29天
            return 29;
        }
        else
        {//是平年，二月28天
            return 28;
        }
    }
}

//由某一天得到前一个月的第一天
function getPrevMonthFirstDay(day)
{
    if (day.getMonth() == 0)
    {
        return getAnyDay(day.getFullYear() - 1, 11, 1);
    }
    else
    {
        return getAnyDay(day.getFullYear(), day.getMonth() - 1, 1);
    }
}

//由某一天得到后一个月的第一天
function getNextMonthFirstDay(day)
{
    if (day.getMonth() == 11)
    {
        return getAnyDay(day.getFullYear() + 1, 0, 1);
    }
    else
    {
        return getAnyDay(day.getFullYear(), day.getMonth() + 1, 1);
    }
}

function showTheDayView(theDay)
{
    var firstDay = new FirstDay(theDay);
    var firstDayWeek = firstDay.getDay();
    if (firstDayWeek == 0)
    {//如果是周日，则1号显示在第二排
        firstDayWeek = 7;
    }
    var offset = 7;//下标偏移量,从第八个li写入日期
    var solarYear, solarMonth, solarDay;//公历年月日
    var lunarDate, lunarYear, lunarMonth, lunarDay;//农历日期，年，月，日
    var isLeap = false;//当月是否为闰月
    //取dateDay的li刷新内容
    var allLi = document.getElementById("dateDayContent").getElementsByTagName("li");
    //刷新透明度为1
    for(var li =0;li<allLi.length;li++)
    {
        allLi[li].style.opacity="1";
    }
    //刷新前一个月显示
    var prevMonthDay = getPrevMonthFirstDay(theDay);
    var prevMonthDays = getMonthDays(prevMonthDay);//前一个月有多少天
    for (var i = 0; i < firstDayWeek; i++)
    {
        //写入公历日期
        allLi[offset + i].getElementsByTagName("div")[0].innerHTML = prevMonthDays + i + 1 - firstDayWeek;
        //前一个月的日期设置颜色透明度
        allLi[offset+i].style.opacity = "0.7";
        //计算这天的年月日
        //自定义属性date用来存储当前时间的年月日 如果当前是1月 那么要修改前一个月的年份
        var dateArray1 = [];
        if (theDay.getMonth() == 0)
        {
            dateArray1.push(prevMonthDays + i + 1 - firstDayWeek);//日
            solarDay = prevMonthDays + i + 1 - firstDayWeek;
            dateArray1.push(11);//月 12月
            solarMonth = 11;
            dateArray1.push(theDay.getFullYear() - 1);//年
            solarYear = theDay.getFullYear() - 1;
        }
        else
        {
            dateArray1.push(prevMonthDays + i + 1 - firstDayWeek);//日
            solarDay = prevMonthDays + i + 1 - firstDayWeek;
            dateArray1.push(theDay.getMonth() - 1);//月
            solarMonth = theDay.getMonth() - 1;
            dateArray1.push(theDay.getFullYear());//年
            solarYear = theDay.getFullYear();
        }
        //转为农历日期
        lunarDate = toLunarDate(solarYear, solarMonth, solarDay).split(" ");
        lunarYear = lunarDate[0];
        lunarMonth = lunarDate[1];
        lunarDay = lunarDate[2];
        isLeap = lunarDate[3];
        //date 存放公历日期 lunarDate存放农历日期
        allLi[offset + i].setAttribute("date", dateArray1.toString());
        allLi[offset + i].setAttribute("lunarDate", toLunarView(lunarYear, lunarMonth, lunarDay,isLeap));

        //写入农历日期
        allLi[offset + i].getElementsByTagName("div")[1].innerHTML = toLunarView(lunarYear, lunarMonth, lunarDay,isLeap).split(" ")[2];

        //若有节日则将农历转换为节日
        showHoliday(offset + i, solarMonth, solarDay, lunarMonth, lunarDay);

        //显示节气
        var solarTerm = showSolarTerms(new Date(solarYear, solarMonth, solarDay));
        if (solarTerm != null)
        {
            allLi[offset + i].getElementsByTagName("div")[1].innerHTML = solarTerm;
        }
    }

    var monthDays = getMonthDays(theDay);

    //刷新这一个月显示
    for (var j = 0; j < monthDays; j++)
    {
        allLi[offset + j + firstDayWeek].getElementsByTagName("div")[0].innerHTML = j + 1;
        //计算这天的年月日
        //用来存储当前时间的年月日
        var dateArray2 = [];
        dateArray2.push(j + 1);//日
        solarDay = j + 1;
        dateArray2.push(theDay.getMonth());//月 12月
        solarMonth = theDay.getMonth();
        dateArray2.push(theDay.getFullYear());//年
        solarYear = theDay.getFullYear();

        //转为农历日期
        lunarDate = toLunarDate(solarYear, solarMonth, solarDay).split(" ");
        lunarYear = lunarDate[0];
        lunarMonth = lunarDate[1];
        lunarDay = lunarDate[2];
        isLeap = lunarDate[3];

        //date 存放公历日期 lunarDate存放农历日期
        allLi[offset + j + firstDayWeek].setAttribute("date", dateArray2.toString());
        allLi[offset + j + firstDayWeek].setAttribute("lunarDate", toLunarView(lunarYear, lunarMonth, lunarDay,isLeap));

        //写入农历日期
        allLi[offset + j + firstDayWeek].getElementsByTagName("div")[1].innerHTML = toLunarView(lunarYear, lunarMonth, lunarDay,isLeap).split(" ")[2];

        //若有节日则将农历转换为节日
        showHoliday(offset + j + firstDayWeek, solarMonth, solarDay, lunarMonth, lunarDay);

        //显示节气
        solarTerm = showSolarTerms(new Date(solarYear, solarMonth, solarDay));
        if (solarTerm != null)
        {
            allLi[offset + j + firstDayWeek].getElementsByTagName("div")[1].innerHTML = solarTerm;
        }

        //
        if(theDay.getDate() == j+1)
        {
            allLi[offset + j + firstDayWeek].style.backgroundColor = "#CD0000";
            allLi[offset + j + firstDayWeek].style.borderRadius = "5px";
        }
    }

    //刷新下个月显示
    for (var k = 0; k < allLi.length - offset - firstDayWeek - monthDays; k++)
    {
        allLi[offset + k + firstDayWeek + monthDays].getElementsByTagName("div")[0].innerHTML = k + 1;
        //后一个月的日期设置颜色透明度
        allLi[offset + k + firstDayWeek + monthDays].style.opacity="0.7";
        var dateArray3 = [];
        if (theDay.getMonth() == 11)
        {
            dateArray3.push(k + 1);
            solarDay = k + 1;
            dateArray3.push(0);
            solarMonth = 0;
            dateArray3.push(theDay.getFullYear() + 1);
            solarYear = theDay.getFullYear() + 1;
        }
        else
        {
            dateArray3.push(k + 1);
            solarDay = k + 1;
            dateArray3.push(theDay.getMonth() + 1);
            solarMonth = theDay.getMonth() + 1;
            dateArray3.push(theDay.getFullYear());
            solarYear = theDay.getFullYear();
        }

        //转为农历日期
        lunarDate = toLunarDate(solarYear, solarMonth, solarDay).split(" ");
        lunarYear = lunarDate[0];
        lunarMonth = lunarDate[1];
        lunarDay = lunarDate[2];
        isLeap = lunarDate[3];

        //date 存放公历日期 lunarDate存放农历日期
        allLi[offset + k + firstDayWeek + monthDays].setAttribute("date", dateArray3.toString());
        allLi[offset + k + firstDayWeek + monthDays].setAttribute("lunarDate", toLunarView(lunarYear, lunarMonth, lunarDay,isLeap));

        //写入农历日期
        allLi[offset + k + firstDayWeek + monthDays].getElementsByTagName("div")[1].innerHTML = toLunarView(lunarYear, lunarMonth, lunarDay,isLeap).split(" ")[2];
        //若有节日则将农历转换为节日
        showHoliday(offset + k + firstDayWeek + monthDays, solarMonth, solarDay, lunarMonth, lunarDay);

        //显示节气
        solarTerm = showSolarTerms(new Date(solarYear, solarMonth, solarDay));
        if (solarTerm != null)
        {
            allLi[offset + k + firstDayWeek + monthDays].getElementsByTagName("div")[1].innerHTML = solarTerm;
        }

    }

    //移入具体日期显示手型选择
    for (i = 0; i < allLi.length; i++)
    {
        allLi[i].style.cursor = "pointer";
    }

    //将当前的显示的日期存入span中
    var allSpan = document.getElementById("dateBar").getElementsByTagName("span");

    for (var tmp = 0; tmp < allSpan.length; tmp++)
    {
        var dateArray = [];
        dateArray.push(theDay.getDate());
        dateArray.push(theDay.getMonth());
        dateArray.push(theDay.getFullYear());
        allSpan[tmp].setAttribute("date", dateArray.toString());
        allSpan[tmp].style.cursor = "pointer";//移过左右切换以及date切换时显示手型选择
    }

    //显示年月
    document.getElementById("dateBarText").innerHTML = theDay.getFullYear() + "年" + (theDay.getMonth() + 1) + "月";

    //传入当天日期传出节日
    function showHoliday(index, monthOfSolar, DayOfSolar, monthOfLunar, DayOfLunar)
    {
        for (q = 0; q < holiday.length; q++)
        {
            if ((holiday[q][0].split(".")[0] == (monthOfSolar + 1) && (holiday[q][0].split(".")[1] == DayOfSolar)))
            {
                allLi[index].getElementsByTagName("div")[1].innerHTML = holiday[q][1];
            }
        }
        for (q = 0; q < festival.length; q++)
        {
            if ((festival[q][0].split(".")[0] == monthOfLunar) && (festival[q][0].split(".")[1] == DayOfLunar))
            {
                allLi[index].getElementsByTagName("div")[1].innerHTML = festival[q][1];
            }
        }
    }
}

//点击更新日历
function changeTheDayView(li)
{
    var date = li.getAttribute("date");
    var dateArray = date.split(",");//按照年月日分开
    var curDay = new Date(dateArray.pop(), dateArray.pop(), dateArray.pop());
    //先清除之前的样式
    var allLi = document.getElementById("dateDayContent").getElementsByTagName("li");
    //刷新透明度为1
    for(var i =0;i<allLi.length;i++)
    {
        allLi[i].style.backgroundColor="#F9243F";
    }
    showTheDayView(curDay);
}

//点击上方右边按钮直接跳转到下月
function showNextMonth(span)
{
    var dateArray = span.getAttribute("date").split(",");
    var curDay = new Date(dateArray.pop(), dateArray.pop(), dateArray.pop());
    //先清除之前的样式
    var allLi = document.getElementById("dateDayContent").getElementsByTagName("li");
    //刷新透明度为1
    for(var i =0;i<allLi.length;i++)
    {
        allLi[i].style.backgroundColor="#F9243F";
    }
    showTheDayView(getNextMonthFirstDay(curDay));
}

//点击上方左边按钮直接跳转到上月
function showPrevMonth(span)
{
    var dateArray = span.getAttribute("date").split(",");
    var curDay = new Date(dateArray.pop(), dateArray.pop(), dateArray.pop());
    //先清除之前的样式
    var allLi = document.getElementById("dateDayContent").getElementsByTagName("li");
    //刷新透明度为1
    for(var i =0;i<allLi.length;i++)
    {
        allLi[i].style.backgroundColor="#F9243F";
    }
    showTheDayView(getPrevMonthFirstDay(curDay));
}

//点击上方右边按钮直接跳转到下一年
function showNextYear()
{
    var curYear = document.getElementById("yearBarText").innerHTML;
    document.getElementById("yearBarText").innerHTML = (parseInt(curYear) + 1).toString();
}

//点击上方左边按钮直接跳转到前一年
function showPrevYear()
{
    var curYear = document.getElementById("yearBarText").innerHTML;
    document.getElementById("yearBarText").innerHTML = (parseInt(curYear) - 1).toString();
}

//点击上方右边按钮直接跳转到下一个十年
function showNextDecadeYear()
{
    var curDecadeYear = document.getElementById("yearDecadeBarText").innerHTML;
    var array = curDecadeYear.split("-");
    document.getElementById("yearDecadeBarText").innerHTML = (parseInt(array[0]) + 10).toString() + "-" + (parseInt(array[1]) + 10).toString();
    var allYearLi = document.getElementById("dateYearContent").getElementsByTagName("li");
    for (var i = 0; i < allYearLi.length; i++)
    {
        allYearLi[i].innerHTML = parseInt(array[0]) + 10 + i;
    }
}

//点击上方左边按钮直接跳转到前一个十年
function showPrevDecadeYear()
{
    var curDecadeYear = document.getElementById("yearDecadeBarText").innerHTML;
    var array = curDecadeYear.split("-");
    document.getElementById("yearDecadeBarText").innerHTML = (parseInt(array[0]) - 10).toString() + "-" + (parseInt(array[1]) - 10).toString();
    var allYearLi = document.getElementById("dateYearContent").getElementsByTagName("li");
    for (var i = 0; i < allYearLi.length; i++)
    {
        allYearLi[i].innerHTML = parseInt(array[0]) - 10 + i;
    }
}

//点击日期切换到月份界面，可切换月份
function showMonthView(span)
{
    document.getElementById("dateDayContent").style.display = "none";
    document.getElementById("dateMonthContent").style.display = "block";
    var monthArray = span.getAttribute("date").split(",");
    document.getElementById("yearBarText").innerHTML = monthArray.pop();
    //移入具体月份显示手型选择
    var allLi = document.getElementById("dateMonthContent").getElementsByTagName("li");
    for (var i = 0; i < allLi.length; i++)
    {
        allLi[i].style.cursor = "pointer";
    }
    var allSpan = document.getElementById("yearBar").getElementsByTagName("span");
    for (var i = 0; i < allSpan.length; i++)
    {
        allSpan[i].style.cursor = "pointer";
    }
}

//点击年份切换到选择年的界面
function showYearView()
{
    document.getElementById("dateMonthContent").style.display = "none";
    document.getElementById("dateYearContent").style.display = "block";
    var curYear = document.getElementById("yearBarText").innerHTML;
    //取得这个decade的第一年
    var beginYear = parseInt(curYear.substring(0, 3)) * 10;
    //加9则为这个decade的最后一年
    var endYear = beginYear + 9;
    var allYearLi = document.getElementById("dateYearContent").getElementsByTagName("li");
    document.getElementById("yearDecadeBarText").innerHTML = beginYear + "-" + endYear;
    //移入具体年份显示手型选择
    for (var i = 0; i < allYearLi.length; i++)
    {
        allYearLi[i].innerHTML = beginYear - 1 + i;
        allYearLi[i].style.cursor = "pointer";
    }
    var allSpan = document.getElementById("yearDecadeBar").getElementsByTagName("span");
    for (var i = 0; i < allSpan.length; i++)
    {
        allSpan[i].style.cursor = "pointer";
    }
    //当前decade的前一年后一年透明度为0.6
    allYearLi[0].style.opacity = "0.6";
    allYearLi[11].style.opacity = "0.6";
}

//选择年份
function selectYear(li)
{
    document.getElementById("dateYearContent").style.display = "none";
    document.getElementById("dateMonthContent").style.display = "block";
    document.getElementById("yearBarText").innerHTML = li.innerHTML;
}
//选择月份
function selectMonth(li)
{
    document.getElementById("dateMonthContent").style.display = "none";
    document.getElementById("dateDayContent").style.display = "block";
    //document.getElementById("yearBarText").innerHTML=li.innerHTML;
    var curDate = new Date(document.getElementById("yearBarText").innerHTML, li.innerHTML - 1, 1);
    //先清除之前的样式
    var allLi = document.getElementById("dateDayContent").getElementsByTagName("li");
    //刷新透明度为1
    for(var i =0;i<allLi.length;i++)
    {
        allLi[i].style.backgroundColor="#F9243F";
    }
    showTheDayView(curDate);
}

/*
 * 返回是否为节气
 * */

function showSolarTerms(theDay)
{
    var year = theDay.getFullYear();
    var month = theDay.getMonth();
    if(theDay.getDate() == solarTermDays[year-1950][1][month*2])
    {
        return solarTerms[month*2];
    }
    if(theDay.getDate() == solarTermDays[year-1950][1][month*2+1])
    {
        return solarTerms[month*2+1];
    }
}

/*
 * 农历
 * 数据在lunarData.js中
 * lunarData[][]中第一项为农历年份，
 * 第二项是当年闰月天数，若无闰月则为0
 * 第三项是当年十二个月每月天数
 * 第四项是当年哪个月是闰月，若无闰月则为0
 * 基于1950年02月17日对应农历1950年正月初一
 * */

//得到农历year年总天数(包括闰月天数)
function lunarDaysOfYear(year)
{
    var yearOfIndex = year - 1950;
    var yearDays = 0;
    for (var i = 0; i < 12; i++)
    {
        yearDays = yearDays + lunarData[yearOfIndex][2][i];
    }
    if (lunarDaysOfYearLeap(year) != 0)
    {
        yearDays = yearDays + lunarDaysOfYearLeap(year);
    }
    return yearDays;
}

//得到农历year年闰月的天数，若无闰月返回0
function lunarDaysOfYearLeap(year)
{
    var yearOfIndex = year - 1950;
    return lunarData[yearOfIndex][1];
}

//得到农历year年闰哪个月，若无闰月返回0
function lunarLeapMonthOfYear(year)
{
    var yearOfIndex = year - 1950;
    return lunarData[yearOfIndex][3];
}

//得到农历year年month月的天数
function lunarMonthDaysOfYear(year, month)
{
    var yearOfIndex = year - 1950;
    return lunarData[yearOfIndex][2][month - 1];
}

//格式化为农历显示
function toLunarView(year, month, day,isleap)
{
    var dayWord = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    var monthWord = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"];
    var endNum = day % 10;
    if (day <= 10)
    {
        if (endNum == 0)
        {
            return (year + "年" + " " + monthWord[month - 1] + "月" + " " + "初十");
        }
        //如果是初一显示这个月是大月还是小月,若为闰月则前面加闰字
        if (day == 1)
        {
            if (lunarMonthDaysOfYear(year, month) == 29)
            {
                if(isleap == "false")
                 {
                     return (year + "年" + " " + monthWord[month - 1] + "月" + " " + monthWord[month - 1] + "月小" );
                 }
                 if(isleap =="true")
                 {
                 return (year + "年" + " " + monthWord[month - 1] + "月" + " "+"闰" + monthWord[month - 1] + "月小" );
                 }
            }
            else if (lunarMonthDaysOfYear(year, month) == 30)
            {
                if(isleap == "false")
                 {
                     return (year + "年" + " " + monthWord[month - 1] + "月" + " " + monthWord[month - 1] + "月大" );
                 }
                 if(isleap =="true")
                 {
                 return (year + "年" + " " + monthWord[month - 1] + "月" + " " +"闰" + monthWord[month - 1] + "月大" );
                 }
            }
        }
        else
        {
            return (year + "年" + " " + monthWord[month - 1] + "月" + " " + "初" + dayWord[endNum - 1]);
        }
    }
    else if (day <= 20)
    {
        if (endNum == 0)
        {
            return (year + "年" + " " + monthWord[month - 1] + "月" + " " + "廿十");
        }
        else
        {
            return (year + "年" + " " + monthWord[month - 1] + "月" + " " + "十" + dayWord[endNum - 1]);
        }
    }
    else
    {
        if (endNum == 0)
        {
            return (year + "年" + " " + monthWord[month - 1] + "月" + " " + "三十");
        }
        else
        {
            return (year + "年" + " " + monthWord[month - 1] + "月" + " " + "廿" + dayWord[endNum - 1]);
        }
    }
}

//将公历日期与农历日期对应
//month从0开始
function toLunarDate(year, month, day)
{
    /*
     * 基于1950年02月17日对应农历1950年正月初一
     * */
    var baseDate = new Date(1950, 1, 17);
    var curDate = new Date(year, month, day);
    var dayOfOffset = (curDate - baseDate) / 1000 / 60 / 60 / 24;

    var yearOfOffset = 0;//与1950年相差多少年
    var monthOfOffset;

    var baseYear = 1950;
    var i;//循环变量声明
    //减去每年的天数
    for (i = 0; dayOfOffset > 0; i++)
    {
        //减去从1950年开始农历每年的天数,以及该年闰月天数
        dayOfOffset = dayOfOffset - lunarDaysOfYear(baseYear);
        baseYear++;//baseYear每次后移一年
        yearOfOffset++;
    }

    //当dayOfOffset为负，要退回到前一年，将dayOfOffset矫正为正数
    if (dayOfOffset < 0)
    {
        yearOfOffset--;
        //加回多减的那一年天数
        baseYear--;
        dayOfOffset = dayOfOffset + lunarDaysOfYear(baseYear);

    }

    var leapMonth = lunarLeapMonthOfYear(baseYear);

    //减去每月的天数
    var isLeapMonth = false;//当前月份是不是闰月
    var leapMonthPass = false;//用来标记闰月有没有被减过
    for (monthOfOffset = 1; dayOfOffset > 0; monthOfOffset++)
    {
        //减去每月天数
        if (isLeapMonth == true)
        {
            dayOfOffset = dayOfOffset - lunarDaysOfYearLeap(baseYear);
            isLeapMonth = false;
            leapMonthPass = true;//标记闰月已经被减过
        }
        else
        {
            dayOfOffset = dayOfOffset - lunarMonthDaysOfYear(baseYear, monthOfOffset);
        }

        //当月是闰月，且闰月没有过
        if ((monthOfOffset == leapMonth) && (leapMonthPass == false))
        {
            isLeapMonth = true;//当前月份是闰月，将标记置为true
            //并且回退monthOfOffset,即下次计算本月非闰月的天数
            monthOfOffset--;
        }
    }

    if (dayOfOffset < 0)
    {
        if ((leapMonth != 0) && (monthOfOffset == leapMonth + 1))
        {//如果上一个月是闰月<后一个月>
            monthOfOffset--;
            dayOfOffset = dayOfOffset + lunarDaysOfYearLeap(baseYear);
        }
        else if ((leapMonth != 0) && (monthOfOffset == leapMonth) && isLeapMonth)
        {//如果上一个月是闰月<前一个月>
            dayOfOffset = dayOfOffset + lunarMonthDaysOfYear(baseYear, monthOfOffset);
        }
        else
        {
            monthOfOffset--;
            dayOfOffset = dayOfOffset + lunarMonthDaysOfYear(baseYear, monthOfOffset);
        }
    }
    if (monthOfOffset == leapMonth && leapMonthPass)
    {
        //true标志这个月是闰月
        return ((yearOfOffset + 1950) + " " + monthOfOffset + " " + (dayOfOffset + 1) + " " + "true");
    }
    else
    {
        //false标志这个月不是闰月
        return ((yearOfOffset + 1950) + " " + monthOfOffset + " " + (dayOfOffset + 1)+ " " + "false");
    }
}

//绑定年份点击事件
var yearList = document.getElementById("dateYearContent");
yearList.onclick=function(event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    if(target.nodeName.toLowerCase() == "li")
    {
        selectYear(target);
    }
};
//绑定月份点击事件
var monthList = document.getElementById("dateMonthContent");
monthList.onclick=function(event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    if(target.nodeName.toLowerCase() == "li")
    {
        selectMonth(target);
    }
};
//绑定具体日期点击事件
var dayList = document.getElementById("dateDayContent");
dayList.onclick=function(event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    if(target.nodeName.toLowerCase() == "li")
    {
        changeTheDayView(target);
    }
    //判断内部元素若是div则触发他的父节点li的changeTheDayView事件
    if(target.nodeName.toLowerCase() == "div")
    {
        changeTheDayView(target.parentNode);
    }
};


















