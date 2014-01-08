$(document).ready(function(){
    $("#submitButton").click(function(){
        var userName = $("#nameField").val();
        var pw = $("#pwField").val();
        
        var url = "https://www.bradleyfrye.com/Login/login.php";
        
        httpRequest = ajaxRequest(url,"POST",serverResponse,"userName="+userName+"&pw="+pw);
    });

    var serverResponse = function(){
        if(httpRequest.readyState === 4){
            if(httpRequest.status === 200){
                var responseText = httpRequest.responseText;
                if(responseText=="VALFAILURE"){
                    alert("Server side validation failure!");
                }
                else if(responseText=="SQLFAILURE"){
                    alert("ERROR - SQL server is down!");
                }
                else if(responseText=="NO_NAME"){
                    alert("This user name doesn't exist.  Please make sure you spelled it correctly and try again.");
                }
                else if(responseText=="SUCCESS"){
                    alert("Logged in!");
                }
                else if(responseText=="PASSFAIL"){
                    alert("Invalid password - please make sure you're spelling the password correctly (password is case sensitive), and try again.");
                }
                else{
                    // unexpected error on server
                    alert("This is what happened: <br/>"+responseText);
                }
            }
            else{
                alert("Problems!! Server did not return OK status!\n"+httpRequest.responseText);
            }
        }
        else{
            // Still waiting for server - not necessarily a problem
        }
    };
});
