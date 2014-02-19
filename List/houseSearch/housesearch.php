<?php

    require_once("./classes/class.Logging.php");
    require_once("./classes/class.Mysql.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 1; // set to 1 to use logging

    // get $_POST variables, e.g.: $timestamp = $_POST['timestamp'];
    $name = $_POST['name'];

    // server side validation
    $nameL = strlen($name);
    if($nameL < 1 || $nameL > 32){
        echo ("VALFAIL");
        $logging->logMessage(__FILE__." - server validation failure");
        die();
    }

    if(!$mysql->connected){
        // no mysql connection
        echo("SQLFAIL");
        $logging->logMessage(__FILE__." - don't have mysql connection");
    }

    $query = "select distinct ID,NAME from Houses"; 
    
    // send request to database
    $results = $mysql->multiRowQuery($query);
    $success = 0;

    for($i = 0;$i<count($results);$i++){
        $dbName = $results[$i]["NAME"];
        if(strtoupper($dbName) == strtoupper($name)){
            $success = 1;
            $ID = $results[$i]["ID"];
            break;
        }
    }

    if($success){
        // house exists, check if user is already a member
        $userID = $_SESSION["ID"];
        $userName = $_SESSION["userName"];

        $query = "select ID from Houses where ID=? and USER_ID=?;";
        $types = "ii";
        $valAry = array(&$ID,&$userID);
        $results = $mysql->changeQuery($query,$types,$valAry,0);
        if($results){
            // user is already member of house
            echo("DUPLICATEFAIL");
            if($enableLogging){$logging->logMessage(__FILE__." - user ID ".$userID." tried to join house ID ".$ID.", failed because user already in house. Results = ".$results);}
            die();
        }
        // good to add if we didn't die up there

        // add line to Houses
        $query = "insert into Houses(ID,NAME,USER_ID,USER_NAME) values(?,?,?,?);";
        $types = "isis";
        $valAry = array(&$ID,&$dbName,&$userID,&$userName);
        $results = $mysql->changeQuery($query,$types,$valAry);
        if($results){
            echo("SUCCESS");
        }
        else{
            echo("ADDFAIL");
            if($enableLogging){$logging->logMessage(__FILE__." - insert query failed to add user to house");}
        }
    }
    else{
        echo ("NOHOUSEFAIL");
        if($enableLogging){$logging->logMessage(__FILE__." - user entered house name doesn't exist");}
    }
