<?php

require_once("./classes/class.Page.php");

class PageClass extends Page {
    // Login class	
	function init(){
        if($this->type == "php"){
            require_once("./Login/".$this->file);
        }
        
        else{
            $this->retrieveContent();
            $this->createContent();
        }
	}	

}

