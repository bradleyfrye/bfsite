<?php

require_once("./classes/class.Page.php");
require_once("./classes/class.Logging.php");

class PageClass extends Page {
    // Index class	
	function init(){
        $logging = new Logging();
        if($this->type == 'php'){
            // doesn't follow the usual retrieve/echo content process
            require_once("./Index/".$this->file);
        }
        
        else{
            $this->retrieveContent();
        
            $this->createContent();
        }
	}	

}
