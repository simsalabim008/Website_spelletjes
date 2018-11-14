const R        = 10,          // straal van een element
      STEP     = 2*R,         // stapgrootte
      WIDTH    = 360,         // breedte veld 
      HEIGHT   = 360,         // hoogte veld 
                              // er moet gelden: WIDTH = HEIGHT
      MAX      = WIDTH/STEP-1,// netto veldbreedte   
      LEFT     = "left",      // bewegingsrichtingen 
      RIGHT    = "right",
      UP       = "up",
      DOWN     = "down",

      NUMFOODS = 15,          // aantal voedselelementen       

      XMIN     = R,           // minimale x waarde 
      YMIN     = R,           // minimale y waarde 
      XMAX     = WIDTH - R,   // maximale x waarde 
      YMAX     = HEIGHT - R,  // maximale y waarde 

      SNAKE   = "DarkRed" ,   // kleur van een slangsegment
      FOOD    = "Olive",       // kleur van voedsel
	    HEAD    = "DarkOrange"   // kleur van de kop van de slang
	
var snake, timeInterval,
    foods = [];                                // voedsel voor de slang
	
$(document).ready(function() {
	$("#startSnake").one("click", init);  
	$("#stopSnake").on("click", stop);
});

/*************************************************************************************************
 **                                    Nieuwe code                                              **
 *************************************************************************************************/
 /***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/
 /***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/
/**
 @function collidesWithOneOf () --> true als segmenten zelfde coordinaten hebben.
 @desc Hulpfunctie van createFoods. De methode kan aangeroepen worden op een voedselelement, er kan een array van slangsegmenten worden meegegeven om te vergelijken.
De methode controleert of een voedselsegment dezelfde coordinaten heeft als een slangsegment en/of een al bestaand voedselsegment.
 @returns boolean True or False
 */
Element.prototype.collidesWithOneOf = (function (elements) {
  if(elements.forEach(function() {
    return ((elements[0].y === this.y) && (elements[0].x === this.x));
  }));
});

/**
 @function collidesWithFood() --> True als hoofd van de slang een voedselsegment tegenkomt.
 @description Hulpfunctie van changesegments. De methode wordt aangeroepen op de slang, in dit geval het eerste segment het hoofd van de slang. De methode controleert of het
segment van het hoofd van de slang dezelfde coordinaten heeft als een voedselsegment. Indien dat het geval is wordt True teruggegeven, anders false.
 @returns boolean True or False
 */
Snake.prototype.collidesWithFood = (function(elements) {
  let i;
   for(i = 0; i < elements.length; i++) {
    if ((elements[i].y === snake.segments[0].y) && (elements[i].x === snake.segments[0].x)) {
      return true;
    }
  }
  return false;
});

/**
 @function canMove () --> Geeft False terug indien slang buiten het canvas dreigt te gaan, anders True.
 @desc Hulpfunctie van move. Controleert of slang binnen het canvas blijft. Indien buiten canvas dreigt te gaan of de slang 
 dreigt zichzelf tegen te komen, in deze gevallen wordt er False teruggeven. 
 @returns boolean True or False
 */
Snake.prototype.canMove = (function (direction) {
    if(!(snake.segments[0].y > (YMIN + 1)) && direction === UP) {
      return false;
    }
    else if(!(snake.segments[0].y < (YMAX - 1)) && direction === DOWN) {
      return false;
    }
    else if(!(snake.segments[0].x > (XMIN + 1)) && direction === LEFT) {
      return false;
    }
    else if(!(snake.segments[0].x < (XMAX - 1)) && direction === RIGHT) {
      return false;
    }
    return true;
});

/**
 @function changeSegments () --> Voegt een nieuw segment toe aan de slang en verwijdert het eerste segment(afhankelijk of het wel of geen voedselsegment is).
 @desc Hulpfunctie van doMove. Door een nieuw segment toe te voegen met daarin de nieuwe x of y locatie en oude te verwijderen, zal de slang
 op een natuurlijke manier voortbewegen. Er wordt een nieuw segment toegevoegd aan de Array en deze wordt het nieuwe hoofd van de slang.
 Het tweede segment wordt opnieuw in de lijst gezet met dezelfde rode kleur als de rest van de slang.
 Slang groeit indien een segment van de slang een voedselsegment tegenkomt. Door geen segment te verwijderen lijkt het of de slang groeit.
 Tevens vindt controle plaats of de slang zichzelf raakt, indien dit het geval is dan volgt het bericht "Game over".
 @returns void
 */
Snake.prototype.changeSegments = (function (x, y) {
      snake.segments.unshift(new Element(R, x, y, HEAD));
      snake.segments[1] = new Element(R, snake.segments[1].x, snake.segments[1].y, "DarkRed");

      if(!snake.collidesWithFood(foods)){
        snake.segments.pop();
      }
      else if(snake.collidesWithFood(foods)){
        for(let i = 0; i < foods.length; i++){
          if(snake.segments[0].x === foods[i].x && snake.segments[0].y === foods[i].y) {
            foods.splice(i, 1);
          }
        }
      }
      for (let i = 4; i < snake.segments.length; i++) {
      const didCollide = snake.segments[i].x === snake.segments[0].x && snake.segments[i].y === snake.segments[0].y
      if (didCollide) {
      return alert("Game over");
    }
  }
});

/**
 @function doMove () --> roept hulpmethode changesegments aan met de juiste richting.
 @desc Beweegt de slang in de gegeven richting. Roept de hulpmethode changeSegments aan.
 @returns void
 */
