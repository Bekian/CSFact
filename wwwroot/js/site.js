// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
// the canvas width isnt set dynamically yet
// it should be set relative to the grid
// so the canvas is a multiple of the grid width
// like if the page is 540 px and the grid squares are 50px,
// then the canvas should be 500px and the grid should be 10 squares wide

// hold mouse position
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#111111', '#FF7F66']

// c.beginPath();
// c.strokeStyle = 'black';
// c.rect(mouse.x - 50, mouse.y - 50, 50, 50); 
// c.stroke();
// c.closePath();

class gridSquare {
    constructor(xPos, yPos, size, color) {
        this.x = xPos
        this.y = yPos
        this.size = size
        this.color = color
    }

    draw() {
        c.beginPath();
        c.strokeStyle = this.color;
        c.rect(this.x, this.y, this.size, this.size); 
        c.stroke();
        c.closePath();
    }
}

// the seed square is used to to create a square to base the rest of the grid off of
// the seed square is NOT drawn to the canvas
const SeedSquare = new gridSquare(50, 50, 50, randomColor(colors)) // move this to main func

// set canvas dimensions to be multiples of SeedSquare.size
// this ensures we always have a valid canvas size and we dont need to check it later
canvas.width = Math.floor(innerWidth / SeedSquare.size) * SeedSquare.size;
canvas.height = Math.floor(innerHeight / SeedSquare.size) * SeedSquare.size;

// creates a grid array based on the canvas size and seed square
// the grid squares inherit the size and color properties of the seed square
// draws it to the canvas ~ might move
// and returns the array
function initGrid(SeedSquare) {
    // make a grid
    let grid = []

    // calculate the grid width and height
    gridWidth = canvas.width / SeedSquare.size
    gridHeight = canvas.height / SeedSquare.size

    // create the grid squares based on the seed square
    for (let column = 0; column < gridHeight; column++) {
        for (let row = 0; row < gridWidth; row++) {
            console.log(column, row)
            let xPos = row * SeedSquare.size
            let yPos = column * SeedSquare.size
            let square = new gridSquare(xPos, yPos, SeedSquare.size, SeedSquare.color)
            square.draw()
            grid.push(square)
        }
    }
    return grid
}

let grid = initGrid(SeedSquare)

// return the square from the grid with the given position
function getSquare(grid, xPos, yPos) {
    const rect = canvas.getBoundingClientRect();
    // get the coordinates relative to the canvas
    const x = xPos - rect.left;
    const y = yPos - rect.top;

    // calculate the row and column by rounding down to the nearest multiple of SeedSquare.size
    // we do division before rounding cause its complicated otherwise
    const row = Math.floor(x / SeedSquare.size);
    const column = Math.floor(y / SeedSquare.size);

    // calculate the top-left position of the square
    // we use this to find the square in the grid
    const squareX = row * SeedSquare.size;
    const squareY = column * SeedSquare.size;

    // find the square in the grid by looking for the square with the matching coords
    const foundSquare = grid.find(square => square.x === squareX && square.y === squareY);
    if (foundSquare) {
        // mark the found square ~ this is temporary
        let squareMarker = new gridSquare(foundSquare.x + 20, foundSquare.y + 20, 10, 'black')
        squareMarker.draw();
    }
}

// track the mouse event when the mouse is pressed inside the canavs
let mouseStart = null;
canvas.addEventListener('mousedown', (event) => {
    console.log('Mouse down over canvas:', event);
    mouseStart = event
    getSquare(grid, event.x, event.y);
});

// track where the mouse is lifted up
canvas.addEventListener('mouseup', (event) => {
    if (mouseStart) {
        console.log('Mouse up over canvas:', event);
        // check if the user starts and ends in the same square
        // returns a square in the grid using the given positions
        getSquare(grid, event.x, event.y);
        // const rect = canvas.getBoundingClientRect();
        // const x = event.clientX - rect.left - 13;
        // const y = event.clientY - rect.top - 13;
        // const spotSquare = new gridSquare(x, y, 25, 'black');
        // spotSquare.draw();
    }
});
// cancel the movement if the mouse leaves the canvas
canvas.addEventListener('mouseleave', () => {
    if (mouseStart) {
        mouseStart = null
    }
})