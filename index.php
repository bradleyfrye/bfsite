<?php

require_once("./classes/class.Logging.php");

$logging = new Logging();
$enableLogging = 1; // Turn on for logging

// Create $_SESSION variable
session_start();

$url = $_SERVER["REQUEST_URI"];
if($enableLogging){$logging->logMessage($url);}

preg_match("`([^/]+)`",substr($url,1),$matches);
$folder = $matches[1]; 

preg_match("`/([^/]+)`",substr($url,1),$matches);
$file = $matches[1];

preg_match("`\.([A-Za-z]+)`",$file,$matches);
$type = $matches[1];

if($type == ""){$type = "html";}

// need to check for class.$folder.php, html, and specific files
if($folder != "" && file_exists("./".$folder)){
    if($type == "html"){
        $file = strtolower($folder).".html";
    }

    $filename = "./".$folder."/".$file;

    if(!file_exists($filename)){echo "ERROR - File not found";}
    else{
        $classFile = "./classes/"."class.".$folder.".php";
        if(!file_exists($classFile)){echo "ERROR - No class found";}
        else{
            require_once($classFile);
            $page = new PageClass($folder,$file,$type);
        }
    }
}

else{
    //default to index
    require_once("./classes/class.Index.php");
    $page = new PageClass("Index","index.html","html");
}
