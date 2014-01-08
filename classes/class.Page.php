<?php

class Page {
	function __construct($pageName,$file,$pageType,$path){
        $this->folder   = $pageName;
        $this->file     = $file;
        $this->type     = $pageType;
        $this->path     = $path;
		
		$this->init();
	}
	
	function retrieveContent(){
		// get content into this->content, don't echo yet
		// assume we know content exists already, url parsing should confirm

		$filename = "./".$this->path."/".$this->file;
		$this->content = file_get_contents($filename);
        $this->doHeaders();
	}

	function createContent(){
		// echo this->content, allow any special handling in subclass init
		echo $this->content;
	}

    function doHeaders(){
        // make browser headers if needed, based on type
        if($this->type == "css"){
            header("Content-Type: text/css");
        }
        elseif($this->type == "js"){
            header("Content-Type: application/javascript");
        }
    }
}
