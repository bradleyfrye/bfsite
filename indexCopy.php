<?php

// Create $_SESSION variable
session_start();

$url = $_SERVER["REQUEST_URI"];
preg_match("`([^/]+)`",substr($url,1),$matches);
$folder = $matches[1]; 

preg_match("`/([^/]+)`",substr($url,1),$matches);
$file = $matches[1];

if($folder == "index.css"){
    //special handling...make this better later!
    header("Content-Type: text/css");
    echo file_get_contents("./bfsite/index.css");
}
elseif($folder == "index.js"){
    //more special handling...not sure how to do js yet
    header('Content-Type: application/javascript');
    echo file_get_contents("./bfsite/index.js");
}
elseif($folder == "bootstrap"){
    header("Content-Type: text/css");
    echo file_get_contents("./bfsite/bootstrap/css/bootstrap.css");
}
elseif($folder != "" && file_exists("./bfsite/".$folder)){
    $filename = "./bfsite/".$folder."/".$file;
    if($file != "" && file_exists($filename)){
        // Either a css or js file, determine which
        preg_match("`\.([A-Za-z]+)`",$file,$matches);
        $type = $matches[1];
        if($type == "css"){
            // handle css file
            header("Content-Type: text/css");
            echo file_get_contents($filename);
        }
        elseif($type == "js"){
            // handle js file
            header('Content-Type: application/javascript');
            echo file_get_contents($filename);
        }
        else{
            echo "ERROR - unsupported file type!";
        }
    }
    else{
        // Look up .html file, make sure it exists
        $filename = "./bfsite/".$folder."/".strtolower($folder).".html";
        if(file_exists($filename)){
            // get html file
            echo file_get_contents($filename);
        }
        else{
            echo "ERROR - no content found in directory!";
        }
    }
}
else{
    // URL given doesn't have folder, default to homepage
    echo file_get_contents("./bfsite/index.html");
}

