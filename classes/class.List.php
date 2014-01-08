<?php

    require_once("./classes/class.Page.php");
    require_once("./classes/class.Mysql.php");
    require_once("./classes/class.Logging.php");

    class PageClass extends Page {
        // List class	
        function init(){
            $this->logging = new Logging();
            if($this->type == 'php'){
                require_once("./".$this->path."/".$this->file);
            }
            else{
                $this->retrieveContent();

                if($this->type == 'html'){
                    $this->loginContext();
                }
                $this->createContent();
            }
        }	
        
        function placeHolderEdit($placeholder,$newText){
            $this->content = str_replace($placeholder,$newText,$this->content,$ct);
            if($ct < 1){
                $this->logging->logMessage("List class error - placeholder not found: ".$placeholder);
            }
        }

        function loginContext(){
            $loggedIn = $_SESSION['loggedIn'];
            if($loggedIn){
                // logged in page - show welcome to user, houses they're in, new house button, house join button
                $userAry = $this->getUserContent();
                $html = "<div class=welcome>Welcome to shopping list, ".$userAry["userName"]."!</div>";

                $this->placeholderEdit("{welcome_placeholder}",$html);

                $this->mysql = new Mysql();
                if(!$this->mysql->connected){
                    // Issue w/ database - not talking w/ ajax here, need to put error msg in html
                    die("Mysql problems!");
                }

                // Check which house(s) current user is a member of            
                $query = "select ID from Houses where USER_ID=".$userAry["ID"].";";
                $results = $this->mysql->multiRowQuery($query);
                $ct = count($results);
                $this->logging->logMessage("List class - query: ".$query."\nresult: ".$results[0]["ID"]);

                if($ct < 1){
                    $html = "<div class=houseDisplay noHouses>Your user is not in any houses.</div>";
                }
                else{
                    $html = "<div class=houseDisplay houseCt>You are a member of ".$ct." house(s):</div>";
                    
                    for($i = 0;$i<$ct;$i++){
                        $id = $results[$i]["ID"];
                        $query = "select NAME from Houses where ID=".$id;
                        $results = $this->mysql->singleRowQuery($query);
                        $name = $results["NAME"];

                        $html .= "<div class=houseDisplay><a href=/List/".$name.">".$name."</a></div>";
                    }
                }
                $this->placeholderEdit("{houses_display_placeholder}",$html);

                // Show link for house search page
                $html = "<div class houseSearch><a href=/List/houseSearch>Click here to search for a house to join</a></div>";
                $this->placeholderEdit("{houses_search_placeholder}",$html);

                // Show link (or form?) for house creation
                $html = "<div class houseCreate><a href=/List/houseCreate>Click here to create a new house</a></div>";
                $this->placeholderEdit("{new_house_placeholder}",$html);
            }
            else{
                // not logged in page - give links to Login,Register, and Index
                $placeholder = "{welcome_placeholder}";
                $html = "<div>You are not logged in</div>";

                $this->content = str_replace($placeholder,$html,$this->content);
            }
        }

        function getUserContent(){
            $userAry["userName"] = $_SESSION["userName"];
            $userAry["ID"] = $_SESSION["ID"];
            return $userAry;
        }
    }

