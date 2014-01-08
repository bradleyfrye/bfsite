$(document).ready(function(){
    $("#submitButton").click(function(){
        var userName = $("#nameField").val();
        var pw = $("#pwField").val();
        var pwc = $("#pwcField").val();
        
        if(pw !== pwc){
            alert("Passwords do not match, try again!");
            return;
        }

        // maybe other client validations here

        else{
            // still need php to do database validation - check if user is unique
            // send request to php to try to add, return success or error message
            var url = "https://www.bradleyfrye.com/Register/register.php";

            httpRequest = ajaxRequest(url,"POST",serverResponse,"userName="+userName+"&pw="+pw+"&pwc="+pwc);
        }
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
                else if(responseText=="QUERYFAIL"){
                    alert("ERROR - Failed to add user data to database!");
                }
                else if(responseText=="NAME_EXISTS"){
                    alert("Sorry, but there is already a user with this name. Please enter a different name.");
                }
                else if(responseText=="SUCCESS"){
                    alert("Thank you for signing up!  Your user has been created!");
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
});
