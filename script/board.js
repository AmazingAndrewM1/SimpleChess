class Board{
    static #NUM_ROWS = 8;
    static #NUM_COLUMNS = 8;
    static #NUM_SQUARES = this.#NUM_ROWS * this.#NUM_COLUMNS;

    constructor(){
        let arr = Array(Board.#NUM_ROWS);
        for (let r = 0; r < Board.#NUM_ROWS; ++r){
            arr[r] = Array(Board.#NUM_COLUMNS);
            for (let c = 0; c < Board.#NUM_COLUMNS; ++c){
                arr[r][c] = r + c;
            }
        }
    }

    static getNumRows(){
        return this.#NUM_ROWS;
    }

    static getNumColumns(){
        return this.#NUM_COLUMNS;
    }

    static getNumSquares(){
        return this.#NUM_SQUARES;
    }
}

const board = new Board();

const frontEndBoard = document.getElementById("board");

let isLight = true;
for (let r = 0; r < Board.getNumRows(); ++r){
    for (let c = 0; c < Board.getNumColumns(); ++c){
        let square = document.createElement("div");
        square.classList.add("square");
        if (isLight){
            square.classList.add("light");
            isLight = false;
        }
        else{
            square.classList.add("dark");
            isLight = true;
        }
        frontEndBoard.appendChild(square); 
    }
    isLight = !isLight;
}

let squares = frontEndBoard.childNodes;
let charCode1 = "1".charCodeAt(0);
for (let r = 0; r < Board.getNumRows(); ++r){
    let label = document.createElement("div");
    label.classList.add("label", "row");
    label.innerHTML = String.fromCharCode(charCode1 + Board.getNumRows() - r - 1);
    squares[r * Board.getNumRows()].appendChild(label);
}
let charCodea = "a".charCodeAt(0);
for (let c = 0; c < Board.getNumColumns(); ++c){
    let label = document.createElement("div");
    label.classList.add("label", "column");
    label.innerHTML = String.fromCharCode(charCodea + c);
    squares[Board.getNumSquares() - Board.getNumColumns() + c].appendChild(label);
}
