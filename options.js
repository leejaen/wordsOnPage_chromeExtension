//在写新插件时，发现Options页面报如下错误“Refused to execute inline script because of Content-Security-Policy”，之前所写的插件都是用Popup页面，从来没有遇到过这样的问题，看来Options页面的权限似乎是高了很多，经过多方查找，解决方案如下。//该问题的起因是Chrome的Content Security Policy(CSP)，需要按Chrome的旨意进行修改//将Javascript移送到一个独立的js文件中，options.html引入该文件//以addEventListener的方式为html控件定义响应事件//避免使用eval，包括setTimeout中，第一个参数应该是函数指针，而不能是字符串

$(function ()
{
    $("#customizeDictionary").val(localStorage.customizeDictionary);
    if (localStorage.dictionary == "customizeDictionary")
    {//用户自定义词典
        $("#customer").addClass("select");
    }
    if (localStorage.color != "undefined" && localStorage.color != undefined)//用户设置主题颜色
    { $(".option[value='" + localStorage.color + "']").addClass("select"); }
    else
    { $(".option[text='color']:first-child").addClass("select"); localStorage.color = " "; }
    if (localStorage.animation != "undefined" && localStorage.animation != undefined)//用户设置动画效果
    { $(".option[value='" + localStorage.animation + "']").addClass("select"); }
    else
    { $(".option[text='animation'][value='fadeIn,fadeOut']").addClass("select"); localStorage.animation = "fadeIn,fadeOut"; }
    if (localStorage.duration != "undefined" && localStorage.duration != undefined)//用户设置主题时间
    { $(".option[value='" + localStorage.duration + "']").addClass("select"); }
    else
    { $(".option[text='duration'][value='13,3']").addClass("select"); localStorage.duration = "13,3"; }
    if (localStorage.isFixed != "undefined" && localStorage.isFixed != undefined)//用户设置鼠标跟随
    { $(".option[value='" + localStorage.isFixed + "']").addClass("select"); }
    else
    { $(".option[text='isFixed'][value='fixed']").addClass("select"); localStorage.isFixed = "fixed"; localStorage.Positionx="auto";localStorage.Positiony = "100px";}
    if (localStorage.dictionary != "undefined" && localStorage.dictionary != undefined)//用户使用词典
    {
        $(".option[value='" + localStorage.dictionary + "']").addClass("select");
		if(localStorage.dictionary=="customizeDictionary"){
				$("#customizeDictionary").show("300").focus();}
        if ((localStorage.dictionary).lastIndexOf('13505') >= 0)//组：红宝，巴郎，托福，雅思，考研
        {
            $("fieldset").removeClass("maxHeight").addClass("minHeight");
            $("#ieltsListeningViews").removeClass("minHeight").addClass("maxHeight");
        }
    }
    else
    {
        $(".option[text='dictionary'][value='ielts']").addClass("select");
        localStorage.dictionary = "ielts";
    }
    //$("#customizeDictionary").live("focus", function () { setTimeout(function () { $("#customizeDictionary").select(); }, 100); });
    //$("#customizeDictionary").live("keyup", function () { $("#customer").html("自定义字典（每行一条）共"+($("#customizeDictionary").val().split("\n").length)+"条");});
    $("#customizeDictionary").live("blur", function ()
    {
        localStorage.customizeDictionary = $(this).val();
        try
        {
            if (localStorage.customizeDictionary == "" || localStorage.customizeDictionary == "null" || localStorage.customizeDictionary == "undefined")
            {
                return false;
            }
            localStorage.customizeDictionary.split(",");
            localStorage.dictionary = $(this).attr("id");
            $(".option").each(function () { if ($(this).attr("text") == "dictionary") { $(this).removeClass("select"); } });
            $("#customer").addClass("select");
            getDictionary();
        }
        catch (e)
        {
            alert("自定义字典格式不符合规定，请检查。");
        }
    });
    $("#ieltsListeningViewsTitle").live("click", function ()
    {
        $("#ieltsListeningViewsTitle").toggle(function ()
        {
            $("fieldset").removeClass("maxHeight").addClass("minHeight");
            $("#ieltsListeningViews").removeClass("maxHeight").addClass("minHeight");
        }, function ()
        {
            $("fieldset").removeClass("maxHeight").addClass("minHeight");
            $("#ieltsListeningViews").removeClass("minHeight").addClass("maxHeight");
        });
    });
    //重置
    $("#Button1").live("click", function ()
    {
        if (window.confirm("重制后所有配置数据将还原，自定义字典会被清空，确定继续重置？"))
        {
            localStorage.clear(); localStorage.opacityValue = "0.9"; location.replace(location.href);
        }
    });
    //选择
    $(".option").live("click", function ()
    {
        var text = $(this).attr("text");
        var id = $(this).attr("id");
        $(".option").each(function () { if ($(this).attr("text") == text) { $(this).removeClass("select"); } });
        $(this).addClass("select");
        switch (text)
        {
            case "color":
                localStorage.color = $(this).attr("value");
                break;
            case "animation":
                localStorage.animation = $(this).attr("value");
                break;
            case "duration":
                localStorage.duration = $(this).attr("value");
                break;
            case "isFixed":
                localStorage.isFixed = $(this).attr("value");
                break;
            case "dictionary":
                localStorage.dictionary = $(this).attr("value");
			if(id=="customer"){
				$("#customizeDictionary").show("300").focus();
			}else{
				$("#customizeDictionary").hide("300");
                getDictionary();
			}
                break;
        }
    });
});