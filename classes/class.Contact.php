<?php

require_once("./classes/class.Page.php");

class PageClass extends Page {
    // Contact info page	
	function init(){
        $this->retrieveContent();
        $this->createContent();
	}	

}

