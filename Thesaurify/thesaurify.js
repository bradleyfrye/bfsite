String.prototype.capitalize = function(){
	return this[0].toUpperCase() + this.slice(1);
};

// create some global vars. may be a better way than this
curNum=0;
WordAry = [];
clickedWord = -1; // global selector of clicked word; make other word 'unclicked' when new one is clicked
exceptWords = ["I","A","ME","IN","AM","ARE","AS","NOT"];

var Word = function(origWord,index){

	this.init = function(word,index){
		var reg = /[\?\!\.,]/;
		var result = reg.exec(word);
		if(result === null){this.origWord = word;}
		else{
			this.follower = result[0];
			this.origWord = word.replace(this.follower,"");
		}
		if(index === '0'){this.capital = true;}
	};	
	
	this.locked = 0; // turn to 1 when locking the word
	this.init(origWord,index);
	this.chosenWord = this.origWord;
	this.chosenType;
    this.index = index;
    this.hasSyns = false; // set to true unless word has no syns, e.g. 'the'
    this.typeAry = []; // holds a list of types contained
    this.list = [];
	
    /*
     * Array structure:
     * list[[type1,(array of syns of type1)],[type2,(array of syns of type2],...]
     * 
     * Example (orig word = 'drink'):
     * list[["noun",["beverage",etc...]],["verb",["quaff","chug",etc...]]]
     */
    
    this.formList = function(response){
        var inputList, type, index, syns;
        var partArray=[];
        
        for(var i=0;i<response.length;i++){
            inputList = response[i].list;
            type = this.cleanType(inputList.category);
			if(i === 0){this.chosenType = type;} // use 1st one by default
            index = this.typeAry.indexOf(type);
            if(index === -1){
                this.typeAry.push(type);
                var partArray = [];
                partArray.push(type);
                syns = inputList.synonyms.split("|");
                syns = this.cleanSyns(syns);
                partArray.push(syns);
                this.list.push(partArray);
            }
            else{
                syns = inputList.synonyms.split("|");
                syns = this.cleanSyns(syns);
                this.list[index][1].push.apply(this.list[index][1],syns); // push.apply - proper way to concat two arrays
            }
        }
    };
    
    this.getSyn = function(){
        if(!this.hasSyns || this.locked){return this.formatResponse(this.origWord);}
        var partIndex = this.typeAry.indexOf(this.chosenType);
        var syns = this.list[partIndex][1];
        var synIndex = Math.floor(Math.random()*syns.length);
		return this.formatResponse(syns[synIndex]);
    };
    
	this.formatResponse = function(word){
		if(this.capital){word = word.capitalize();}
		if(this.follower){word += this.follower;}
		return word;
	};
	
    this.cleanSyns = function(syns){
        var word,pieces;
        var newSyns = [];
        
        for(var i in syns){
            word = syns[i];
            pieces = word.split(" (");
            if(pieces[1] === "antonym)"){continue;}
            else{newSyns.push(pieces[0]);}
        }
        
        return newSyns;
    };
	
	this.cleanType = function(type){
		type = type.replace("(","");
		return type.replace(")","");
	};
};

var getSynonym=function(word){
	var xWord;
	// check for certain words that thesaurify weirdly
	for(var i=0;i<exceptWords.length;i++){
		xWord = exceptWords[i];
		if(word.toUpperCase() === xWord){
			WordAry[curNum].hasSyns = false; // false is default, so technically unnecessary
			curNum++;
			if(curNum === WordAry.length){
				initConfig();
			}
			else{
				getSynonym(WordAry[curNum].origWord);
			}
			return;
		}
	}
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.onerror = function(){
        // 404 due to no synonyms for word
        WordAry[curNum].hasSyns = false; // false is default, so technically unnecessary
        curNum++;
        if(curNum === WordAry.length){
            initConfig();
        }
        else{
            getSynonym(WordAry[curNum].origWord);
        }
    };
    s.src = "http://thesaurus.altervista.org/service.php?word=" + word + "&language=en_US&output=json&key=MHJlyqG1uoVLlpw9gh7n&callback=process"; // NOTE: replace test_only with your own KEY
    document.getElementsByTagName("head")[0].appendChild(s);
};

