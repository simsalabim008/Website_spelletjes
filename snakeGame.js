var snakeGame = (function() { 
    const NUMFOODS = 5,          // aantal voedselelementen       
        SNAKE = "DarkRed",   // kleur van een slangsegment
        FOOD = "Olive",       // kleur van voedsel
        HEAD = "DarkOrange",   // kleur van de kop van de slang

        LEFT = "left",      // bewegingsrichtingen 
        RIGHT = "right",
        UP = "up",
        DOWN = "down";

    var snake, 
        foods = [],             // voedsel voor de slang
        width, height, r, step, max, xMin, yMin, xMax, yMax, direction = UP,

    /***************************************************************************
     **                 Constructors                                          **
    ***************************************************************************/
    /**
     @constructor Snake
    @param [Element] segments een array met aaneengesloten slangsegmenten
    Het eerste element van segments wordt de kop van de slang 
    */
    Snake = function (segments) {
        this.segments = segments;
        this.head = segments[0];
        this.head.color = HEAD;

        /**
        @function collidesWithFood() --> True als hoofd van de slang een voedselsegment tegenkomt.
        @description Hulpfunctie van changesegments. De methode wordt aangeroepen op de slang, in dit geval het eerste segment het hoofd van de slang. De methode controleert of het
        segment van het hoofd van de slang dezelfde coordinaten heeft als een voedselsegment. Indien dat het geval is wordt True teruggegeven, anders false.
        @returns boolean True or False
        */
        Snake.prototype.collidesWithFood = (function (elements) {
            for (let i = 0; i < elements.length; i++) {
                if ((elements[i].y === snake.segments[0].y) && (elements[i].x === snake.segments[0].x)) {
                    return true;
                }
            }
            return false;
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
            snake.segments.unshift(new Element(r, x, y, HEAD));
            snake.segments[1] = new Element(r, snake.segments[1].x, snake.segments[1].y, "DarkRed");

            if (!snake.collidesWithFood(foods)) {
                snake.segments.pop();
            }
            else if (snake.collidesWithFood(foods)) {
                for (let i = 0; i < foods.length; i++) {
                    if (snake.segments[0].x === foods[i].x && snake.segments[0].y === foods[i].y) {
                        if (foods.length === 1) {
                            foods.splice(i, 1);
                            clearInterval(controller.timeInterval);
                            setTimeout(function () {
                                alert("GEWONNEN!!!");
                                controller.stop();
                            }, 500);
                        }
                        foods.splice(i, 1);
                    }
                }
            }
            for (let i = 1; i < snake.segments.length; i++) {
                const didCollide = snake.segments[i].x === snake.segments[0].x && snake.segments[i].y === snake.segments[0].y
                if (didCollide) {
                    controller.stop();
                    return alert("VERLOREN!!!");
                }
            }
        });
    },
    /**
    @constructor Element
    @param radius straal
    @param {number} x x-coordinaat middelpunt
    @param {number} y y-coordinaat middelpunt
    @param {string} color kleur van het element
    */
    Element = function (radius, x, y, color) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.color = color;

        /**
        @function collidesWithOneOf () --> true als segmenten zelfde coordinaten hebben.
        @desc Hulpfunctie van createFoods. De methode kan aangeroepen worden op een voedselelement, er kan een array van slangsegmenten worden meegegeven om te vergelijken.
        De methode controleert of een voedselsegment dezelfde coordinaten heeft als een slangsegment en/of een al bestaand voedselsegment.
        @returns boolean True or False
        */
        Element.prototype.collidesWithOneOf = (function (elements) {
            if (elements.forEach(function () {
                return ((elements[0].y === this.y) && (elements[0].x === this.x));
            }));
        });
    },
    /**
    @function createSegment(x,y) -> Element
    @desc Slangsegment creeren op een bepaalde plaats
    @param {number} x x-coordinaat middelpunt
    @param {number} y y-coordinaart middelpunt
    @return: {Element} met straal R en color SNAKE
    */
    createSegment = function (x, y) {
        return new Element(r, x, y, SNAKE);
    },
    /**
    @function createFood(x,y) -> Element
    @desc Voedselelement creeren op een bepaalde plaats
    @param {number} x x-coordinaat middelpunt
    @param {number} y y-coordinaart middelpunt
    @return: {Element} met straal R en color FOOD
    */
    createFood = function (x, y) {
        return new Element(r, x, y, FOOD);
    },
    /**
    @function getRandomInt(min: number, max: number) -> number
    @desc Creeren van random geheel getal in het interval [min, max] 
    @param {number} min een geheel getal als onderste grenswaarde
    @param {number} max een geheel getal als bovenste grenswaarde (max > min)
    @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
    */
    getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return {
        UP: UP,
        DOWN: DOWN,
        RIGHT: RIGHT,
        LEFT: LEFT,
        getSegments: function () { // Geeft de segmenten van de slang
            return snake.segments;
        },
        getFoods: function () { // Geeft de elementen van de voedsellijst
            return foods;
        },
        setDirection: function (newDirection) { // Methode om een nieuwe richting in te stellen
            direction = newDirection;
        },
        getDirection: function () { // Methode om richting op te vragen
            var getDir = direction;
            return getDir;
        },
        /**
        @function canMove () --> Geeft False terug indien slang buiten het canvas dreigt te gaan, anders True.
        @desc Hulpfunctie van move. Controleert of slang binnen het canvas blijft. Indien buiten canvas dreigt te gaan of de slang 
        dreigt zichzelf tegen te komen, in deze gevallen wordt er False teruggeven. 
        @returns boolean True or False
        */
        canMove: function () { 
            var movingDirection = direction;
            if (!(snake.segments[0].y > (yMin + 1)) && movingDirection === UP) {
                return false;
            }
            else if (!(snake.segments[0].y < (yMax - 1)) && movingDirection === DOWN) {
                return false;
            }
            else if (!(snake.segments[0].x > (xMin + 1)) && movingDirection === LEFT) {
                return false;
            }
            else if (!(snake.segments[0].x < (xMax - 1)) && movingDirection === RIGHT) {
                return false;
            }
            return true;
        },
        /**
        @function doMove () --> roept hulpmethode changesegments aan met de juiste richting.
        @desc Beweegt de slang in de gegeven richting. Roept de hulpmethode changeSegments aan.
        @returns void
        */
        doMove: function () {
            var movingDirection = direction;

            /**
             * Het eerste segment, de head, dient te bewegen in de richting van direction. De overige segmenten nemen de positie van het
             * vorige segment in. Dit wordt bewerkstelligd middels een aanpassing in de array waarbij een nieuw element wordt toegevoegd, met behulp van changesegments.
             *  Vervolgens wordt dit nieuwe element de head en het laatste element wordt verwijderd.
             **/ 
            switch (movingDirection) {
                case UP:
                    snake.changeSegments(snake.segments[0].x, snake.segments[0].y - step);
                    break;
                case DOWN:
                    snake.changeSegments(snake.segments[0].x, snake.segments[0].y + step);
                    break;
                case LEFT:
                    snake.changeSegments(snake.segments[0].x - step, snake.segments[0].y);
                    break;
                case RIGHT:
                    snake.changeSegments(snake.segments[0].x + step, snake.segments[0].y);
                    break;
            }
        },
        /**
        @function createStartSnake() -> Snake
        @desc Slang creëren, bestaande uit  twee segmenten, 
                in het midden van het veld
        @return: slang volgens specificaties
        */
        createStartSnake: function () {
            var segments = [createSegment(r + width / 2, r + width / 2),
            createSegment(r + width / 2, width / 2 - r)];
            snake = new Snake(segments);
        },
        /**
        @function createFoods() -> array met food
        @desc [Element] array van random verdeelde voedselpartikelen
        @return [Element] array met food
        */
        createFoods: function () {
            var i,
                food;
            i = 0;
            while (i < NUMFOODS) {
                food = createFood(xMin + getRandomInt(0, max) * step, yMin + getRandomInt(0, max) * step);
                if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
                    foods.push(food);
                    i++;
                }
            }
        },
        clear: function () { // Reset-methode
            snake = null;
            foods = [];
        },
        setValues: function (newWidth, newHeight, newr) { // Methode aan de hand van meegegeven afmetingen, te bepalen welke afmetingen voor het tekenen benodigd zijn.
            width = newWidth;
            height = newHeight;
            r = newr;
            step = 2 * r;
            max = width / step - 1;
            xMin = r;
            yMin = r;
            xMax = width - r;
            yMax = height - r;
        }
    };
})();