
// define ajax request function, should be usable by any js.
// don't call before $(document).ready()
var ajaxRequest = function(url,method,responseFunction,request){
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
    httpRequest.onreadystatechange = responseFunction;

    // type of request! POST sends some data (see send method), GET (and POST) gets stuff back
    httpRequest.open(method,url);

    if(method === "POST"){
        httpRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        httpRequest.send(request);
    }
    
    else if(method === "GET"){
        httpRequest.send();
    }
       
    return httpRequest; // needed for responseFunction to work
}
