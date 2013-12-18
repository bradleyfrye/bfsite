<?php

    require_once("./bfsite/classes/class.Logging.php");

    class Mysql {
        function __construct(){
            $this->connected = false;
            // connecting to server as root user, test database, testTable table
            if($this->database = mysqli_connect("localhost","root","Potato2812","test")){
                $this->connected = true;
            }
            else{
                if($logging_enabled){$logging->logMessage("Failed to connect to MYSQL database.");}
                // NOTE - should check for connection failure elsewhere in website, not just have queries fail
            }

            $this->logging = new Logging();
            $this->logging_enabled = 1;
        }

        function singleRowQuery($query){
            if(!$this->connected){
                // Cannot query w/o connection
                return false;
            }
            $result = $this->database->query($query);
            if($rows = mysqli_fetch_array($result,MYSQLI_ASSOC)){
                return $rows; // this method should only get 1 row, return first array
            }
        }

        function multiRowQuery($query){
            if(!$this->connected){
                // Cannot query w/o connection
                return false;
            }
            $resultAry = array();
            $i = 0;

            $result = $this->database->query($query);
            while($rows = mysqli_fetch_array($result,MYSQLI_ASSOC)){
                $resultAry[$i] = $rows;
                $i = $i + 1;
            }

            return $resultAry;
        }

        // Secure function, using param binding!
        function changeQuery($query,$types,$valAry){
            // do some thing that shouldn't get rows back
            // may need to refactor this, have separate user for security

            if(!$this->connected){
                return false;
            }

            // possibly add validation - # of ?'s in $query should == strlen($types) == count($valAry)

            $funcAry = array($types);
            $funcAry = array_merge($funcAry,$valAry);

            $stmt = $this->database->prepare($query);
            // Example normal bind_param call would be: $stmt->bind_param("ssd",$v1,$v2,$v3)

            if($this->logging_enabled){
                $str = "";
                for($i=0;$i<count($funcAry);$i++){
                    $str .= "[".$i."]:".$funcAry[$i]."; ";
                }
                $this->logging->logMessage("Mysql class - funcAry: ".$str);
            }
            
            call_user_func_array(array($stmt,'bind_param'),$funcAry);
            $stmt->execute();
            $aff_rows = $stmt->affected_rows;

            if($this->logging_enabled){
                $this->logging->logMessage("Mysql class - affected rows: ".$aff_rows);
            }
            
            $stmt->close();

            if($aff_rows){return true;}
            else{return false;}
        }
    }
