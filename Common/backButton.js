// just a test file for now, will use "back button" adder for several pages

$(document).ready(function(){
    var html = "<a href='http://www.bradleyfrye.com'><div title='Back to main page' id=headerTab>&#x25C0</div></a>";
    var style = "<style type='text/css'>";
    style += "#headerTab{position:fixed;top:0px;left:10px;width:30px;color:black;border-left:2px solid black;border-right:2px solid black;border-bottom:2px solid black;border-bottom-left-radius:10px;border-bottom-right-radius:10px;text-align:center;cursor:pointer;}";
    style += "</style>";
    var $body = $("body");
    var $head = $("head");
    
    $body.append($(html));
    $head.append($(style));
});
