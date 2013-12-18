<?php

require_once("./classes/class.Page.php");

class PageClass extends Page {
    // bootstrap class	
	function init(){
        $this->retrieveContent();
        $this->createContent();
	}	

}
