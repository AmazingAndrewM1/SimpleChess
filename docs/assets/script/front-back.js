import {Piece, King, Queen, Rook, Bishop, Knight, Pawn} from "./pieces/piece-module.js";
import {Files, Ranks} from "./utils.js";

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

        this.possibleSquares = [];
        this.colorToMove = Piece.Color.WHITE;
        this.fromSquare = null;
        this.toSquare = null;
        this.isValid = false;
    }

    printDebug(){
        let output = new String();
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
        const OFFSET = 21;
        let r = rank - Ranks.ONE;
        let c = file - Files.A;
        return this.board[OFFSET + r * this.#numColumns + c];
    }

    createSquare(rank, file){
        /* Cannot use getSquare because of references in JavaScript */
        const OFFSET = 21;
        let r = rank - Ranks.ONE;
        let c = file - Files.A;
        this.board[OFFSET + r * this.#numColumns + c] = new Square(rank, file);
    }

    /**
     * @param {Square} square - the current square
     * @param {Object} direction - the direction to perform the transformation
     * @param {number} direction.dx - direction in change of file
     * @param {number} direction.dy - direction in change of rank
     * @returns {Square | null} the square after the transformation and null if the corresponding square would not exist on the standard 8x8 chessboard.
     */
    getTransposed(square, direction){
        return this.getSquare(square.rank + direction.dy, square.file + direction.dx);
    }

    /* The square specified by row and column should have a piece on that square, so null check should not be necessary. */
    setFromSquare(rank, file){
        this.fromSquare = this.getSquare(rank, file);
        this.possibleSquares = [];
        if (this.fromSquare.getPiece().getColor() === this.colorToMove){
            this.possibleSquares = this.fromSquare.getPiece().getPseudoLegalMoves(this.fromSquare);
        }
    }

    setToSquare(rank, file){
        this.toSquare = this.getSquare(rank, file);
        this.isValid = this.possibleSquares.includes(this.toSquare);
    }

    getMoves(){
        return this.possibleSquares;
    }

    executeMove(){
        this.toSquare.setPiece(this.fromSquare.getPiece());
        this.fromSquare.setPiece(null);

        this.toSquare.getPiece().updateState();
        this.isValid = false;

        this.colorToMove = this.colorToMove === Piece.Color.WHITE ? Piece.Color.BLACK : Piece.Color.WHITE;
    }
}

class FrontEnd{
    constructor(){
        this.board = document.getElementById("board");
        this.turnContainer = document.getElementById("turn-container");
        this.moveOptionDivs = [];
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
                let moveOptionDiv = document.createElement("div");
                moveOptionDiv.classList.add("move-option", "hide");
                this.moveOptionDivs.push(moveOptionDiv);
                square.appendChild(moveOptionDiv);
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
                let square = BACK_END.getSquare(rank, file);
                let piece = square.getPiece();
                if (piece !== null){
                    let pieceDiv = document.createElement("div");
                    pieceDiv.classList.add("sprite", Piece.Color.getString(piece.getColor()), Piece.Type.getString(piece.getType()));
                    pieceDiv.role = "img"; /* Console warning for accessibility otherwise */
                    pieceDiv.ariaLabel = `${Piece.Color.getString(piece.getColor())} ${Piece.Type.getString(piece.getType())}`;
                    this.getSquare(square.rank, square.file).appendChild(pieceDiv);
                }
            }
        }

        this.updateTurnContainer();

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
        if (this.hasMadeMove === false){
            event.stopPropagation();
            this.tryMove(event);
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
            rank: this.getRank(row),
            file: this.getFile(column),
            square: event.target.parentElement,
            piece: event.target,
            clientX: event.clientX,
            clientY: event.clientY
        };

        this.selected.square.classList.add("highlighted");
        this.selected.piece.style.transform = "translate(0px, 0px)";
        this.selected.piece.classList.add("selected");

        BACK_END.setFromSquare(this.selected.rank, this.selected.file);
        this.showMoves(BACK_END.getMoves());

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
            this.tryMove(event);
        }
        this.hasMadeMove = this.isDragging;
    }

    updateTurnContainer(){
        let oppositeColor = BACK_END.colorToMove === Piece.Color.WHITE ? Piece.Color.BLACK : Piece.Color.WHITE;
        this.turnContainer.classList.remove(Piece.Color.getString(oppositeColor));
        this.turnContainer.classList.add(Piece.Color.getString(BACK_END.colorToMove));
    }

    hideMoves(){
        for (const MOVE_OPTION_DIV of this.moveOptionDivs){
            MOVE_OPTION_DIV.classList.replace("show", "hide");
        }
    }

    showMoves(moves){
        for (const SQUARE of moves){
            let square = this.getSquare(SQUARE.rank, SQUARE.file);
            let moveOptionDiv = square.getElementsByClassName("move-option")[0];
            moveOptionDiv.classList.replace("hide", "show");
        }
    }

    tryMove(event){
        let rect = this.board.getBoundingClientRect();
        let offsetX = event.clientX - rect.left;
        let offsetY = event.clientY - rect.top;
        let targetRow = Math.floor(offsetY * this.numRows / rect.height);
        let targetColumn = Math.floor(offsetX * this.numColumns / rect.width);

        this.selected.square.classList.remove("highlighted");
        this.selected.piece.classList.remove("selected");
        this.selected.piece.removeAttribute("style");
        this.hideMoves();

        if (targetRow < 0 || targetRow >= this.numRows || targetColumn < 0 || targetColumn >= this.numColumns){
            return;
        }

        let targetRank = this.getRank(targetRow);
        let targetFile = this.getFile(targetColumn);

        BACK_END.setToSquare(targetRank, targetFile);
        if (BACK_END.isValid){
            BACK_END.executeMove();
            let targetSquare = this.getSquare(targetRank, targetFile);
            let targetPieces = targetSquare.getElementsByClassName("sprite");
            if (targetPieces.length > 0){
                targetSquare.removeChild(targetPieces[0]);
            }
            targetSquare.appendChild(this.selected.piece);
            this.updateTurnContainer();
        }
    }

    getRank(row){
        let rank = row;
        if (this.isWhiteOnBottom){
            rank = this.numRows - rank - 1;
        }
        return rank + Ranks.ONE;
    }

    getFile(column){
        return column + Files.A;
    }

    getSquare(rank, file){
        let r = rank - Ranks.ONE;
        let c = file - Files.A;
        if (this.isWhiteOnBottom){
            r = this.numRows - r - 1;
        }
        return this.board.childNodes[r * this.numColumns + c];
    }
}

const BACK_END = new BackEnd();
const FRONT_END = new FrontEnd();
FRONT_END.initializeHTML();

export {FRONT_END, BACK_END, Square};
