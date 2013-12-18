<?php

require_once("./bfsite/classes/class.Page.php");

class PageClass extends Page {
    // Uno class	
	function init(){
        $this->retrieveContent();
        $this->createContent();
	}	

}
