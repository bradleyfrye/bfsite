<?php

    class Sanitization(){
        function __construct(){

        }

        function alphaNumeric($text){
            preg_match("/([a-zA-Z0-9]+)/",$text,$matches);
            return $matches[1];
        }

        function normalText($text){
            // take out ()[]{}<>/\
        }
    }
