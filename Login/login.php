<?php
    
    session_name("bfsite");
    session_start();

    require_once("./classes/class.Logging.php");
    require_once("./classes/class.Mysql.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 1; // set to 1 to use logging

    $name = $_POST['userName'];
    $pw = $_POST['pw'];

    $nameL = strlen($name);
    $pwL = strlen($pw);


    if($nameL < 1 || $nameL > 31 || $pwL > 255 ){
        // somehow got by js validation!
        echo("VALFAILURE");
        $logging->logMessage("Login.php - bad name or password");
    }
    
    if(!$mysql->connected){
        // no mysql connection
        echo("SQLFAILURE");
        $logging->logMessage("Login.php - don't have mysql connection");
    }

    $query = "select ID from Users where NAME='".$name."'";

    $results = $mysql->singleRowQuery($query);

    if($results == -1){
        // -1 returned for an empty set, means name doesn't exist
        echo "NO_NAME";
        if($enableLogging){$logging->logMessage("Login.php - login fail due to nonexistent name: ".$name);}
    }

    else{
        // query returned array with an ID, name exists
        $ID = $results["ID"];
        $query = "select PASSWORD from Users where ID=".$ID;
        $results = $mysql->singleRowQuery($query);
        if(password_verify($pw,$results["PASSWORD"])){
            // looks good!
            echo "SUCCESS";
            // need to set SESSION vars to show user is logged in
            $_SESSION["loggedIn"]=1;
            $_SESSION["userName"]=$name;
            $_SESSION["ID"]=$ID;
        }
        else{
            // password doesn't match
            echo "PASSFAIL";
        }
    }