function process(result) {
    var Word = WordAry[curNum];
    Word.formList(result.response);
    Word.hasSyns = true;
    curNum++;
    if(curNum === WordAry.length){
        initConfig();
    }
    else{
        // call getSynonym for next word in global array
        getSynonym(WordAry[curNum].origWord);
    }
}

var initConfig = function(){
	$("#loadingWrapper").css("display","none");
	$("#Thesaurify").css("display","inline");
	var Word;
	var type,types,html,$word,clickedNum;
	for(var i=0; i<WordAry.length; i++){
		Word = WordAry[i];
		if(Word.hasSyns){
			$word = $(getSynHtml(Word));
			$word.click(function(Word){
				// use closure to bind Word to click function
				return function(){
					if(clickedWord === Word.index){return;} // don't need to do all this if it's already open
					// first, take away clicked-ness of already clicked
					$("#"+clickedWord+" > select").remove();
					$("#"+clickedWord+" > div").remove();
				
					clickedWord = Word.index;
					types = Word.typeAry;
					html = "<select>";
					for(var j=0;j<types.length;j++){
						type = types[j];
						html += "<option value='"+type+"'";
						if(type === Word.chosenType){html+=" selected";}
						html += ">"+type+"</option>";
					}
					html +="</select>";
					
					// add lock checkbox
					html +="<div>&#x1f512;<input type='checkbox'"
					if(Word.locked){html += " checked";}
					html +="/></div>"; 
					
					$(this).append(html);
					
					$("#"+clickedWord+" > select").change(function(){
						Word.chosenType = $("#"+clickedWord+" > select option:selected").text();
						var $thisWord = $("#"+clickedWord);
						$thisWord.removeClass(); // remove all classes
						$thisWord.addClass("config");
						$thisWord.addClass(Word.chosenType);
					});
					
					$("#"+clickedWord+" > div > input").change(function(){
						Word.locked = (Word.locked - 1)*-1; // Change 0 <-> 1
					});
				}
			}(Word));
			$("#config").append($word);
		}
		else{
			// TODO - going to need to ID divs so we know what's clicked
			$("#config").append("<div class='config noSyns' id='"+Word.index+"'>"+Word.origWord+"</div>");
		}
		
		if(Word.follower !== undefined){$("#config").append("<span>"+Word.follower+"</span>");}
		
	}
	
	// Display a hidden "Thesaurify" button
};

var getSynHtml = function(Word){
	// form html for word w/ syns, not selected
	var id = Word.index; 
	var type = Word.chosenType;
	var word = Word.chosenWord;
	return "<div class='config "+type+"' id='"+id+"'>"+word+"</div>";
};

$(document).ready(function(){
    
    var $submit = $("#Submit");
    var text;
    var word;
    
    $submit.click(function(){
        WordAry.length = 0;
        curNum = 0;
        $("#synonyms").html("");
		$("#config").html("");
        text = $("#input").val();
        if(text === ''){
            alert("No text was entered.");
        }
        else{
			// Add a 'loading' dialog
			$("#loadingWrapper").css("display","inline");
            var inputAry = text.split(' ');
            for(word in inputAry){WordAry.push(new Word(inputAry[word],word));} // puts input in new Word object in WordAry
            getSynonym(WordAry[curNum].origWord); // kick off w/ first word, function will loop thru ary until done
        }
    });
	
	var $synonyms = $("#synonyms");
	var $thesaurify = $("#Thesaurify");
	$thesaurify.click(function(){
		$synonyms.empty();
		for(var i=0; i<WordAry.length; i++){
			$synonyms.append(WordAry[i].getSyn() + " ");
		}
	});
	
	$("#instTitle").click(function(){
		$("#instructions").slideToggle();
		var $inst = $("#instTitle");
		var html = $inst.html();
		if(html.contains("\u25BC")){html = html.replace("\u25BC","\u25B2");}
		else{html = html.replace("\u25B2","\u25BC");}
		$inst.html(html);
	});
});