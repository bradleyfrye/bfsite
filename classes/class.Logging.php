<?php

    class Logging {
        
        function __construct(){

        }

        function logMessage($message){
            date_default_timezone_set("America/Chicago");
            $date = date("m/d/Y h:i:s");
            
            $content = $date." - ".$message."\n";
            $filename = "./log/".date("m_d_Y").".txt";

            $file = fopen($filename,"a");
            fwrite($file,$content);
            fclose($file);
        }
    }
