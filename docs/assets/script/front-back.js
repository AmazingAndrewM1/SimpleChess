import {Piece, King, Queen, Rook, Bishop, Knight, Pawn} from "./pieces/piece-module.js";
import {Files, Ranks, Squares} from "./utils.js";

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

class Square{
    #piece = null;

    constructor(rank, file){
        this.rank = rank;
        this.file = file;
        this.#piece = null;
    }

    /**
     * @returns {Piece | null}
     */
    getPiece(){
        return this.#piece;
    }

    /**
     * @param {Piece} piece 
     */
    setPiece(piece){
        this.#piece = piece;
    }
}

class BackEnd{
    #numRows = 12;
    #numColumns = 10;
    #numSquares = this.#numRows * this.#numColumns;

    constructor(){
        this.board = new Array(this.#numSquares);
        this.board.fill(null);

        for (let rank = Ranks.ONE; rank <= Ranks.EIGHT; ++rank){
            for (let file = Files.A; file <= Files.H; ++file){
                this.createSquare(rank, file);
            }
        }

        this.getSquare(Ranks.ONE, Files.A).setPiece(new Rook(Piece.Color.WHITE));
        this.getSquare(Ranks.ONE, Files.B).setPiece(new Knight(Piece.Color.WHITE));
        this.getSquare(Ranks.ONE, Files.C).setPiece(new Bishop(Piece.Color.WHITE));
        this.getSquare(Ranks.ONE, Files.D).setPiece(new Queen(Piece.Color.WHITE));
        this.getSquare(Ranks.ONE, Files.E).setPiece(new King(Piece.Color.WHITE));
        this.getSquare(Ranks.ONE, Files.F).setPiece(new Bishop(Piece.Color.WHITE));
        this.getSquare(Ranks.ONE, Files.G).setPiece(new Knight(Piece.Color.WHITE));
        this.getSquare(Ranks.ONE, Files.H).setPiece(new Rook(Piece.Color.WHITE));

        for (let file = Files.A; file <= Files.H; ++file){
            this.getSquare(Ranks.TWO, file).setPiece(new Pawn(Piece.Color.WHITE));
            this.getSquare(Ranks.SEVEN, file).setPiece(new Pawn(Piece.Color.BLACK));
        }

        this.getSquare(Ranks.EIGHT, Files.A).setPiece(new Rook(Piece.Color.BLACK));
        this.getSquare(Ranks.EIGHT, Files.B).setPiece(new Knight(Piece.Color.BLACK));
        this.getSquare(Ranks.EIGHT, Files.C).setPiece(new Bishop(Piece.Color.BLACK));
        this.getSquare(Ranks.EIGHT, Files.D).setPiece(new Queen(Piece.Color.BLACK));
        this.getSquare(Ranks.EIGHT, Files.E).setPiece(new King(Piece.Color.BLACK));
        this.getSquare(Ranks.EIGHT, Files.F).setPiece(new Bishop(Piece.Color.BLACK));
        this.getSquare(Ranks.EIGHT, Files.G).setPiece(new Knight(Piece.Color.BLACK));
        this.getSquare(Ranks.EIGHT, Files.H).setPiece(new Rook(Piece.Color.BLACK));
        this.printDebug();
    }

    printDebug(){
        let output = "";
        for (let r = 0; r < this.#numRows; ++r){
            for (let c = 0; c < this.#numColumns; ++c){
                let square = this.board[r * this.#numColumns + c];
                if (square === null){
                    output += "- ";
                }
                else if (square.getPiece() === null){
                    output += ". ";
                }
                else{
                    output += Piece.getChar(square.getPiece()) + " ";
                }
            }
            output += "\n";
        }
        console.log(output);
    }

    getSquare(rank, file){
        let r = rank - Ranks.ONE;
        let c = file - Files.A;
        return this.board[Squares.A1 + r * this.#numColumns + c];
    }

    createSquare(rank, file){
        let r = rank - Ranks.ONE;
        let c = file - Files.A;
        this.board[Squares.A1 + r * this.#numColumns + c] = new Square(rank, file);
    }

    /**
     * @param {Square} square - the current square
     * @param {Object} direction - the direction to perform the transformation
     * @returns {Square | null} the square after the transformation and null if that square does not exist on the standard 8x8 chessboard.
     */
    getTransposed(square, direction){
        
    }

    executeMove(from, to){
        this.getSquare(to.rank, to.file).setPiece(this.getSquare(from.rank, from.file).getPiece());
        this.getSquare(from.rank, from.file).setPiece(null);
        this.printDebug();
    }
}

class FrontEnd{
    constructor(){
        this.board = document.getElementById("board");
        this.numRows = 8;
        this.numColumns = 8;
        this.numSquares = this.numRows * this.numColumns;
        this.isWhiteOnBottom = true;
        this.isMouseDown = false;
        this.isDragging = false;
        this.hasMadeMove = true;
    }

    initializeHTML(){
        let isLight = true;
        for (let r = 0; r < this.numRows; ++r){
            for (let c = 0; c < this.numColumns; ++c){
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
        for (let r = 0; r < this.numRows; ++r){
            let label = document.createElement("div");
            label.classList.add("label");
            label.innerHTML = String.fromCharCode(charCode1 + this.numRows - r - 1);
            rowLabelContainer.appendChild(label);
        }

        let columnLabelContainer = document.getElementById("column-label-container");
        let charCodea = "a".charCodeAt(0);
        for (let c = 0; c < this.numColumns; ++c){
            let label = document.createElement("div");
            label.classList.add("label");
            label.innerHTML = String.fromCharCode(charCodea + c);
            columnLabelContainer.appendChild(label);
        }

        for (let rank = Ranks.ONE; rank <= Ranks.EIGHT; ++rank){
            for (let file = Files.A; file <= Files.H; ++file){
                if (BACK_END.getSquare(rank, file).getPiece() !== null){
                    let piece = BACK_END.getSquare(rank, file).getPiece();
                    let pieceDiv = document.createElement("div");
                    pieceDiv.classList.add("sprite", Piece.Color.getString(piece.getColor()), Piece.Type.getString(piece.getType()));
                    pieceDiv.role = "img"; /* Console warning for accessibility otherwise */
                    pieceDiv.ariaLabel = `${Piece.Color.getString(piece.getColor())} ${Piece.Type.getString(piece.getType())}`;
                    this.board.childNodes[this.getIndex(rank, file)].appendChild(pieceDiv);
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

    getIndex(rank, file){
        let r = rank;
        let c = file;
        if (this.isWhiteOnBottom){
            r = this.numRows - r - 1;
        }

        return r * this.numColumns + c;
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
        if (this.hasMadeMove === false){
            event.stopPropagation();
            this.doMove(event);
            this.hasMadeMove = true;
            return;
        }
        if (event.target.classList.contains("sprite") === false){
            return;
        }

        let rect = this.board.getBoundingClientRect();
        let offsetX = event.clientX - rect.left;
        let offsetY = event.clientY - rect.top;
        let row = clamp(0, Math.floor(offsetY * this.numRows / rect.height), this.numRows - 1);
        let column = clamp(0, Math.floor(offsetX * this.numColumns / rect.width), this.numColumns - 1);

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
        this.hasMadeMove = false;
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

        let boardRect = this.board.getBoundingClientRect();
        let squareRect = this.selected.square.getBoundingClientRect();
        let spriteRect = this.selected.piece.getBoundingClientRect();
        let squareOffsetX = clamp(boardRect.left, event.clientX, boardRect.right) - squareRect.left;
        let squareOffsetY = clamp(boardRect.top, event.clientY, boardRect.bottom) - squareRect.top;
        this.selected.piece.style.transform = `translate(${squareOffsetX - 0.5 * spriteRect.width}px, ${squareOffsetY - 0.5 * spriteRect.height}px)`;
        this.isDragging = true;
    }

    handleMouseUp(event){
        event.preventDefault();
        this.isMouseDown = false;
        if (this.hasMadeMove){
            return;
        }
        if (this.isDragging){
            this.doMove(event);
        }
        this.hasMadeMove = this.isDragging;
    }

    doMove(event){
        let rect = this.board.getBoundingClientRect();
        let offsetX = event.clientX - rect.left;
        let offsetY = event.clientY - rect.top;
        let targetRow = Math.floor(offsetY * this.numRows / rect.height);
        let targetColumn = Math.floor(offsetX * this.numColumns / rect.width);

        this.selected.square.classList.remove("highlighted");
        this.selected.piece.classList.remove("selected");
        this.selected.piece.removeAttribute("style");
        if (targetRow >= 0 && targetRow < this.numRows &&
            targetColumn >= 0 && targetColumn < this.numColumns &&
            !(targetRow === this.selected.row && targetColumn === this.selected.column)){
            BACK_END.executeMove({rank: this.getRank(this.selected.row), file: this.selected.column}, 
                                 {rank: this.getRank(targetRow), file: targetColumn});

            this.selected.square.removeChild(this.selected.piece);
            let targetSquare = this.board.childNodes[targetRow * this.numRows + targetColumn];
            if (targetSquare.hasChildNodes()){
                targetSquare.removeChild(targetSquare.firstChild);
            }
            targetSquare.appendChild(this.selected.piece);
        }
    }

    getRank(rank){
        let r = rank;
        if (this.isWhiteOnBottom){
            r = this.numRows - r - 1;
        }
        return r;
    }
}

const BACK_END = new BackEnd();
const FRONT_END = new FrontEnd();
FRONT_END.initializeHTML();

export {FRONT_END, BACK_END};
