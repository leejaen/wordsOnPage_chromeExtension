//��д�²��ʱ������Optionsҳ�汨���´���Refused to execute inline script because of Content-Security-Policy����֮ǰ��д�Ĳ��������Popupҳ�棬����û�����������������⣬����Optionsҳ���Ȩ���ƺ��Ǹ��˺ܶ࣬�����෽���ң�����������¡�//�������������Chrome��Content Security Policy(CSP)����Ҫ��Chrome��ּ������޸�//��Javascript���͵�һ��������js�ļ��У�options.html������ļ�//��addEventListener�ķ�ʽΪhtml�ؼ�������Ӧ�¼�//����ʹ��eval������setTimeout�У���һ������Ӧ���Ǻ���ָ�룬���������ַ���

$(function ()
{
    $("#customizeDictionary").val(localStorage.customizeDictionary);
    if (localStorage.dictionary == "customizeDictionary")
    {//�û��Զ���ʵ�
        $("#customer").addClass("select");
    }
    if (localStorage.color != "undefined" && localStorage.color != undefined)//�û�����������ɫ
    { $(".option[value='" + localStorage.color + "']").addClass("select"); }
    else
    { $(".option[text='color']:first-child").addClass("select"); localStorage.color = " "; }
    if (localStorage.animation != "undefined" && localStorage.animation != undefined)//�û����ö���Ч��
    { $(".option[value='" + localStorage.animation + "']").addClass("select"); }
    else
    { $(".option[text='animation'][value='fadeIn,fadeOut']").addClass("select"); localStorage.animation = "fadeIn,fadeOut"; }
    if (localStorage.duration != "undefined" && localStorage.duration != undefined)//�û���������ʱ��
    { $(".option[value='" + localStorage.duration + "']").addClass("select"); }
    else
    { $(".option[text='duration'][value='13,3']").addClass("select"); localStorage.duration = "13,3"; }
    if (localStorage.isFixed != "undefined" && localStorage.isFixed != undefined)//�û�����������
    { $(".option[value='" + localStorage.isFixed + "']").addClass("select"); }
    else
    { $(".option[text='isFixed'][value='fixed']").addClass("select"); localStorage.isFixed = "fixed"; localStorage.Positionx="auto";localStorage.Positiony = "100px";}
    if (localStorage.dictionary != "undefined" && localStorage.dictionary != undefined)//�û�ʹ�ôʵ�
    {
        $(".option[value='" + localStorage.dictionary + "']").addClass("select");
		if(localStorage.dictionary=="customizeDictionary"){
				$("#customizeDictionary").show("300").focus();}
        if ((localStorage.dictionary).lastIndexOf('13505') >= 0)//�飺�챦�����ɣ��и�����˼������
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
    //$("#customizeDictionary").live("keyup", function () { $("#customer").html("�Զ����ֵ䣨ÿ��һ������"+($("#customizeDictionary").val().split("\n").length)+"��");});
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
            alert("�Զ����ֵ��ʽ�����Ϲ涨�����顣");
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
    //����
    $("#Button1").live("click", function ()
    {
        if (window.confirm("���ƺ������������ݽ���ԭ���Զ����ֵ�ᱻ��գ�ȷ���������ã�"))
        {
            localStorage.clear(); localStorage.opacityValue = "0.9"; location.replace(location.href);
        }
    });
    //ѡ��
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