<?php
    // itemAdd.php
    require_once("./classes/class.Logging.php");
    require_once("./classes/class.Mysql.php");

    $mysql = new Mysql();
    $logging = new Logging();
    $enableLogging = 0; // set to 1 to use logging

    // get $_POST variables, e.g.: $timestamp = $_POST['timestamp'];
    $quant = $_POST["quant"];
    $desc = $_POST["desc"];
    $houseID = $_POST["houseID"];
    $timestamp = $_POST["timestamp"];
    $category = $_POST["category"];

    $userID = $_SESSION["ID"];
    $userName = $_SESSION["userName"];
    $loggedIn = $_SESSION["loggedIn"];

    // server side validation
    if(!$mysql->connected){
        // no mysql connection
        echo("SQLFAIL");
        $logging->logMessage("Comment.php - don't have mysql connection");
    }
    if(!$loggedIn || !$userID || !$userName){
        echo("LOGINFAIL");
        if($enableLogging){$logging->logMessage(__FILE__." - login issue.");}
    }
    if(!$quant || !$desc || !$houseID || !$category || $category == "Select a category"){
        echo("VALFAIL");
        if($enableLogging){$logging->logMessage(__FILE__." - server validation failed.");}
    }

    // get next ID
    $query = "select MAX(ID) from Items;";
    $results = $mysql->singleRowQuery($query);
    $ID = $results["MAX(ID)"]+1;

    // form parameterized query
    $query = "insert into Items(ID,DESCRIPTION,HOUSE_ID,USER_ID,USER_NAME,TIMESTAMP,QUANTITY,CATEGORY) values(?,?,?,?,?,?,?,?);"; // values should be ?'s
    $types = 'isiissss'; // either i or s for the most part
    
    // array of query values, e.g.: $valAry = array(&$id,&$name,&$timestamp);
    $valAry = array(&$ID,&$desc,&$houseID,&$userID,&$userName,&$timestamp,&$quant,&$category);

    // send request to database
    $results = $mysql->changeQuery($query,$types,$valAry);
    if($results){
        $returnString = "SUCCESS?ID=".$ID."&userName=".$userName;
        echo ($returnString);
    }
    else{
        echo ("FAILURE");
        $message = "insert into Items query failed.";
        $logging->logMessage(__FILE__." - ".$message);
    }
