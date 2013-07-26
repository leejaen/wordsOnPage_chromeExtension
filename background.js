// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var min = 0;
var max = 10;
var current = (function ()
{//获取上一次记录的透明度值
    if (localStorage.opacityValue == "" || localStorage.opacityValue == null || localStorage.opacityValue == undefined || localStorage.opacityValue == NaN)
    {
        return 9;
    }
    else
    {
        return parseFloat(localStorage.opacityValue) * 10;
    }
})();
function updateIcon()
{
    chrome.browserAction.setIcon({ path: "icon" + current + ".png" });//切换图标
    chrome.browserAction.setBadgeText({ text: String(current) });//提示透明度文字
    localStorage.opacityValue = parseInt(current) / 10;
    chrome.tabs.executeScript(null, { code: "eval(\"document.getElementById('wordTitleBar').style.opacity = " + localStorage.opacityValue + ";document.getElementById('monsterCage').style.opacity = " + localStorage.opacityValue + ";\");" });
    //点击图标即时调整透明度//chrome.tabs.executeScript(null, {file: "content_script.js"});

    current++;
    if (current > max)
    {
        current = min;
    }
}

chrome.browserAction.onClicked.addListener(updateIcon);//添加监听事件
updateIcon();
function checkLength(strTemp)
{
    return strTemp.replace(/[^\x00-\xff]/g, 'xx').length;
}
chrome.extension.onRequest.addListener(function (request, sender, sendResponse)
{//返回请求数据
    var getDic = getDictionary;//多次调用getDictionary使用函数别名getDic减少调用范围链的跳转，提高性能
    if (request.method == "getANewWord")
    {
        //console.log("getANewWord");
        getDictionary();
        var i = parseInt(Math.random() * (wordlist.length));//parseInt(Math.random() * (上限 - 下限 + 1) + 下限);//获取从x到y之间的随机数算法
        var t = wordlist[i] + "";
        if (t.lastIndexOf("<br") > 0 || checkLength(t) >= 53)
        {//针对本词典做特殊处理：左对齐
            var div = "<div style=\"text-align:left;\">" + t + "</div>";
        }
        else
        {
            div = t;
            localStorage.preword = t;
        }
        sendResponse({
            data: div//单词
            , opacity: localStorage.opacityValue//透明度设置
            , pox: localStorage.Positionx//x坐标
            , poy: localStorage.Positiony//y坐标
        });
    }
    else if (request.method == "getProfile")
    {
        //console.log("getProfile");
        //颜色设置成undefined后不能返回undefined 空格解决class属性问题，localStorage对象存储的数据都是string类型
        localStorage.color = localStorage.color == "undefined" ? " " : localStorage.color;
        sendResponse({
            data: [localStorage.color == " " ? "" : localStorage.color//颜色样式，option页面存储
                , localStorage.animation ? localStorage.animation : "fadeIn,fadeOut"//动画样式，option页面存储
                , localStorage.duration ? localStorage.duration : "13,3"//时间设置，option页面存储
                , localStorage.dictionary ? localStorage.dictionary : "ielts"//字典设置，option页面存储
                , localStorage.opacityValue ? localStorage.opacityValue : "0.9"//透明度，本文件updateIcon()操作，用于打开浏览器（网页）时立即读取上次设置的透明度
                , localStorage.isFixed ? localStorage.isFixed : "fixed"//鼠标跟随
                , localStorage.Positionx ? localStorage.Positionx : "auto"//x坐标
                , localStorage.Positiony ? localStorage.Positiony : "100px"
                , localStorage.preword]//y坐标
        });
    }
    else if (request.method == "getprevword")
    {
        sendResponse({
            word: localStorage.preword
            , pox: localStorage.Positionx ? localStorage.Positionx : "auto"//x坐标
            , poy: localStorage.Positiony ? localStorage.Positiony : "100px"
        });
    }
    else if (request.method == "SetPosition")
    {
        localStorage.Positionx = request.x;
        localStorage.Positiony = request.y;
    }
    else
    {
        sendResponse({}); // snub them.
    }
});
////////////////////////////