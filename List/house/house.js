$(document).ready(function(){
    var table="";
    var itemData = [];
    var delData = -1;
    var colDict = {
        "QUANTITY":"Quantity",
        "DESCRIPTION":"Item Description",
        "USER_NAME":"Added By",
        "TIMESTAMP":"Date",
        "CATEGORY":"Category"
    };
    
    table = JSON.parse($("#itemData").html()); // parse JSON in html
    $("#itemData").remove(); // don't need script tag, take it out
    table.sort = "TIMESTAMP"; // table object knows current sort col
    table.sortOrder = 1; // defining 1 as standard, 0 as upside-down
    writeTable(); // put the stuff in the table tag
    $("#quantForm").focus();

    // column order is determined here
    function getRowHtml(tableObj){
        return tableObj.QUANTITY + tableObj.DESCRIPTION + tableObj.CATEGORY + tableObj.USER_NAME + tableObj.TIMESTAMP;
    };

    function writeTable(){
        // structure - table.items[rowNum].columnName = colVal
        var html = "<tr>";
        var hCls = "class='tableHdr'";
        var tableObj = {}; // hold html in object properties
        var thisHtml = "";
        for(var colName in table.items[0]){
            // write headers - need to add approp arrow for sorted, decapitalize,
            // and add click listener to allow sorting
            if(colName === "ID"){
                continue; // nothing needed here
            }
            else{
                var outName = colDict[colName];
                thisHtml = "<th "+hCls+" id='"+colName+"'>"+outName;
                if(colName === table.sort){
                    if(table.sortOrder){thisHtml += " &#x25bc ";}
                    else{thisHtml += " &#x25b2 ";}
                }
                thisHtml += "</th>";
                tableObj[colName] = thisHtml;
            }
        }

        html += getRowHtml(tableObj); 
        html += "<th>Remove Item</th></tr>";

        for(var i=0;i<table.items.length;i++){
            html += "<tr>";
            tableObj = {};
            for(var colName in table.items[i]){
                if(colName === "ID"){var id = table.items[i].ID;}
                else{
                    var val = table.items[i][colName];
                    if(colName === "TIMESTAMP"){val = toClientDateString(val);}
                    tableObj[colName] = "<td>"+val+"</td>";
                }
            }

            html += getRowHtml(tableObj);
            html += "<td class='xItem' id='"+id+"'><a href=#><div class=xDiv>x</div></a></td></tr>";
        }
        $tbody = $("#itemBody");
        $tbody.html(html);
        
        $(".tableHdr").click(function(){
            var id = $(this).attr("id");
            if(table.sort == id){table.sortOrder = table.sortOrder - 2*table.sortOrder + 1;}
            else{table.sort = id; table.sortOrder = 1;}
            sortTable();
            writeTable();
        });
        
        // event handler for clicking an x to remove an item
        $(".xItem").click(function(){
            var id = $(this).attr("id"); // element ID should be actual db ID
            delData = id;
            var url = "/List/house/itemDel.php";
            var requestString = "ID="+id;
            var method = "POST";
            httpRequest = ajaxRequest(url,method,delServerResponse,requestString);
        });
    };

    function sortTable(){
        table.items.sort(function(x,y){
            var xVal = x[table.sort];
            var yVal = y[table.sort];
            if(typeof(xVal) === "string"){xVal = xVal.toLowerCase();}
            if(typeof(yVal) === "string"){yVal = yVal.toLowerCase();}
            if(xVal < yVal){return 1-2*table.sortOrder;}
            else if(xVal > yVal){return -1+2*table.sortOrder;}
            else{return 0;}
        });
    };

    function getHouseID(){
        var url = window.location.href;
        var query = url.split("?")[1];
        if(!query){return false;}
        var pieces = query.split("&");
        for(var i=0;i<pieces.length;i++){
            var piece = pieces[i].split("=");
            if(piece[0] === "ID"){
                return piece[1];
            }
        }
    };

    function toServerDateString(date){
        var dateString = date.toISOString();
        dateString = dateString.replace("T"," ");
        return dateString.substr(0,19);
    };

    function toClientDateString(date){
        // Mysql format: 2014-01-14 08:40:42
        var dateString = date.split(" ")[0];
        var timeString = date.split(" ")[1];
        var dateAry = dateString.split("-");
        var dateTime = new Date(dateAry[1]+"/"+dateAry[2]+"/"+dateAry[0]+" "+timeString+" UTC");
        return toSelfDateString(dateTime);
    };

    function toSelfDateString(date){
        // turn a Date object into MM/DD/YY HH:MM AM/PM format
        var month = zeroCheck(date.getMonth()+1);
        var day = zeroCheck(date.getDate());
        var year = date.getFullYear().toString().substr(2);
        var time = date.toLocaleTimeString();
        time = time.substr(0,time.length-6) + time.substr(time.length-3);
        return month + "/" + day + "/" + year + " " + time;
    };

    // adds a 0 to a one digit number, stringifies any input
    function zeroCheck(str){
        if(str.toString().length === 1){
            return "0"+str.toString();
        }
        else{return str.toString();}
    };

    $("#category").change(function(){
        var val = $(this).find("option:selected").attr("value");
        if(val === "Custom"){
            $("#customCatText").css("display","inline-block");
            $("#customCat").css("display","inline-block");
        }
        else{
            $("#customCatText").css("display","none");
            $("#customCat").css("display","none");
        }
    });

    $(window).keydown(function(event){
        if(event.keyCode == 13){
            if($("#quantForm").val() && $("#descForm").val()){
                $("#submit").click();
            }
        }
    });

    // event handler for adding a new item
    $("#submit").click(function(){
        //get field values
        var quant = $("#quantForm").val();
        var desc = $("#descForm").val();
        var houseID = getHouseID();
        var category = $("#category").find("option:selected").attr("value");
        if(category === "Custom"){category = $("#customCat").val();}

        //validate (do server val later)
        if(quant.length < 1){alert("Error - quantity field is blank");return;}
        if(quant.length > 32){alert("Error - quantity value is too long");return;}
        if(desc.length < 1){alert("Error - description field is blank");return;}
        if(desc.length > 64){alert("Error - description value is too long");return;}
        if(category.length < 1){alert("Error - please enter something for a custom category");return;}
        if(category === "Select a category"){alert("Error - please select a category");return;}
        if(!houseID){alert("Error - issue with URL, return to main page and reload Shopping List app.");return;}

        // form date/time string for timestamp
        var date = new Date();
        var timestamp = toServerDateString(date);

        itemData["quant"] = quant;
        itemData["desc"] = desc;
        itemData["timestamp"] = timestamp;
        itemData["category"] = category;

        //ajax request - php does server val, checks for uniqueness
        var url = "/List/house/itemAdd.php";
        var requestString = "quant="+quant+"&desc="+desc+"&houseID="+houseID+"&timestamp="+timestamp+"&category="+category;
        var method = "POST";
        httpRequest = ajaxRequest(url,method,addServerResponse,requestString);
    });

    function addServerResponse(){
        // standard http checks
        if(httpRequest.readyState === 4){
            if(httpRequest.status === 200){
                var responseText = httpRequest.responseText;
                // parse responseText
                if(responseText === "SQLFAIL"){
                    alert("Error - lost connection to SQL server. Try again later.");
                    return;
                }
                if(responseText === "LOGINFAIL"){
                    alert("Error - your login timed out, or you deleted your cookies.  Please log back in and try again.");
                    return;
                }
                if(responseText === "VALFAIL"){
                    alert("Error - server didn't like the data you sent to it.  Please try again.");
                    return;
                }
                if(responseText === "FAILURE"){
                    alert("Error - failed to add data to database, please try again later.");
                    return;
                }
                if(responseText.indexOf("SUCCESS")!=-1){
                    // item added successfully.
                    var $quant = $("#quantForm");
                    $quant.val(""); // blank out fields
                    $("#descForm").val("");
                    $quant.focus();
                    
                    var query = responseText.split("?")[1];
                    var pieces = query.split("&");
                    for(var i=0;i<pieces.length;i++){
                        var vals = pieces[i].split("=");
                        if(vals[0] === "ID"){
                            itemData["ID"]=vals[1];
                        }
                        else if(vals[0] === "userName"){
                            itemData["userName"]=vals[1];
                        }
                    }
            
                    var itemObj = {"ID":itemData["ID"],"DESCRIPTION":itemData["desc"],"USER_NAME":itemData["userName"],"TIMESTAMP":itemData["timestamp"],"QUANTITY":itemData["quant"],"CATEGORY":itemData["category"]};
                    table.items.push(itemObj);
                    writeTable();
                }
                else{
                    alert("Unexpected error, please tell Brad about it!");
                    return;
                }
            }
            else{
                // shouldn't get this unless server goes down between page being served and request
                // better error logging done on server side
                alert("Server problems!  Tell Brad about it!");                
            }
        }
        else{
            // not necessarily a problem, just waiting for server to respond
        }
    };

    function delServerResponse(){
        // standard http checks
        if(httpRequest.readyState === 4){
            if(httpRequest.status === 200){
                var responseText = httpRequest.responseText;
                // parse responseText
                if(responseText === "SQLFAIL"){
                    alert("Error - lost connection to SQL server. Try again later.");
                    return;
                }
                if(responseText === "FAILURE"){
                    alert("Error - failed to delete data from database, please try again later.");
                    return;
                }
                if(responseText === "SUCCESS"){
                    alert("Item deleted.");
                    var found=0; var i=0;
                    while(!found){
                        if(table.items[i].ID === delData){
                            table.items.splice(i,1);
                            writeTable();
                            found = 1;
                        }
                        else{i++;}
                    }
                }
                else{
                    alert("Unexpected error, please tell Brad about it!");
                    return;
                }
            }
            else{
                // shouldn't get this unless server goes down between page being
                // better error logging done on server side
                alert("Server problems!  Tell Brad about it!");
            }
        }
        else{
            // not necessarily a problem, just waiting for server to respond
        }
    };
});
