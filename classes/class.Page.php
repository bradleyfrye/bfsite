<?php

class Page {
	function __construct($pageName,$pageType){
		$this->pageName 	= $pageName;
		$this->pageType     = $pageType;
		
		$this->init();
	}
	
	this->retrieveContent(){
		// get content into this->content, don't echo yet
		// assume we know content exists already, url parsing should confirm

		$filename = "./bfsite/".$this->pageName."/".$this->pageName.".html";
		$this->content = file_get_contents($filename);
	}

	this->createContent(){
		// echo this->content, allow any special handling in subclass init
		echo $this->content;
	}
}
