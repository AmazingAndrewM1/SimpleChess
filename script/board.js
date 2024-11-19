import {Piece, King, Queen, Rook, Bishop, Knight, Pawn} from "./pieces/piece-module.js";

class Board{
    static #NUM_ROWS = 8;
    static #NUM_COLUMNS = 8;
    static #NUM_SQUARES = this.#NUM_ROWS * this.#NUM_COLUMNS;

    constructor(){
        /* Create 2-dimensional array in JavaScript */
        this.pieces = new Array(Board.#NUM_ROWS);
        for (let r = 0; r < Board.#NUM_ROWS; ++r){
           this.pieces[r] = new Array(Board.#NUM_COLUMNS);
           this.pieces[r].fill(null);
        }

        this.pieces[0][0] = new Rook(Piece.Color.BLACK);
        this.pieces[0][1] = new Knight(Piece.Color.BLACK);
        this.pieces[0][2] = new Bishop(Piece.Color.BLACK);
        this.pieces[0][3] = new Queen(Piece.Color.BLACK);
        this.pieces[0][4] = new King(Piece.Color.BLACK);
        this.pieces[0][5] = new Bishop(Piece.Color.BLACK);
        this.pieces[0][6] = new Knight(Piece.Color.BLACK);
        this.pieces[0][7] = new Rook(Piece.Color.BLACK);
        for (let c = 0; c < Board.#NUM_COLUMNS; ++c){
            this.pieces[1][c] = new Pawn(Piece.Color.BLACK);
        }

        for (let c = 0; c < Board.#NUM_COLUMNS; ++c){
            this.pieces[6][c] = new Pawn(Piece.Color.WHITE);
        }
        this.pieces[7][0] = new Rook(Piece.Color.WHITE);
        this.pieces[7][1] = new Knight(Piece.Color.WHITE);
        this.pieces[7][2] = new Bishop(Piece.Color.WHITE);
        this.pieces[7][3] = new Queen(Piece.Color.WHITE);
        this.pieces[7][4] = new King(Piece.Color.WHITE);
        this.pieces[7][5] = new Bishop(Piece.Color.WHITE);
        this.pieces[7][6] = new Knight(Piece.Color.WHITE);
        this.pieces[7][7] = new Rook(Piece.Color.WHITE);

        this.isMouseDown = false;
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
    initializeHTML(){
        const frontEndBoard = document.getElementById("board");

        let isLight = true;
        for (let r = 0; r < Board.getNumRows(); ++r){
            for (let c = 0; c < Board.getNumColumns(); ++c){
                let square = document.createElement("div");
                square.classList.add("square");
                if (isLight){
                    square.classList.add("light");
                }
                else{
                    square.classList.add("dark");
                }
                frontEndBoard.appendChild(square);
                isLight = !isLight;
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

        for (let r = 0; r < Board.getNumRows(); ++r){
            for (let c = 0; c < Board.getNumColumns(); ++c){
                if (this.pieces[r][c] !== null){
                    let piece = this.pieces[r][c];
                    let pieceDiv = document.createElement("div");
                    pieceDiv.classList.add("sprite", Piece.Color.getString(piece.getColor()), Piece.Type.getString(piece.getType()));
                    pieceDiv.role = "img";
                    pieceDiv.ariaLabel = `${Piece.Color.getString(piece.getColor())} ${Piece.Type.getString(piece.getType())}`;
                    squares[r * Board.getNumRows() + c].appendChild(pieceDiv);
                }
            }
        }

        /*  Explanation of how to mimic a MouseDrag Event when MouseDrag Event does not trigger because JavaScript is dumb:
            https://techozu.com/detect-mouse-drag-javascript/#:~:text=The%20idea%20is%20very%20straightforward%3A%201%20Create%20a,was%20dragged%3B%20if%20false%2C%20it%20was%20just%20clicked.
        */
        frontEndBoard.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        frontEndBoard.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        frontEndBoard.addEventListener("mouseup", (event) => this.handleMouseUp(event));
    }

    /*  Even though frontEndBoard has the EventListener, event.offsetX and event.offsetY are relative to the "target" node.
        The "target" node seems to be the innermost child element of the element that has the EventListener.
        Use event.currentTarget to retrieve the element that has the EventListener. This is why I detest JavaScript.
        Link to Explanation:
        https://stackoverflow.com/questions/35360704/wrong-offsetx-and-offsety-on-mousedown-event-of-parent-element#answer-35364901

        Documentation for getBoundingClientRect():
        https://developer.mozilla.org/en-US/docs/Web/API/DOMRect#instance_properties
    */
    handleMouseDown(event){
        event.preventDefault();

        let rect = event.currentTarget.getBoundingClientRect();
        let offsetX = event.clientX - rect.left;
        let offsetY = event.clientY - rect.top;
        let row = Math.floor(offsetY * Board.getNumRows() / rect.height);
        let column = Math.floor(offsetX * Board.getNumColumns() / rect.width);

        this.selected = {
            row: row,
            column: column
        };

        let square = event.currentTarget.childNodes[this.selected.row * Board.getNumRows() + this.selected.column];
        for (const child of square.childNodes){
            if (child.classList.contains("sprite")){
                child.classList.add("selected");
                child.style.transform = "translate(0px, 0px)";
            }
        }

        this.isMouseDown = true;
    }

    handleMouseMove(event){
        event.preventDefault();
        if (this.isMouseDown === false){
            return;
        }

        let square = event.currentTarget.childNodes[this.selected.row * Board.getNumRows() + this.selected.column];
        let squareRect = square.getBoundingClientRect();
        let offsetX = event.clientX - squareRect.left;
        let offsetY = event.clientY - squareRect.top;

        for (const child of square.childNodes){
            if (child.classList.contains("selected")){
                let boardRect = event.currentTarget.getBoundingClientRect();
                let squareRect = square.getBoundingClientRect();
                let spriteRect = child.getBoundingClientRect();

                let squareOffsetX = event.clientX - squareRect.left;
                if (event.clientX < boardRect.left){
                    squareOffsetX = boardRect.left - squareRect.left;
                }
                else if (event.clientX > boardRect.right){
                    squareOffsetX = boardRect.right - squareRect.left;
                }

                let squareOffsetY = event.clientY - squareRect.top;
                if (event.clientY < boardRect.top){
                    squareOffsetY = boardRect.top - squareRect.top;
                }
                else if (event.clientY > boardRect.bottom){
                    squareOffsetY = boardRect.bottom - squareRect.top;
                }
                child.style.transform = `translate(${squareOffsetX - 0.5 * spriteRect.width}px, ${squareOffsetY - 0.5 * spriteRect.height}px)`;
            }
        }
    }

    handleMouseUp(event){
        event.preventDefault();

        let square = event.currentTarget.childNodes[this.selected.row * Board.getNumRows() + this.selected.column];
        let piece = null;
        for (const child of square.childNodes){
            if (child.classList.contains("sprite")){
                piece = child;
                break;
            }
        }
        if (piece !== null){
            let rect = event.currentTarget.getBoundingClientRect();
            let offsetX = event.clientX - rect.left;
            let offsetY = event.clientY - rect.top;
            let targetRow = Math.floor(offsetY * Board.getNumRows() / rect.height);
            let targetColumn = Math.floor(offsetX * Board.getNumColumns() / rect.width);

            /* Update back end */
            this.pieces[targetRow][targetColumn] = this.pieces[this.selected.row][this.selected.column];
            this.pieces[this.selected.row][this.selected.column] = null;

            /* Update front end */
            square.removeChild(piece);
            piece.classList.remove("selected");
            piece.removeAttribute("style");
            event.currentTarget.childNodes[targetRow * Board.getNumRows() + targetColumn].appendChild(piece);
        }

        this.isMouseDown = false;
    }
}

const board = new Board();
board.initializeHTML();