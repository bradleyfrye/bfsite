<?php

    require_once("./classes/class.Logging.php");
    require_once("./classes/class.Mysql.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 0; // set to 1 to use logging

    // get $_POST variables, e.g.: $timestamp = $_POST['timestamp'];
    $name = $_POST["name"];  
    $nameL = strlen($name);

    // server side validation
    if($nameL < 1 || $nameL > 32){
        // got past client validation
        echo("VALFAIL");
        if($enableLogging){$logging->logMessage(__FILE__." - invalid house name.");}
    }

    if(!$mysql->connected){
        // no mysql connection
        echo("SQLFAIL");
        $logging->logMessage("Comment.php - don't have mysql connection");
    }

    // Not going to allow same name with different capitalization
    $query = "select distinct NAME,ID from Houses"; 
    $results = $mysql->multiRowQuery($query);

    for($i = 0;$i<count($results);$i++){
        $testName = $results[$i]["NAME"];
        if(strtoupper($testName) == strtoupper($name)){
            // name collision
            echo("SAMENAMEFAIL");
            if($enableLogging){$logging->logMessage(__FILE__." - ".$name." house already exists.");}
            die();
        }
    }

    // Passed validation
    $ID = array_pop($results)["ID"]+1;
    $userID = $_SESSION["ID"];
    $userName = $_SESSION["userName"];

    // form parameterized query
    $query = "insert into Houses(ID,NAME,USER_ID,USER_NAME) values(?,?,?,?);"; // values should be ?'s
    $types = 'isis'; // either i or s for the most part
    
    // array of query values, e.g.: $valAry = array(&$id,&$name,&$timestamp);
    $valAry = array(&$ID,&$name,&$userID,&$userName); 

    // send request to database
    $result = $mysql->changeQuery($query,$types,$valAry);
    if($result){
        echo ("SUCCESS");
    }
    else{
        echo ("FAILURE");
        $message = "House create failure - ".$name;
        $logging->logMessage(__FILE__." - ".$message);
    }
