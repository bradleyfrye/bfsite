<?php

require_once("./classes/class.Page.php");
require_once("./classes/class.Logging.php");

class PageClass extends Page {
    // Registration class	
	function init(){
        if($this->type == 'php'){
            // doesn't follow the usual retrieve/echo content process
            require_once("./Register/".$this->file);
        }
         
        else{
            $this->retrieveContent();
            $this->createContent();
        }
	}	

}

