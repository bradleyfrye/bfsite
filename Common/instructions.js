$(document).ready(function(){
    // click listener - bring instructions div up/down, change arrow direction
    $("#instTitle").click(function(){
        $("#instructions").slideToggle();
        var $inst = $("#instTitle");
        var html = $inst.html();
        if(html.contains("\u25BC")){html = html.replace("\u25BC","\u25B2");}
        else{html = html.replace("\u25B2","\u25BC");}
        $inst.html(html);
    });
});
