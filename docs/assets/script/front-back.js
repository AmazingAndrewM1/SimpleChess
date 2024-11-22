import {Piece, King, Queen, Rook, Bishop, Knight, Pawn} from "./pieces/piece-module.js";

/** Utility function that returns 
    1) val if min <= val <= max
    2) min if val < min
    3) max if min > max
    @param {Number} min - The minimum value this function returns.
    @param {Number} val - The preferred value this function returns.
    @param {Number} max - The maximum value this function returns.
    @returns {Number}
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

class BackEnd{
    static #NUM_ROWS = 8;
    static #NUM_COLUMNS = 8;
    static #NUM_SQUARES = this.#NUM_ROWS * this.#NUM_COLUMNS;

    constructor(){
        /* Create 2-dimensional array in JavaScript */
        this.pieces = new Array(BackEnd.#NUM_ROWS);
        for (let r = 0; r < BackEnd.#NUM_ROWS; ++r){
           this.pieces[r] = new Array(BackEnd.#NUM_COLUMNS);
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
        for (let c = 0; c < BackEnd.#NUM_COLUMNS; ++c){
            this.pieces[1][c] = new Pawn(Piece.Color.BLACK);
        }

        for (let c = 0; c < BackEnd.#NUM_COLUMNS; ++c){
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
        console.log(this.pieces);
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
    /**
     * @param {Number} r The row number with range [0, 7] 
     * @param {Number} c The column number with range [0, 7]
     * @returns {Piece} The piece at row r and column c
     */
    getPiece(r, c){
        return this.pieces[r][c];
    }

    executeMove(from, to){
        this.pieces[to.row][to.column] = this.pieces[from.row][from.column];
        this.pieces[from.row][from.column] = null;
    }
}

class FrontEnd{
    constructor(){
        this.board = document.getElementById("board");
        this.isMouseDown = false;
        this.isDragging = false;
    }

    initializeHTML(){
        let isLight = true;
        for (let r = 0; r < BackEnd.getNumRows(); ++r){
            for (let c = 0; c < BackEnd.getNumColumns(); ++c){
                let square = document.createElement("div");
                square.classList.add("square");
                if (isLight){
                    square.classList.add("light");
                }
                else{
                    square.classList.add("dark");
                }
                this.board.appendChild(square);
                isLight = !isLight;
            }
            isLight = !isLight;
        }

        let rowLabelContainer = document.getElementById("row-label-container");
        let charCode1 = "1".charCodeAt(0);
        for (let r = 0; r < BackEnd.getNumRows(); ++r){
            let label = document.createElement("div");
            label.classList.add("label");
            label.innerHTML = String.fromCharCode(charCode1 + BackEnd.getNumRows() - r - 1);
            rowLabelContainer.appendChild(label);
        }

        let columnLabelContainer = document.getElementById("column-label-container");
        let charCodea = "a".charCodeAt(0);
        for (let c = 0; c < BackEnd.getNumColumns(); ++c){
            let label = document.createElement("div");
            label.classList.add("label");
            label.innerHTML = String.fromCharCode(charCodea + c);
            columnLabelContainer.appendChild(label);
        }

        for (let r = 0; r < BackEnd.getNumRows(); ++r){
            for (let c = 0; c < BackEnd.getNumColumns(); ++c){
                if (BACK_END.getPiece(r, c) !== null){
                    let piece = BACK_END.getPiece(r, c);
                    let pieceDiv = document.createElement("div");
                    pieceDiv.classList.add("sprite", Piece.Color.getString(piece.getColor()), Piece.Type.getString(piece.getType()));
                    pieceDiv.role = "img"; /* Console warning for accessibility appears otherwise */
                    pieceDiv.ariaLabel = `${Piece.Color.getString(piece.getColor())} ${Piece.Type.getString(piece.getType())}`;
                    this.board.childNodes[r * BackEnd.getNumRows() + c].appendChild(pieceDiv);
                }
            }
        }

        /*  
        Explanation of how to mimic a MouseDrag Event with mousedown, mousemove, and mouseup EventListeners:
        https://techozu.com/detect-mouse-drag-javascript/#:~:text=The%20idea%20is%20very%20straightforward%3A%201%20Create%20a,was%20dragged%3B%20if%20false%2C%20it%20was%20just%20clicked.
        */
        document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
    }

    /*  
    Note: event.offsetX and event.offsetY are relative to the "target" node, regardless of what element has the EventListener.
    The "target" node seems to be the innermost child element of the element that has the EventListener.
    Use event.currentTarget to retrieve the element that has the EventListener.
    Link to Explanation:
    https://stackoverflow.com/questions/35360704/wrong-offsetx-and-offsety-on-mousedown-event-of-parent-element#answer-35364901

    Documentation for getBoundingClientRect():
    https://developer.mozilla.org/en-US/docs/Web/API/DOMRect#instance_properties
    */
    handleMouseDown(event){
        event.preventDefault();
        if (event.target.classList.contains("sprite") === false){
            return;
        }

        let rect = this.board.getBoundingClientRect();
        let offsetX = event.clientX - rect.left;
        let offsetY = event.clientY - rect.top;
        let row = clamp(0, Math.floor(offsetY * BackEnd.getNumRows() / rect.height), BackEnd.getNumRows() - 1);
        let column = clamp(0, Math.floor(offsetX * BackEnd.getNumColumns() / rect.width), BackEnd.getNumColumns() - 1);

        this.selected = {
            row: row,
            column: column,
            square: event.target.parentElement,
            piece: event.target,
            clientX: event.clientX,
            clientY: event.clientY
        };

        this.selected.square.classList.add("highlighted");
        this.selected.piece.style.transform = "translate(0px, 0px)";
        this.selected.piece.classList.add("selected");

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
            let boardRect = this.board.getBoundingClientRect();
            let squareRect = this.selected.square.getBoundingClientRect();
            let spriteRect = this.selected.piece.getBoundingClientRect();
            let squareOffsetX = clamp(boardRect.left, event.clientX, boardRect.right) - squareRect.left;
            let squareOffsetY = clamp(boardRect.top, event.clientY, boardRect.bottom) - squareRect.top;
            this.selected.piece.style.transform = `translate(${squareOffsetX - 0.5 * spriteRect.width}px, ${squareOffsetY - 0.5 * spriteRect.height}px)`;
        }
    }

    handleMouseUp(event){
        event.preventDefault();
        if (this.isMouseDown === false){
            return;
        }

        if (this.selected.piece !== null){
            let rect = this.board.getBoundingClientRect();
            let offsetX = event.clientX - rect.left;
            let offsetY = event.clientY - rect.top;
            let targetRow = Math.floor(offsetY * BackEnd.getNumRows() / rect.height);
            let targetColumn = Math.floor(offsetX * BackEnd.getNumColumns() / rect.width);

            this.selected.square.classList.remove("highlighted");
            this.selected.piece.classList.remove("selected");
            this.selected.piece.removeAttribute("style");
            if (targetRow >= 0 && targetRow < BackEnd.getNumRows() && 
                targetColumn >= 0 && targetColumn < BackEnd.getNumColumns() &&
                !(targetRow === this.selected.row && targetColumn === this.selected.column)){
                BACK_END.executeMove({row: this.selected.row, column: this.selected.column}, {row: targetRow, column: targetColumn});
                this.selected.square.removeChild(this.selected.piece);
                this.board.childNodes[targetRow * BackEnd.getNumRows() + targetColumn].appendChild(this.selected.piece);
            }
        }

        this.isMouseDown = false;
        this.isDragging = false;
    }
}

const BACK_END = new BackEnd();
const FRONT_END = new FrontEnd();
FRONT_END.initializeHTML();
