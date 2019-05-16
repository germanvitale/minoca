const canvas = document.getElementById('arena');
const context = canvas.getContext('2d');

// Colours.
const backgroundCol = "#BC4639";
const minocaCol = "#D4A59A";
const foodCol = "#D4A59A";
// Size.
const limit = 0;
const limity = 17;
const limitx = 29;

context.scale(20, 20);
context.fillStyle = backgroundCol;
context.fillRect(0, 0, 40, 24);

const up = 3;
const bottom = 1;
const right = 2;
const left = 4;

const food = {
    pos: {
        x: Math.floor((Math.random() * limitx) + 1),
        y: Math.floor((Math.random() * limity) + 1)
    },
    color: foodCol
}

const minoca = {
    pos: {x: 0, y: 2},
    color: minocaCol,
    dir: bottom,
    body: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
    long: 3,
}

function drawCharacter(character) {
    minoca.body.forEach((value) => {
        context.fillStyle = character.color;
        context.fillRect(value.x, value.y, 1, 1);
    });
}

function drawFood(food) {
    context.fillStyle = food.color;
    context.fillRect(
        food.pos.x,
        food.pos.y,
        1,
        1
    );
}

function stopGame(move) {
    window.cancelAnimationFrame(move);
}

// Move the miñoca.
function step(character){ // TODO we dont need the param.
    // If the miñoca collide against the wall, return false.
    if (character.dir == bottom) {
        if (character.pos.y++ == limity){
            return false;
        }
    }
    if (character.dir == right) {
        if (character.pos.x++ == limitx){
            return false;
        }
    }
    if (character.dir == up) {
        if (character.pos.y-- == 0){
            return false;
        }
    }
    if (character.dir == left) {
        if (character.pos.x-- == 0){
            return false;
        }
    }
    // Collide against itself.
    let collide = false;
    minoca.body.forEach(value => {
        if (value.x == minoca.pos.x && value.y == minoca.pos.y) {
            collide = true;
        }
    })
    if (collide) {
        return false;
    }
    let deleted;
    minoca.body.push({x: minoca.pos.x, y: minoca.pos.y});
    if (minoca.body.length > minoca.long) {
        deleted = minoca.body.shift();
        context.fillStyle = backgroundCol;
        context.fillRect(deleted.x, deleted.y, 1, 1);
    }
}

document.addEventListener('keydown', event => {
    if (event.keyCode == 32) {
        stopGame(animation);
    }
    // Change direction.
    if (event.keyCode == 40 && minoca.dir != up) { // Bottom.
        minoca.dir = bottom;
    }
    if (event.keyCode == 38 && minoca.dir != bottom) { // Up.
        minoca.dir = up;
    }
    if (event.keyCode == 37 && minoca.dir != right) { // Left.
        minoca.dir = left;
    }
    if (event.keyCode == 39 && minoca.dir != left) { // Right.
        minoca.dir = right;
    }
});

function draw() {
    context.fillStyle = backgroundCol;
    context.fillRect(0, 0, 40, 24);

    // Draw the Miñoca.
    drawCharacter(minoca);

    // Eat.
    if (food.pos.y == minoca.pos.y && food.pos.x == minoca.pos.x) {

        // Change position of food.
        food.pos = {
            x: Math.floor((Math.random() * limitx) + 1),
            y: Math.floor((Math.random() * limity) + 1)
        };
        // Check that the food does not apeear in the Miñoca body.
        while (minoca.body.some(part => part.x === food.pos.x && part.y === food.pos.y)) {
            food.pos.x = Math.floor((Math.random() * limitx) + 1);
            food.pos.y = Math.floor((Math.random() * limity) + 1);
        }

        minoca.long++;

        foodAppear = Math.floor((Math.random() * 10) + 5) * 1000;
        foodTimeCount = 0;
    }
}

let millis = 0;
let move = 100;
let lastTime = 0;

var animation;
function update(time = 0) {

    const diff = time - lastTime;

    millis = millis + diff;
    if (millis > move) {
        if (step(minoca) == false) {
            stopGame(animation);
            return;
        }
        millis = 0;
    }

    draw();
    drawFood(food);

    animation = requestAnimationFrame(update);

    lastTime = time;
}

update();