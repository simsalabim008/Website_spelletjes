var controller = (function() {
    
    const SLEEPTIME = 500; // Tijdsduur interval

    var timeInterval, // Variabele tijdsinterval
        newWidth = 360,
        newHeight = 360,
        newr = 10,

    /**
    @function draw() -> void
    @desc Teken de slang en het voedsel
    */
    draw = function () {
        var snake = snakeGame.getSegments(), foods = snakeGame.getFoods(),
            canvas = $("#mySnakeCanvas").clearCanvas();
        canvas[0].getContext("2d");

    if (snake) {
        snake.forEach(function (segment) {
            drawElement(segment, canvas);
        });
    }
    foods.forEach(function (food) {
        drawElement(food, canvas);
    });

        /**
        @function drawElement(element, canvas) -> void
        @desc Een element tekenen 
        @param {Element} element een Element object
        @param  {dom object} canvas het tekenveld
        */
        function drawElement(element, canvas) {
            canvas.drawArc({
                draggable: false,
                fillStyle: element.color,
                x: element.x,
                y: element.y,
                radius: element.radius
            });
        }
};
    
    return {
        /**
        @function init() -> void
        @desc Creeer een slang, genereer voedsel, teken alles en beweeg voort in de gekozen richting
        */
        init: function () {
                snakeGame.setValues(newWidth, newHeight, newr);
                snakeGame.createStartSnake();
                snakeGame.createFoods();
                snakeGame.setDirection(snakeGame.UP);
                controller.move();
        },
        /**
        @function stop() -> void
        @desc Laat slang en voedsel verdwijnen, en teken leeg veld
        */
        stop: function () {
                clearInterval(timeInterval);
                snakeGame.clear();
                $("#mySnakeCanvas").clearCanvas();
        },
        /**
        @function move(direction) -> void
        @desc Beweeg slang in aangegeven richting
            tenzij slang uit canvas zou verdwijnen  
        @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
        */
        move: function () {
            clearInterval(timeInterval);
            timeInterval = setInterval(function () {
                if (snakeGame.canMove()) {
                    snakeGame.doMove();
                    draw();
                    controller.move();
                }
                else {
                    controller.stop();
                    alert("VERLOREN!!!, snake cannot move " + snakeGame.getDirection());
                }
            }, SLEEPTIME);
        },
        timeInterval: timeInterval
    }
}) ();

$(document).ready(function () {
    $("#startSnake").one("click", controller.init);
    $("#stopSnake").on("click", controller.stop);
    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // left
                snakeGame.setDirection(snakeGame.LEFT);
                controller.move();
                break;
            case 38: // up
                snakeGame.setDirection(snakeGame.UP);
                controller.move();
                break;
            case 39: // right
                snakeGame.setDirection(snakeGame.RIGHT);
                controller.move();
                break;
            case 40: // down
                snakeGame.setDirection(snakeGame.DOWN);
                controller.move();
                break;
        }
    });
});