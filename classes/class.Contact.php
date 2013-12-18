<?php

require_once("./bfsite/classes/class.Page.php");

class PageClass extends Page {
    // Contact info page	
	function init(){
        $this->retrieveContent();
        $this->createContent();
	}	

}

