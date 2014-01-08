$(document).ready(function(){
    $("#submit").click(function(){
        //get name from field
        var houseName = $("#houseName").val();

        //validate (do server val later)
        var houseNameL = houseName.length;
        if(houseNameL < 1){
            alert("You entered "+houseName);
            return;
        }
        if(houseNameL > 32){
            alert("Please limit your house name to 32 characters.");
            return;
        }

        //ajax request - php does server val, checks for uniqueness
        var url = "/List/houseCreate/housecreate.php";
        var requestString = "name="+houseName; // general format: var1=val1&var2=val2 etc.
        var method = "POST";
        httpRequest = ajaxRequest(url,method,serverResponse,requestString);
    });

    var serverResponse = function(){
        // standard http checks
        if(httpRequest.readyState === 4){
            if(httpRequest.status === 200){
                var responseText = httpRequest.responseText;
                // parse responseText
                if(responseText === "SQLFAIL"){
                    alert("Error - problem connecting to SQL database.");
                    return;
                }
                else if(responseText === "VALFAIL"){
                    alert("Error - server validation failure.  Quit messin around.");
                    return;
                }
                else if(responseText === "SAMENAMEFAIL"){
                    alert("Sorry, there's already a House with that name.  Please try a different name.");
                    return;
                }
                else if(responseText === "FAILURE"){
                    alert("Unexpected server failure! DAAANGGG");
                    return;
                }
                else if(responseText === "SUCCESS"){
                    alert("New house created!");
                    return;
                }
                else{
                    // shouldn't get here
                    alert("Something weird happened...tell Brad about it.");
                }
            }
            else{
                // shouldn't get this unless server goes down between page being served and request
                // better error logging done on server side
                alert("Server problems!  Tell Brad about it!");
                return;
            }
        }
        else{
            // not necessarily a problem, just waiting for server to respond
        }
    };
});
