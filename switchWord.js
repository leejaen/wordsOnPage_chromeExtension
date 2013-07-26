
(function ()
{
    var profile = [];
    var intervalFun = null;
    var timeoutFun = null;
    var startupTime = 3000;
    chrome.extension.sendRequest({ method: "getProfile" }, function (response)
    {//发起请求，获取基本配置
        profile = response.data; //console.log(profile);
        if (!profile)
        {
            $("body").prepend('<div class="monsterFixed animate" style="background-color:transparent; border:0px"><div id="monsterCage" class="monsterCage" style=\"opacity:1\">配置异常，请配置插件选项</div></div>');
            return false;
        }
        var imgURL = chrome.extension.getURL("icon100.png");
        var playImgURL = chrome.extension.getURL("play.png");
        var movingImgURL = chrome.extension.getURL("moving.png");//使用页面的资源文件一定要在manifest文件存储在web_accessible_resources属性中
        //var monster = '<div class="monsterFixed animate ' + profile[1].split(',')[0] + '" id="monsterW" style="background-color:transparent; border:0px"><div id="monsterCage" class="monsterCage' + profile[0] + '" style=\"opacity:' + profile[4] + '\"><img src="' + imgURL + '" style="width:32px;height:32px;border:0px;" />START!</div><div style="position:absolute;width:100%;top:25px !important;text-align: center !important;font-size: 11px !important;height: 18px !important;opacity:' + profile[4] + '" id="wordTitleBar"><span style="pointer-events:auto;cursor:move;background-image:url(' + movingImgURL + ');width:100px;background-position:center;background-repeat:no-repeat;display:inline-block;height:16px;" id="drag"></span></div></div>';//<a href="javascript:void(0);" id="playBtn">播放</a>
        var monster = '<div class="monsterFixed animate ' + profile[1].split(',')[0] + '" id="monsterW" style="background-color:transparent; border:0px"><div id="monsterCage" class="monsterCage' + profile[0] + '" style=\"opacity:' + profile[4] + '\">' + ((profile[8] == "") ? ("start") : (profile[8])) + '</div><div style="position:absolute;width:100%;top:25px !important;text-align: center !important;font-size: 11px !important;height: 18px !important;opacity:' + profile[4] + '" id="wordTitleBar"><span style="pointer-events:auto;cursor:move;background-image:url(' + movingImgURL + ');width:100px;background-position:center;background-repeat:no-repeat;display:inline-block;height:16px;" id="drag"></span></div></div>';//<a href="javascript:void(0);" id="playBtn">播放</a>
        $("body").prepend(monster);//必须使用jquery的prepend方法，否则使用setTimeout(function () { document.body.innerHTML += monster; }, 5000);会更改页面的DOM元素导致网页出现找不到自己元素的错误，如百度的智能感知
        if (profile[5] == "fixed")
        {//固定位置
            $("#monsterW").removeClass("monsterFollowed").addClass("monsterFixed");
            $("#monsterW").css({ top: profile[7], left: profile[6] });
            //moving div
            var _move = false;//移动标记 
            var _x, _y;//鼠标离控件左上角的相对位置 
            var timeoutFun = null;
            $("#drag").mousedown(function (e)
            {
                _move = true;
                var wleft = $("#monsterW").css("left");
                if (wleft == "auto")
                {
                    _x = e.pageX;
                }
                else
                {
                    _x = e.pageX - parseInt($("#monsterW").css("left"));
                }
                _y = e.pageY - parseInt($("#monsterW").css("top"));
            }).mouseup(function ()
            {//记录坐标
                clearTimeout(timeoutFun);
                timeoutFun = setTimeout(function ()
                {
                    chrome.extension.sendRequest({ method: "SetPosition", x: $("#monsterW").css("left"), y: $("#monsterW").css("top") }, function (response) { });
                }, 100);
            });
            $(document).mousemove(function (e)
            {
                if (_move == true)
                {
                    var x = e.pageX - _x;                                  //移动时根据鼠标位置计算控件左上角的绝对位置 
                    var y = e.pageY - _y;
                    $("#monsterW").css({ top: y, left: x });               //控件新位置 
                }
            }).mouseup(function ()
            {
                _move = false;
            });
        }
        else if (profile[5] == "follow")
        {//鼠标跟随
            $("#monsterW").removeClass("monsterFixed").addClass("monsterFollowed");
            $("body").live("mousemove", function (e)
            {
                var newP = { left: e.pageX - (420 + 210), top: e.pageY - 23 };//根据鼠标位置计算div的位置
                $("#monsterW").offset(newP);
            });
        }



        function grabWord()
        {//循环显示下一条单词
            /*setTimeout(function ()
            {//改成0，下面判断以后好用配置
                startupTime = 0;
            }, 2000);*/
            document.getElementById("monsterW").className = "monsterFixed animate " + profile[1].split(',')[1];//后段动画
            timeoutFun = setTimeout(function ()
            {
                document.getElementById("monsterW").className = "monsterFixed animate " + profile[1].split(',')[0];//前段动画
                (function ()
                {
                    chrome.extension.sendRequest({ method: "getANewWord", key: "status" }, function (response)
                    {
                        if (response.data != undefined && response.data != "")
                        {
                            var pronunciation = "", result = "";
                            result = response.data.replace(/<[^>]+>/g, "");//所有的html标记
                            ["adj.", "adv.", "n.", "v.", "prep.", "conj.", "vi.", "vt.", "aux.", "a.", "ad.", "num.", "int.", "u.", "c.", "pl."].forEach(function (abbr) { result = result.replace(abbr, ''); });//词性
                            result = result.replace(/[^a-zA-Z ]/g, '')//非英文字符
                            if (result.length > 0 && result.length < 50)
                            {
                                pronunciation = "<span><a href='http://zh.forvo.com/search/" + result + "/'target='pronunciation' style='pointer-events: auto; margin-top:2px;' title='真人发音'><img src='" + playImgURL + "'></a></span>";
                            }//发音链接
                            document.getElementById("monsterCage").innerHTML = response.data + pronunciation;//显示查找到的单词
                        } else
                        {
                            document.getElementById("monsterCage").innerHTML = "选项配置错误或取到数据为空";
                        }
                        document.getElementById("monsterCage").style.opacity = response.opacity;
                        document.getElementById("wordTitleBar").style.opacity = response.opacity;
                        $("#monsterW").css({ top: response.poy, left: response.pox });
                    });
                })();
            }, profile[2].split(',')[1] + "000");
        }


        //实现只有激活时候才运行插件
        var getHiddenProp = function ()
        {
            return 'hidden' in document ? 'hidden' : function ()
            {
                var r = null;

                ['webkit', 'moz', 'ms', 'o'].forEach(function (prefix)
                {
                    if ((prefix + 'Hidden') in document)
                    {
                        return r = prefix + 'Hidden';
                    }
                });

                return r;
            }();
        }
        var getprevword = function ()
        {
            chrome.extension.sendRequest({ method: "getprevword" }, function (response)
            {
                if (response.word != undefined && response.word != "")
                {
                    var pronunciation = "", result = "";
                    result = response.word.replace(/<[^>]+>/g, "");//所有的html标记
                    ["adj.", "adv.", " n.", " v.", "prep.", "conj.", "vi.", "vt.", "aux.", " a.", "ad.", "num.", "int.", " u.", " c.", "pl."].forEach(function (abbr) { result = result.replace(abbr, ''); });//词性
                    result = result.replace(/[^a-zA-Z ]/g, '')//非英文字符
                    if (result.length > 0 && result.length < 50)
                    {
                        pronunciation = "<span><a href='http://zh.forvo.com/search/" + result + "/'target='pronunciation' style='pointer-events: auto; margin-top:2px;' title='真人发音'><img src='" + playImgURL + "'></a></span>";
                    }//发音链接
                    document.getElementById("monsterCage").innerHTML = response.word + pronunciation;//显示查找到的单词
                }
                else
                {
                    document.getElementById("monsterCage").innerHTML = "选项配置错误或取到数据为空";
                }
                $("#monsterW").css({ top: response.poy, left: response.pox });
            });
        }
        var hiddenProp = getHiddenProp();
        var getVisibilityState = function ()
        {
            return hiddenProp ? document['webkitVisibilityState'] : hiddenProp;//webkitVisibilityState区分大小写
        }
        document.addEventListener('webkitvisibilitychange', function onVisibilityChange(e)
        {
            //alert("asdfa");
            //实现只有激活时候才运行插件      本函数里可千万不能写上alert()，alert一开始执行就要激活，激活就进本函数……
            var state = getVisibilityState();
            //state can be one of 'hidden, visible, prerender, unloaded'
            //if (state === 'hidden')
            //{
            clearInterval(intervalFun);
            clearTimeout(timeoutFun);
            //} else 
            if (state === 'visible')
            {
                getprevword();
                intervalFun = setInterval(function ()
                {
                    grabWord();
                    //console.log(profile[2].split(',')[0]);
                }, (profile[2].split(',')[0]) + "000");
            }
        });
        intervalFun = setInterval(function ()
        {
            grabWord();
        }, (profile[2].split(',')[0]) + "000");
    });
})();