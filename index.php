<?php

session_name("bfsite");
session_start();

require_once("./classes/class.Logging.php");

$logging = new Logging();
$enableLogging = 1; // Turn on for logging

$url = $_SERVER["REQUEST_URI"];

$dirArray = explode("/",substr($url,1));

$folder = $dirArray[0];
$file=array_pop($dirArray);

$path = implode("/",$dirArray);

if(strlen($file)>0){
    $type = explode(".",$file)[1];
}
else{
    $type = 'html';
    $file = strtolower($dirArray[count($dirArray)-1].".html");
}

if($enableLogging){$logging->logMessage("index.php - url: ".$url."\nfolder: ".$folder."\nfile: ".$file."\ntype: ".$type."\npath: ".$path);}

if(isset($_GET["logout"]) && $_GET["logout"]){
    $_SESSION = array(); // unset all session vars

    if(ini_get("session.use_cookies")){
        $params = session_get_cookie_params();
        setcookie(session_name(),"",time() - 42000,$params["path"],$params["domain"],$params["secure"],$params["httponly"]);
    }

    session_destroy();

    $folder = "Index";
    $file = "index.html";
    $type = "html";
    $path = "Index";
}

// need to check for class.$folder.php, html, and specific files
if(strlen($folder)>0 && file_exists("./".$folder)){
    $filename = "./".$path."/".$file;
    
    if($enableLogging){$logging->logMessage("Index - filename: ".$filename);}

    if(!file_exists($filename)){echo "ERROR - File not found";}
    else{
        $classFile = "./classes/"."class.".$folder.".php";
        if(!file_exists($classFile)){echo "ERROR - No class found";}
        else{
            require_once($classFile);
            $page = new PageClass($folder,$file,$type,$path);
        }
    }
}

else{
    //default to index
    require_once("./classes/class.Index.php");
    $page = new PageClass("Index","index.html","html","Index");
}
