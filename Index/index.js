var Comments = function(){
    
    this.comments = [];
    this.count;
    this.commentHtml = []; // format - ([first10commentsHtml],[2nd10commentsHtml],etc)
    this.numPages;
    this.curPage = 1;

    var thisComments = this;

    this.init = function(response){
        var comAry = response.split(";");
        this.count = comAry.length;
        for(var i=0; i<this.count; i++){
            this.comments.push(comAry[i]);
        }
        this.comments.reverse(); // reverse order to put newest comments on top
    };
    // these should be refactored as function factories TODO
    this.getCommentID = function(index){
        return this.comments[index].split("|")[0]
    };
    this.getCommentText = function(index){
        return this.comments[index].split("|")[1];
    };
    this.getCommentUserID = function(index){
        return this.comments[index].split("|")[2];
    };
    this.getCommentUserName = function(index){
        return this.comments[index].split("|")[3];
    };
    this.getCommentAnonymous = function(index){
        return this.comments[index].split("|")[4];
    }
    this.getCommentTimestamp = function(index){
        return this.comments[index].split("|")[5];
    };

    this.addComment = function(id,text,user_id,user_name,anon,timestamp){
        var str = id+"|"+text+"|"+user_id+"|"+user_name+"|"+anon+"|"+timestamp;
        this.comments.unshift(str);
        this.count+=1;
    };

    this.removeComment = function(index){
        // if no index given, just pop value
        if(index == ""){
            this.comments.pop();
        }
        else{
            this.comments.splice(index,1);
        }
    };

    this.showComments = function(){
        var $commentsWrapper = $("#commentsWrapper");
        var $commentLinks = $("#commentLinks");
        var $count = $("#ct");

        $commentsWrapper.empty();
        $commentLinks.empty();
        this.commentHtml = [];
        
        $count.html(this.count); // update counter at bottom
        
        this.numPages = Math.floor((this.count - 1)/10) + 1;

        for(var i=1; i<=this.numPages; i++){
            var numComments = this.count >= 10*i ? 10 : this.count % 10;
            var html = "";
            for(var j=1; j<=numComments; j++){
                var index = (i-1)*10 + j - 1;
                html += this.formCommentHtml(this.getCommentID(index),this.getCommentText(index),this.getCommentUserName(index),this.getCommentTimestamp(index));
            }
            this.commentHtml.push(html);
        }

        for(var i=1; i<=this.commentHtml.length; i++){
            // append each chunk of 10 comments into their own div<page>, into commentWrapper
            var html = "<div id=page"+i;
            if(this.curPage == i){html += " class=selected";}
            else{html += " class=unselected";}
            html += ">";
            html += this.commentHtml[i-1];
            html += "</div>";

            $commentsWrapper.append(html);
        }
        
        for(var i=1; i<=this.numPages; i++){
            var html = "<span id=l"+i;
            if(i == this.curPage){html += " class=disabledLink";}
            else{html += " class=enabledLink";}
            html += ">"+i+"</span>";
            $commentLinks.append(html);
        }

        // add arbitrary click handling
        $("#commentLinks > span").click(function(){
            var id = $(this).attr("id");
            id = id.replace("l","");
            var thisPage = thisComments.curPage;
            if(id == thisPage){
                // no change
                return;
            }
            $("#page"+thisPage).attr("class","unselected");
            $("#l"+thisPage).attr("class","enabledLink");
            thisComments.curPage = id;
            $("#page"+id).attr("class","selected");
            $("#l"+id).attr("class","disabledLink");
        });
    };

    this.formCommentHtml = function(id,text,name,timestamp){
        // need to move date to MM/DD/YYYY format
        var dateString = timestamp.split(" ")[0];
        var timeString = timestamp.split(" ")[1];
        var dateAry = dateString.split("-"); // 0-Y, 1-M, 2-D
        var dateTime = new Date(dateAry[1]+"/"+dateAry[2]+"/"+dateAry[0]+" "+timeString+" UTC");
        timestamp = dateTime.toLocaleString(); // Convert to client's locale
        return "<div id='"+id+"c' class=comment><div id='"+id+"n' class=commentName><span class=boldName>"+name+"</span><span class=commentTimestamp> wrote at "+timestamp+":</span></div><div id='"+id+"t' class=commentText>"+text+"</div></div>";
    };
}

comments = new Comments(); // make global comments object

