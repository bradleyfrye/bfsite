<?php

require_once("./classes/class.Page.php");

class PageClass extends Page {
    // Common class - represents reusable content for any page	
	function init(){
        $this->retrieveContent();
        $this->createContent();
	}	

}

