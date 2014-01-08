<?php
    
require_once("./classes/class.Page.php");

class PageClass extends Page {
	
	function init(){
        $this->retrieveContent();
        $this->createContent();
	}	

}

