<?php

    require_once("./classes/class.Mysql.php");
    require_once("./classes/class.Logging.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 0;

    if($enableLogging){$logging->logMessage("Retrieve Comments");}
    // Passing back comments as a string to js.  Format:
    // id|commentText|userID|userName|anonymous|timestamp;id2|commentText2|...etc

    $results = $mysql->multiRowQuery("select * from Comments order by TIMESTAMP");
    $response = "";

    for($i=0;$i<count($results);$i++){
        $arr = $results[$i];
        $response .= implode($arr,"|");
        if($i != (count($results)-1)){$response .= ";";}
    }

    echo ($response);
