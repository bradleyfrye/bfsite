var formCommentHtml = function(name,text,number){
    return "<div id='"+number+"c' class=comment><div id='"+number+"n' class=commentName>"+name+"</div><div id='"+number+"t' class=commentText>"+text+"</div></div>";
};


$(document).ready(function(){
    
    var $button = $("#commentSubmit");
    var $name = $("#commentName");
    var $text = $("#commentText");
    $name.val("");
    $text.val("");
    var name;
    var text;
    
    $button.click(function(){
        
        name = $name.val();
        text = $text.val();
        
        if(name.length > 25){
            alert("That's a pretty long name.  Could you try keeping it to 25 or less characters please?");
            return;
        }
        if(text.length > 2000){
            alert("Your post is > 2000 characters! Make it shorter!");
            return;
        }
        
        var $ct = $("#ct");
        var count = $ct.html(); // current count, not counting new comment
        var page = Math.floor(count/10)+1; // page for new comment to go on
        
        if(count % 10 === 0){
            // This post creates a new page
            var $commentsWrapper = $("#commentsWrapper");
            var pageHtml = "<div id=page"+page+"></div>";
            $commentsWrapper.append(pageHtml);
        }
        
        var commentHtml = formCommentHtml(name,text,count+1);
        $("#page"+page).append(commentHtml);
        // increment comment count
        $ct.html(parseInt(count)+1);
    });
});
