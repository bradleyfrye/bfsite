<?php

    require_once("./classes/class.Logging.php");
    require_once("./classes/class.Mysql.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 0; // set to 1 to use logging

    // get $_POST variables, e.g.: $timestamp = $_POST['timestamp'];

    // server side validation
    if(!$mysql->connected){
        // no mysql connection
        echo("FAILURE");
        $logging->logMessage("Comment.php - don't have mysql connection");
    }

    // form parameterized query
    $query = ""; // values should be ?'s
    $types = ''; // either i or s for the most part
    
    // array of query values, e.g.: $valAry = array(&$id,&$name,&$timestamp);

    // send request to database
    $result = $mysql->changeQuery($query,$types,$valAry);
    if($result){
        echo ("SUCCESS");
    }
    else{
        echo ("FAILURE");
        $message = "";
        $logging->logMessage(__FILE__." - ".$message);
    }
