
var Card = function(color,value,id){
	this.color=color;
	this.value=value;
	this.id=id;
        this.hidden=0;
	//other props/methods
	// - possible - abbrev?  for "white circle" part of card
};

var Deck = function(){
	var cards = [];
	this.getNumCards = function(){
		return cards.length;
	};
	this.getCard = function(location){
		//if no location given, assume draw - pop the card
		if(location === undefined){
                    var testCard = cards.pop();
                    return testCard;
		}
		else{return cards[location];}
	};
	this.addCard = function(Card){
		cards.push(Card);
	};
	this.remove = function(location){
		cards.splice(location,1);
	};
	this.initialize = function(){
		var colors=["blue","green","red","yellow"];
		var color;
		for(var i=0;i<colors.length;i++){
			color=colors[i];
			this.addCard(new Card(color,"0"));
			this.addCard(new Card(color,"D2"));
			this.addCard(new Card(color,"D2"));
			this.addCard(new Card(color,"R"));
			this.addCard(new Card(color,"R"));
			this.addCard(new Card(color,"S"));
			this.addCard(new Card(color,"S"));
			for(var j=1;j<10;j++){
				this.addCard(new Card(color,j));
				this.addCard(new Card(color,j));
			}
		}
		this.addCard(new Card("gray","W"));
		this.addCard(new Card("gray","W"));
		this.addCard(new Card("gray","W"));
		this.addCard(new Card("gray","W"));
		this.addCard(new Card("gray","W4"));
		this.addCard(new Card("gray","W4"));
		this.addCard(new Card("gray","W4"));
		this.addCard(new Card("gray","W4"));
	};
	this.shuffle = function(){
		var len = cards.length;
		var newCards = [];
		var rand;
		for(var i=0;i<len;i++){
			rand = Math.floor(Math.random()*(len-i));
			newCards.push(cards[rand]);
			cards.splice(rand,1);
		}
		cards=newCards;
	};
};

var Player = function(name,loc,isCPU){
	this.name = name;
	this.loc = loc;
        this.isCPU = isCPU;
	var hand = new Deck();
	this.$selectedElem;
	this.selectedCard;
	this.selectedNum;
	var player=this;
	this.drawCards = function(){
		for(var i=0;i<hand.getNumCards();i++){
			var card = hand.getCard(i);
			card.id=i;
			this.drawCard(card,loc);
		}
	};
	
	this.clearCards = function(){
		for(var i=0;i<hand.getNumCards();i++){
			var card = hand.getCard(i);
			$("#"+loc+" > div").remove();
		}
	};
	
	this.addCard = function(Card){
		this.clearCards();
		Card.id = hand.getNumCards();
		hand.addCard(Card);
                if(this.isCPU){Card.hidden=1;}
		this.drawCards();
	};
	
	this.getCard = function(position){
		return hand.getCard(position);
	};
	
	this.playCard = function(){
		this.clearCards();
		hand.remove(this.selectedNum);
		this.drawCards();
		this.$selectedElem = undefined;
		this.selectedCard = undefined;
		this.selectedNum = undefined;
	};
	
        this.moveCard = function(Card,fromLoc,toLoc){
            var id = fromLoc + "_" + Card.id;
            var $card = $("#"+id);
            var $loc = $("#"+toLoc);
            var delX = $loc.offset().left - $card.offset().left;
            var delY = $loc.offset().top - $card.offset().top;
            $card.css("z-index",1000);

            $card.animate({
                // animation properties
                top: "+="+delY,
                left: "+="+delX
            }, 300, function(){
                // animation complete
                $card.remove();
            });
        };
        
	this.getNumCards = function(){
		return hand.getNumCards();
	};
        
        // Just return deck object - for CPU card checking
        this.getHand = function(){
            return hand;
        };
	
	this.drawCard = function(Card,loc,simple){
                var color, value;
                if(Card.hidden === 1){
                    color = "black";
                    value = "UNO";
                }
                else{
                    color = Card.color;
                    value = Card.value;
                }
		var id = Card.id;
		id = loc + "_" + id;
		var html = formCardHtml(id,color,value);
		if(simple){$("#"+loc).append(html);}
		else{
			var $card = $(html);
			//add clicking functionality here, needs to be added per card!
			$card.click(function(){
				if(typeof player.$selectedElem === "object"){
					player.$selectedElem.removeClass("selected");
				}
				var id = $(this).prop("id");
				var num = id.split("_")[1];
				var card = player.getCard(num);
				if(card === player.selectedCard){
					player.$selectedElem.removeClass("selected");
					player.selectedCard = undefined;
					return;
				}
				player.$selectedElem = $(this);
				player.$selectedElem.addClass("selected");
				player.selectedCard = card;
				player.selectedNum = num;
			});
			$("#"+loc).append($card);
		}
	};
};

