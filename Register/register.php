<?php

    require_once("./classes/class.Logging.php");
    require_once("./classes/class.Mysql.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 1; // set to 1 to use logging

    $name = $_POST['userName'];
    $pw = $_POST['pw'];
    $pwc = $_POST['pwc'];

    $nameL = strlen($name);

    if($nameL < 1 || $nameL > 31 || $pw != $pwc){
        // somehow got by js validation!
        echo("VALFAILURE");
        $logging->logMessage("Register.php - bad name or password");
        die();
    }
    
    if(!$mysql->connected){
        // no mysql connection
        echo("SQLFAILURE");
        $logging->logMessage("Register.php - don't have mysql connection");
        die();
    }

    $query = "select ID from Users where NAME='".$name."'";

    $results = $mysql->singleRowQuery($query);

    if($results == -1){
        // -1 returned for an empty set, means name isn't used
        $query = "insert into Users(ID,NAME,PASSWORD,EMAIL,ADMIN) values(?,?,?,?,?);";
        
        // get current max ID
        $idQuery = "select MAX(ID) from Users;";
        $results = $mysql->singleRowQuery($idQuery);
        $newID = $results["MAX(ID)"]+1;

        $pw = password_hash($pw,PASSWORD_DEFAULT);
        $email = "placeHolder@fake.com";
        $admin = 0; // to be implemented later, perhaps

        $types = "isssi";
        $valAry = array(&$newID,&$name,&$pw,&$email,&$admin);

        $results = $mysql->changeQuery($query,$types,$valAry);

        if($results){
            echo("SUCCESS");
        }
        else{
            echo("QUERYFAIL");
        }
    }

    else{
        // query returned array with an ID, name already exists
        echo "NAME_EXISTS";
        if($enableLogging){$logging->logMessage("Register.php - register fail due to duplicate name: ".$name);}
    }

