<?php

    require_once("./classes/class.Logging.php");
    require_once("./classes/class.Mysql.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 0; // set to 1 to use logging

    // get $_POST variables, e.g.: $timestamp = $_POST['timestamp'];
    $ID = $_POST["ID"];

    // server side validation
    if(!$mysql->connected){
        // no mysql connection
        echo("SQLFAIL");
        $logging->logMessage(__FILE__." - don't have mysql connection");
    }
    if(!$ID){
        echo("IDFAIL");
        $logging->logMessage(__FILE__." - failed to get ID in POST data.");
    }

    // form parameterized query
    $query = "delete from Items where ID=?"; // values should be ?'s
    $types = 'i'; // either i or s for the most part
    
    // array of query values, e.g.: $valAry = array(&$id,&$name,&$timestamp);
    $valAry = array(&$ID);
    // send request to database
    $result = $mysql->changeQuery($query,$types,$valAry);
    if($result){
        echo ("SUCCESS");
    }
    else{
        echo ("FAILURE");
        $message = "could not delete item from database.";
        $logging->logMessage(__FILE__." - ".$message);
    }