var initForm = function(){
    document.getElementById("commentSubmit").onclick = function(){makeRequest('/Index/Comment.php');};
    var httpRequest;

    function makeRequest(url){
        var $name = $("#commentName");
        var $comment = $("#commentText");
        var $ct = $("#ct");

        var name = $name.val();
        var comment = $comment.val();
        var ct = $ct.html();
        
        //Validate input
        if(!valName(name)){return;}
        if(!valComment(comment)){return;}
        if(!valCount(ct)){return;}
        
        /*
            TODO Add session var checking login stuff here later TODO
        */
        
        // make values for timestamp
        var date = new Date();
        var timestamp = formatTimestamp(date);

        if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
        }
        else if(window.ActiveXObject){
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch(e){}
            }
        }

        if(!httpRequest) {
            alert("Could not create XMLHTTP instance");
            return false;
        }
        // pass callback function, function executed when server finishes
        httpRequest.onreadystatechange = serverResponse;

        // type of request! POST sends some data (see send method), GET (and POST) gets stuff back
        httpRequest.open("POST",url);

        // maybe required for POST, though I haven't had problems w/o it
        httpRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

        // send data in this form for POST's, retrieve data in PHP via $_POST[index]=value
        var id = parseInt(ct) + 1;

        httpRequest.send("name="+name+"&comment="+comment+"&id="+id+"&timestamp="+timestamp);

        // assume comment is added - if response detects failure, it will remove this comment
        comments.addComment(id,comment,"",name,1,timestamp);
    };
    function serverResponse(){
        // Alert with error message if POST failed, otherwise assume comment added to db
        // and post comment to the DOM 
        if(httpRequest.readyState === 4){
            if(httpRequest.status === 200){
                var responseText = httpRequest.responseText;
                if(responseText === "SUCCESS"){
                    // use Comments object method to post to screen?
                    displayComments();
                }
                else if(responseText === "FAILURE"){
                    // some 'expected' failure on server
                    alert("Failure!");
                    comments.removeComment();
                }
                else{
                    // unexpected error on server
                    alert("This is what happened: <br/>"+responseText);
                    comments.removeComment();
                }
            }
            else{
                alert("Problems!!");
                comments.removeComment();
            }
        }
        else{
            // Still waiting for server - not necessarily a problem
        }
    };
};

var valName = function(name){
    if(name.length === 0){
        alert("No name entered");
        return false;
    }
    else if(name.length > 31){
        alert("Please enter a shorter name!");
        return false;
    }

    else{return true;}
};

var valComment = function(comment){
    if(comment.length === 0){
        alert("No comment entered");
        return false;
    }
    else if(comment.length > 2000){
        alert("Sorry, but your comment is too long.  Please write a comment that is less than 2000 characters.");
        return false;
    }

    else{return true;}
};

var valCount = function(ct){
    var maxComments = 100;
    if(ct >= maxComments){
        alert("Sorry, but I'm keeping a limit of "+maxComments+" for now.");
        return false;
    }
    else{return true;}
};

var formatTimestamp = function(date){
    // mysql expects format: YYYY-MM-DD HH:mm:ss (24-hr UTC time)
    var d = date.toISOString(); // gives date/time in UTC
    d = d.replace("T"," ");
    return d.substr(0,19);
};

var getComments = function(){
    // Send off GET request to server to retrieve comments
    
    var url = "/Index/RetrieveComments.php";
    if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
        }
        else if(window.ActiveXObject){
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch(e){}
            }
        }

        if(!httpRequest) {
            alert("Could not create XMLHTTP instance");
            return false;
        }
        // pass callback function, function executed when server finishes
        httpRequest.onreadystatechange = getCommentResponse;

        // type of request! POST sends some data (see send method), GET (and POST) gets stuff back
        httpRequest.open("GET",url);
        
        httpRequest.send();
};

var getCommentResponse = function(){
    // Response in this case will be bunch of comments encoded in text.
    
    if(httpRequest.readyState === 4){
        if(httpRequest.status === 200){
            var responseText = httpRequest.responseText;
            if(responseText){
                // use Comments object method to post to screen?
                comments.init(responseText);
                displayComments();
            }
            else{
                // unexpected error on server
                alert("This is what happened: <br/>"+responseText);
            }
        }
        else{
            alert("Problems!!");
        }
    }
    else{
        // Still waiting for server - not necessarily a problem
    }
};

var displayComments = function(){
    var count = comments.count;
    comments.showComments();    
};

$(document).ready(function(){
    // Collect comment data from database on page load, add to html DOM
    getComments();

    // Set up event listener and ajax POST function
    initForm();
});
