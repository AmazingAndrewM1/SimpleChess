import {Piece, King, Queen, Rook, Bishop, Knight, Pawn} from "./pieces/piece-module.js";

/* Utility function that returns 
    1) val if min <= val <= max
    2) min if val < min
    3) max if min > max 
*/
function clamp(min, val, max){
    if (val < min){
        return min;
    }
    if (val > max){
        return max;
    }
    return val;
}
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
        let row = clamp(0, Math.floor(offsetY * Board.getNumRows() / rect.height), Board.getNumRows() - 1);
        let column = clamp(0, Math.floor(offsetX * Board.getNumColumns() / rect.width), Board.getNumColumns() - 1);

        this.selected = {
            row: row,
            column: column,
            square: null,   /* Update later to prevent self-referencing bug */
            piece: null,
            clientX: event.clientX,
            clientY: event.clientY
        };

        this.selected.square = event.currentTarget.childNodes[this.selected.row * Board.getNumRows() + this.selected.column];
        for (const child of this.selected.square.childNodes){
            if (child.classList.contains("sprite")){
                child.classList.add("selected");
                child.style.transform = "translate(0px, 0px)";
                this.selected.piece = child;
                break;
            }
        }

        this.isMouseDown = true;
        this.isDragging = false;
    }

    handleMouseMove(event){
        event.preventDefault();
        if (this.isMouseDown === false){
            return;
        }
        /* Add tolerance to prevent accidental dragging */
        if (this.isDragging === false && Math.abs(this.selected.clientX - event.clientX) + Math.abs(this.selected.clientY - event.clientY) < 5){
            return;
        }

        this.isDragging = true;
        if (this.selected.piece !== null){
            let boardRect = event.currentTarget.getBoundingClientRect();
            let squareRect = this.selected.square.getBoundingClientRect();
            let spriteRect = this.selected.piece.getBoundingClientRect();
            let squareOffsetX = clamp(boardRect.left, event.clientX, boardRect.right) - squareRect.left;
            let squareOffsetY = clamp(boardRect.top, event.clientY, boardRect.bottom) - squareRect.top;
            this.selected.piece.style.transform = `translate(${squareOffsetX - 0.5 * spriteRect.width}px, ${squareOffsetY - 0.5 * spriteRect.height}px)`
        }
    }

    handleMouseUp(event){
        event.preventDefault();

        if (this.selected.piece !== null){
            let rect = event.currentTarget.getBoundingClientRect();
            let offsetX = event.clientX - rect.left;
            let offsetY = event.clientY - rect.top;
            let targetRow = Math.floor(offsetY * Board.getNumRows() / rect.height);
            let targetColumn = Math.floor(offsetX * Board.getNumColumns() / rect.width);
            if (targetRow >= 0 && targetRow < Board.getNumRows() && targetColumn >= 0 && targetColumn < Board.getNumColumns()){
                /* Update back end */
                this.pieces[targetRow][targetColumn] = this.pieces[this.selected.row][this.selected.column];
                this.pieces[this.selected.row][this.selected.column] = null;
                /* Update front end */
                this.selected.square.removeChild(this.selected.piece);
                this.selected.piece.classList.remove("selected");
                this.selected.piece.removeAttribute("style");
                event.currentTarget.childNodes[targetRow * Board.getNumRows() + targetColumn].appendChild(this.selected.piece);
            }
        }

        this.isMouseDown = false;
        this.isDragging = false;
    }
}

const board = new Board();
board.initializeHTML();