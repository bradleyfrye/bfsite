<?php

require_once("./bfsite/classes/class.Page.php");

class PageClass extends Page {
    // Thesaurify class	
	function init(){
        $this->retrieveContent();
        $this->createContent();
	}	

}
