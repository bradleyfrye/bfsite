<?php

    require_once("./bfsite/classes/class.Mysql.php");
    require_once("./bfsite/classes/class.Logging.php");

    $mysql = new Mysql();
    $logging = new Logging();

    $logging->logMessage("Retrieve Comments");
    // Passing back comments as a string to js.  Format:
    // id|commentText|userID|userName|anonymous|timestamp;id2|commentText2|...etc

    $results = $mysql->multiRowQuery("select * from Comments");
    $response = "";

    for($i=0;$i<count($results);$i++){
        $arr = $results[$i];
        $response .= implode($arr,"|");
        if($i != (count($results)-1)){$response .= ";";}
    }

    echo ($response);
