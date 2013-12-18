<?php

    require_once("./classes/class.Logging.php");
    require_once("./classes/class.Mysql.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 1; // set to 1 to use logging

    $name = $_POST['name'];
    $comment = $_POST['comment'];
    $id = $_POST['id'];
    $timestamp = $_POST['timestamp'];
    // may need other POST vars later, login context perhaps

    $maxComments = 100;
    $nameL = strlen($name);
    $commentL = strlen($comment);

    if($nameL < 1 || $nameL > 31 || $commentL < 1 || $commentL > 2000 || $id > $maxComments){
        // somehow got by js validation!
        echo("FAILURE");
        $logging->logMessage("Comment.php - bad name or comment value");
    }
    
    if(!$mysql->connected){
        // no mysql connection
        echo("FAILURE");
        $logging->logMessage("Comment.php - don't have mysql connection");
    }

    // Not specifying a USER_ID at this point, will add handling later
    $query = "insert into Comments (ID,COMMENT,USER_NAME,ANONYMOUS,TIMESTAMP) values(?,?,?,?,?);";
    $types = 'issis';
    $anon = 1;
    $valAry = array(&$id,&$comment,&$name,&$anon,&$timestamp);

    $result = $mysql->changeQuery($query,$types,$valAry);
    if($result){
        echo ("SUCCESS");
    }
    else{
        echo ("FAILURE");
        $logging->logMessage("Comment.php - Query failure: ".$query."; id = ".$id.";");
    }