Snake.prototype.doMove = (function doMove(direction) {
  let x = snake.segments[0].x, y = snake.segments[0].y;

  // Het eerste segment, de head, dient te bewegen in de richting van direction. De overige segmenten nemen de positie van het
  // vorige segment in. Dit wordt bewerkstelligd middels een aanpassing in de array waarbij een nieuw element wordt toegevoegd, met behulp van changesegments.
  // Vervolgens wordt dit nieuwe element de head en het laatste element wordt verwijderd.
  switch (direction) {
    case UP:
        snake.changeSegments(x, y - STEP);  
      break;
    case DOWN:
      snake.changeSegments(x, y + STEP);
      break;
    case LEFT:
      snake.changeSegments(x - STEP, y);
      break;
    case RIGHT:
      snake.changeSegments(x + STEP, y);
      break;
  }
}); 

/**
 @function (e) --> arrow-keys handler
 @desc beweegt de slang in de richting aan de hand van welke pijltjesknop op het toetsenbord is gebruikt. Middels ingestelde interval blijft de slang voortbewegen.
 clearInterval zorgt ervoor dat de voorgaande interval wordt onderbroken en er een nieuwe interval kan plaatsvinden, waardoor de slang netjes in de juiste richting voortbeweegt. 
 */
document.onkeydown = function (e) {
  switch (e.key) {
    case 'ArrowUp':
      // up arrow
      clearInterval(timeInterval);
        timeInterval = setInterval(function () {
          move(UP);
        }, 200);
          // move(UP);
      break;
    case 'ArrowDown':
      // down arrow
      clearInterval(timeInterval);
        timeInterval = setInterval(function() {
          move(DOWN);
        }, 200);
      break;
    case 'ArrowLeft':
      // left arrow
      clearInterval(timeInterval);
        timeInterval = setInterval(function() {
          move(LEFT);
        }, 200);
      break;
    case 'ArrowRight':
      // right arrow
      clearInterval(timeInterval);
        timeInterval = setInterval(function() {
          move(RIGHT);
        }, 200);
      break;
  }
  e.preventDefault();
};
 
 /*************************************************************************************************
 **                                    Gegeven code                                              **
 *************************************************************************************************/
/***************************************************************************
 **                 Commando's voor de gebruiker                          **
 ***************************************************************************/
/**
  @function init() -> void
  @desc Creeer een slang, genereer voedsel, en teken alles
*/
function init() {	
  createStartSnake();
  createFoods();
  draw();  
 }

/**
  @function stop() -> void
  @desc Laat slang en voedsel verdwijnen, en teken leeg veld
*/
function stop() {
  clearInterval(timeInterval);
	snake = null;
	foods = [];
	draw();
}

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
function move(direction) {
	if (snake.canMove(direction)) {
      snake.doMove(direction);
      draw();
	}
	else {
		alert("Game Over, snake cannot move " + direction);
	}
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
  var canvas = $("#mySnakeCanvas").clearCanvas();
  canvas[0].getContext("2d");

	if (snake) {
		snake.segments.forEach(function (segment) {
			drawElement(segment, canvas);
		});
	}
	foods.forEach(function (food) {
		drawElement(food, canvas);
	});
}
/***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/
/**
   @constructor Snake
   @param {[Element] segments een array met aaneengesloten slangsegmenten
   Het eerste element van segments wordt de kop van de slang 
*/ 
function Snake(segments) {
	this.segments = segments;
	this.head = segments[0];
	this.head.color = HEAD;
}
/**
   @constructor Element
   @param radius straal
   @param {number} x x-coordinaat middelpunt
   @param {number} y y-coordinaat middelpunt
   @param {string} color kleur van het element
*/ 
function Element(radius, x, y, color) {
	this.radius = radius;
	this.x = x;
	this.y = y;
	this.color = color;
}
/***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/
 
/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten, 
        in het midden van het veld
  @return: slang volgens specificaties
*/
function createStartSnake() {
	var segments   = [createSegment(R + WIDTH/2, R + WIDTH/2), 
	                  createSegment(R + WIDTH/2, WIDTH/2 - R)];
    snake = new Snake(segments);  
}
/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color SNAKE
*/
function createSegment(x, y) {
	return new Element(R, x, y, SNAKE);
}
/**
  @function createFood(x,y) -> Element
  @desc Voedselelement creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color FOOD
*/
function createFood(x, y) {
	return new Element(R, x, y, FOOD);
}
/**
  @function drawElement(element, canvas) -> void
  @desc Een element tekenen 
  @param {Element} element een Element object
  @param  {dom object} canvas het tekenveld
*/
 function drawElement(element, canvas) {
	canvas.drawArc({
		draggable : false,
		fillStyle : element.color,
		x : element.x,
		y : element.y,
		radius : element.radius
	});
}

/**
  @function getRandomInt(min: number, max: number) -> number
  @desc Creeren van random geheel getal in het interval [min, max] 
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
  @function createFoods() -> array met food
  @desc [Element] array van random verdeelde voedselpartikelen
  @return [Element] array met food
*/
function createFoods() {   
   var  i,    
        food;
   i = 0; 
   while (i < NUMFOODS ) {
     food = createFood(XMIN + getRandomInt(0, MAX)*STEP, YMIN + getRandomInt(0, MAX)*STEP);
     if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
       foods.push(food);
       i++;
     }
   }  
}

