$(document).ready(function(){
    $("#submit").click(function(){
        var name = $("#houseName").val();

        if(name.length<1){
            alert("You didn't enter anything!");
            return;
        }
        if(name.length>32){
            alert("There aren't any houses with a name that long.");
            return;
        }

        var url = "/List/houseSearch/housesearch.php";
        var method = "POST";
        var requestString = "name="+name;

        httpRequest = ajaxRequest(url,method,serverResponse,requestString);
    });

    var serverResponse = function(){
        // http checks 
        if(httpRequest.readyState === 4){
            if(httpRequest.status === 200){
                var responseText = httpRequest.responseText;
                // parse responseText
                if(responseText === "SQLFAIL"){
                    alert("Error - problem connecting to SQL database.");
                    return;
                }
                if(responseText === "VALFAIL"){
                    alert("Error - server validation failed.");
                    return;
                }
                if(responseText === "ADDFAIL"){
                    alert("Error - there was an issue with SQL adding you to the house, tell Brad about it");
                    return;
                }
                if(responseText === "NOHOUSEFAIL"){
                    alert("Didn't find any houses with that name. You may have spelled it incorrectly, or it may not exist.");
                    return;
                }
                if(responseText === "DUPLICATEFAIL"){
                    alert("You're already a member of that house!");
                    return;
                }
                if(responseText === "SUCCESS"){
                    alert("Successfully added you to the house!");
                    return;
                }
                else{
                    alert("Unexpected error! Tell Brad about it!");
                    return;
                }
            }
            else{
                alert("Server problems!");
            }
        }
        else{
            // waiting for server, not necessarily a problem
        }
    };

});
