<?php

require_once("./classes/class.Page.php");
require_once("./classes/class.Logging.php");

class PageClass extends Page {
    // Index class	
	function init(){
        $this->logging = new Logging();
        $this->enableLogging = 1;
        if($this->type == 'php'){
            // doesn't follow the usual retrieve/echo content process
            require_once("./Index/".$this->file);
        }
                
        else{
            $this->retrieveContent();
            
            if($this->type == "html"){
                $this->loginContext();
            }

            $this->createContent();
        }
	}
    
    function loginContext(){
        $loggedIn = $_SESSION["loggedIn"];
        $placeHolder = "{index_placeholder}";
        if($loggedIn == 1){
            // just show logout button   
            $html = "<a href='http://www.bradleyfrye.com?logout=1'><p class='navItem navRight' id=logout>Log Out</p></a>";
            if($this->enableLogging){$this->logging->logMessage("Index.php, logged in - SESSION['loggedIn'] contents: ".$_SESSION["loggedIn"]);}
            $this->content = str_replace($placeHolder,$html,$this->content);
        }
        else{
            // include register and login options
            $html = "<a href='https://www.bradleyfrye.com/Register'><p class='navItem navRight' id=register>Register</p></a><p class='separator navItem navRight'>|</p>";
            $html .= "<a href='https://www.bradleyfrye.com/Login'><p class='navItem navRight' id=login>Login</p></a>";
            if($this->enableLogging){$this->logging->logMessage("Index.php, not logged in - SESSION['loggedIn'] contents: ".$_SESSION["loggedIn"]);}
            $this->content = str_replace($placeHolder,$html,$this->content);
        }
    }
}
