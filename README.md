bfsite
======

This website is a personal project where I'm learning how to administer a LAMP stack.  I am using an AWS free-tier EC2
instance, running Ubuntu version 13.10.  I'm running an Apache2 web server, and using a custom-built PHP controller to
generate HTML, CSS, and Javascript content, and connect to a MySQL database.

Content as of 12/18/13:

Uno - after learning Javascript through online tutorials / resources, I chose to program the card game Uno to give myself
more of a complex challenge.  Though not very original, it was a great learning experience, and the end product looks
pretty good!

Thesaurify - a program which randomly replaces words in a given sentence with synonyms.  This program could definitely 
work better, but it would be a LOT more complicated to improve the functionality (involving NLP!), and not likely worth 
the effort.

Resume - gotta have an HTML resume!  This does need a bit of updating, and I'm considering adding in some nifty "pop-outs" 
for the technical skills section, where I can explain my knowledge of each skill.

Contact Info - just a page with my email and stuff.

Guest book - An area on the main page where visitors can leave comments.  Javascript uses AJAX calls to retrieve and add
comments to a database, using PHP scripts to communicate with MySQL.  In setting this up, I created generic methods for 
preparing parameterized database queries, and updated my controller and PHP classes to run PHP code from Ajax calls.  I 
also made the comment functions extensible to allow "non-anonymous" posts from registered users (as yet unimplemented
functionality) with little extra code, so logged in users can delete posts they've made.


In progress content / program ideas:

-User logins
-BJNK
-I'll add the rest later, it's 3 AM
