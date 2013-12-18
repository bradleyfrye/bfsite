<?php

require_once("./bfsite/classes/class.Page.php");

class PageClass extends Page {
    // Common class - represents reusable content for any page	
	function init(){
        $this->retrieveContent();
        $this->createContent();
	}	

}