var Game = function(players,deck){
	this.players = players;
	this.numPlayers = players.length;
	this.deck = deck;
	this.discard = new Deck();
	this.color;
	this.value;
	this.dir = 1; // Play direction, reversed by Reverse card - turns to -1
	this.playerTurn=0;
	var game = this;
	this.colorSelect = 0; // Set to 1 when wild is played, indicate color selection needed
	this.passSelect = 0; // Set to 1 when player draws card to pass, waiting for them to play or pass
        this.instDown = 0; // Set to 1 when instructions are displayed, disable other clickables
        this.wd4Card = 0; // Set to 1 when WD4 was played, so we know to adv turn twice after col selected
        
	var playerIndex = [];
	for (var i=0; i<this.numPlayers; i++){
		playerIndex[i] = players[i].loc;
	}
	
        //returns name of [loc] player
	this.getPlayer = function(loc){
		return players[playerIndex.indexOf(loc)];
	};
	
	this.initialize = function(){
		this.players[0].drawCard(new Card("black","UNO"),"draw",1);
		var ct = deck.getNumCards();
		$("#drawCount").html(ct);
		var firstCard = deck.getCard();
		this.addToDiscard(firstCard);
		game.update(firstCard);
                // Unless skipped, make cpu play first turn
                if (this.playerTurn === 1){this.playCpuTurn();}
	};
	
	this.advanceTurn = function(){
		this.playerTurn = this.getNextTurn();
		$("#whoseTurn").html(this.players[this.playerTurn].name + "'s turn");
	};
	
        // helper function to figure out next turn
        this.getNextTurn = function(){
            var num = this.playerTurn + this.dir;
            var pNum = this.numPlayers;
            if(num === (pNum + (pNum+1)*(this.dir-1)/2)){
                num = (pNum-1)*((1-this.dir)/2);
            }
            return num;
        };
        
        this.playCpuTurn = function(){
            var cpu = this.players[1];
            var hand = cpu.getHand();
            var cardFound = 0;
            var i = 0;
            var card;
            var timeOutID;
            while(cardFound === 0 && i < hand.getNumCards()){
                card = hand.getCard(i);
                if(this.check(card)){cardFound = 1;}
                else{i+=1;}
            }
            if(cardFound){
                cpu.selectedNum = i;
                cpu.moveCard(card,"CPU","discard");
                timeOutID = window.setTimeout(function(){game.playCpuCard(card);},500);
                // if cpu played last card, need to end game
                timeOutID = window.setTimeout(function(){
                    if(hand.getNumCards() === 0){
                        game.endGame(cpu.name);
                        return;
                    }
                },500);
            }
            else{
                // cpu passes - need to draw card, check if playable
                var drawCard = new Card("Black","UNO","draw");
                cpu.drawCard(drawCard,"draw",1);
                $("#draw_draw").css("position","absolute");
                cpu.moveCard(drawCard,"draw","CPU");
                timeOutID = window.setTimeout(function(){game.cpuDrawCard();},500);
            }

            // check player turn, play again immediately if player skipped
            timeOutID = window.setTimeout(function(){
                    if (game.playerTurn === 1){game.playCpuTurn();}
                },1100);
        };
        
        this.playCpuCard = function(card){
            card.hidden=0;
            var cpu = game.players[1];
            game.addToDiscard(card);
            cpu.playCard(card);
            var hand = cpu.getHand();
            var val = card.value;
            // if card picked is wild, need special handling
            if(val === "W" || val === "W4"){
                var cardFound = 0;
                i = 0;
                // look through hand, pick first non-wild color
                while(cardFound === 0 && i < hand.getNumCards()){
                    card = hand.getCard(i);
                    if(card.color === "gray"){continue;}
                    else{
                        this.color = card.color;
                        cardFound = 1;
                    }
                    if(!cardFound){this.color = "red";} // arbitrarily pick red if only wilds
                    $("#curColor").html(game.color);
                    $("#curValue").html(val);
                }
                this.advanceTurn();
                if(val === "W4"){
                    this.advanceTurn();
                    this.takeCard(this.players[this.getNextTurn()],4);
                }
            }
            else{
                this.update(card);
            }
        };
        
        this.cpuDrawCard = function(){
            // Put cpu's passing actions in here for animation delay
            var cpu = game.players[1];
            game.takeCard(cpu,1);
            var hand = cpu.getHand();
            var card = hand.getCard(hand.getNumCards()-1);
            if(game.check(card)){
                //play the card 
                cpu.selectedNum = hand.getNumCards()-1;
                cpu.moveCard(card,"CPU","discard");
                var timeOutID = window.setTimeout(function(){game.playCpuCard(card);},500);
            }
            else{
                game.advanceTurn();
            }
        };
        
	this.update = function(Card){
		this.color = Card.color;
		$("#curColor").html(this.color);
		this.value = Card.value;
		$("#curValue").html(this.value);
		if (this.value === "R"){
			this.dir = this.dir *(-1);
			if (this.numPlayers === 2){this.advanceTurn();}
		}
		if (this.value === "S"){this.advanceTurn();}
		if (this.value === "D2"){
			this.advanceTurn();
			this.takeCard(this.players[this.playerTurn],2);
		}
		if (this.value === "W"){
			// prompt current player for color
			this.colorSelect=1;
			$("#colorsWrapper").css("visibility","visible");
                        $("#whoseTurn").html($("#whoseTurn").html() + " - waiting on color selection");
                        return; // Don't advance turn til color is picked
		}
		if (this.value === "W4"){
			// prompt cur player for color
			this.colorSelect=1;
			$("#colorsWrapper").css("visibility","visible");
			this.takeCard(this.players[this.getNextTurn()],4);
                        this.wd4Card = 1;
                        return; // Don't advance turn til color is picked
		}
		this.advanceTurn();
	};
	
	this.addToDiscard = function(Card){
		this.discard.addCard(Card);
		$("#discard").empty();
		game.players[0].drawCard(Card,"discard",1); // player 0 is arbitrary
		$("#discardCount").html(game.discard.getNumCards());
	};
	
	this.takeCard = function(player,number){
		for(var i=0; i<number; i++){
			var crd = this.deck.getCard();
                        if(player.isCPU){crd.hidden=1;}
			player.addCard(crd);
		}
		var ct = this.deck.getNumCards();
		$("#drawCount").html(ct);
		if(ct < 1){
			// shuffle discard cards into deck, except top card on discard
			
			var tempCard = this.discard.getCard();
			var numCard = this.discard.getNumCards();
			alert("Shuffling discard into draw pile");
			for(var i=0; i<numCard; i++){
				this.deck.addCard(this.discard.getCard());
			}
			alert("Done!");
			this.addToDiscard(tempCard);
			this.deck.shuffle();
			$("#discardCount").html(game.discard.getNumCards());
		}
	};
	
	this.check = function(Card){
		var colOk = (Card.color === this.color);
		var valOk = (Card.value === this.value);
		var wild = (Card.value === "W" || Card.value === "W4");
		return (wild || colOk || valOk);
	};
	
	this.play = function(){
		
                $("#instructionTitle").click(function(){
                    if(game.instDown === 0){
                        $("#instructions").slideDown();
                        $("#wrapper div").css("opacity","0.5");
                        $("#instructionWrapper").css("opacity",1);
                        $("#instructionWrapper div").css("opacity",1);
                        game.instDown = 1;
                        $("#instructionTitle").html("Instructions&#x25B2;");
                    }
                    else{
                        $("#instructions").slideUp();
                        $("#wrapper div").css("opacity","1");
                        game.instDown = 0;
                        $("#instructionTitle").html("Instructions&#x25BC;");
                    }
                });
                
		$("#Play").click(function(){
                    if(game.instDown === 1){return;}
                    var card = game.players[game.playerTurn].selectedCard;
                    if(game.colorSelect === 1){
                            alert("Waiting for color selection!");
                    }
                    else if (game.passSelect === 1)
                    {
                        if(game.players[game.playerTurn].selectedNum != (game.players[game.playerTurn].getNumCards()-1)){
                            alert("Must select drawn card!");
                        }
                        else if(game.check(card)){
                            game.addToDiscard(card);
                            game.players[game.playerTurn].playCard();
                            game.update(card);
                            game.passSelect = 0;
                        }
                        else{
                            alert("Not a valid card.");
                        }
                    }
                    else if (card === undefined){
                        alert("No card selected by player " + game.players[game.playerTurn].name);
                    }

                    else if (game.check(card)){
                        game.addToDiscard(card);
                        game.players[game.playerTurn].playCard();
                        game.update(card);
                    }
                    else{
                        alert("Not a valid card.");
                    }
                    //Check for end game
                    for(var i=0;i < game.players.length; i++){
                        if(players[i].getNumCards() === 0){
                            game.endGame(players[i].name);
                            return;
                        }
                    }
                    if(game.playerTurn === 1){game.playCpuTurn();}
		});
		
		$("#Pass").click(function(){
                    if(game.instDown === 1){return;}
                    if(game.passSelect === 0){
                        game.takeCard(game.players[game.playerTurn],1);
                        game.passSelect = 1;
                        $("#whoseTurn").html($("#whoseTurn").html()+ " - waiting on pass/play");
                    }
                    else{
                        game.advanceTurn();
                        game.passSelect = 0;
                        if(game.playerTurn === 1){game.playCpuTurn();}
                    }
		});
		
		$("#Color").click(function(){
                    var cl = $("#colorsWrapper input[type='radio']:checked").val();
                    game.color = cl;
                    game.colorSelect = 0;
                    $("#colorsWrapper").css("visibility","hidden");
                    $("#curColor").html(cl);
                    game.advanceTurn();
                    if(game.wd4Card){
                        game.advanceTurn();
                        game.wd4Card = 0;
                    }
                    if(game.playerTurn === 1){game.playCpuTurn();}
		});
                
                $("#Replay").click(function(){
                    location.reload(); //just reload the page!
                });
	};
        
        this.endGame = function(name){
            $("*").css("visibility","hidden");
            $("#whoseTurn").css("visibility","visible");
            $("#whoseTurn").html("<br/><br/>WINNER: "+name+"<br/><br/> ");
            $("#Replay").css("visibility","visible");
        };
};

var deal = function(deck,players){
	var numPlayers = players.length;
	var player;
	for(var j=0;j<7;j++){
		for(var i=0;i<numPlayers;i++){
			player = players[i];
			player.addCard(deck.getCard());
		}
	}
};

var formCardHtml = function(id,color,value){
	return "<div class=outerBorder id="+id+"><div class=innerBorder style=background:"+color+"><div class=cardTopLeft>"+value+"</div><div class=cardCenter>"+value+"</div><div class=cardBottomRight>"+value+"</div></div></div>";
};

$(document).ready(function() {
	//drawCard(new Card("black","UNO"),"#draw");
	var deck = new Deck();
	deck.initialize();
	deck.shuffle();
	var player = new Player("Player","player",0);
	var cpu = new Player("CPU","CPU",1);
	var players = [player,cpu];
	var game = new Game(players,deck);
	
	// should create deck for discard - shuffle discard cards when draw runs out
	
	//Deal!
	deal(deck,players);
	game.initialize();
	game.play();
});
