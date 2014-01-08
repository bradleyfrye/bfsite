$(document).ready(function(){
    // TODO - change ID here
    $("#buttonID").click(function(){
        //get name from field

        //validate (do server val later)

        //ajax request - php does server val, checks for uniqueness
        var url = ;
        var requestString = ; // general format: var1=val1&var2=val2 etc.
        var method = "POST";
        httpRequest = ajaxRequest(url,method,serverResponse,requestString);
    });

    var serverResponse = function(){
        // standard http checks
        if(httpRequest.readyState === 4){
            if(httpRequest.status === 200){
                var responseText = httpRequest.responseText;
                // parse responseText
            }
            else{
                // shouldn't get this unless server goes down between page being served and request
                // better error logging done on server side
                alert("Server problems!  Tell Brad about it!");                
            }
        else{
            // not necessarily a problem, just waiting for server to respond
        }
    };
});
