// FILE CURRENTLY DOES NOTHING

$(document).ready(function(){

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

        httpRequest.send("userName="+userName+"&pw="+pw);
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
