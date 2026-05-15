// import {Piece, King, Queen, Rook, Bishop, Knight, Pawn} from "./pieces/piece-module.js";
import { Files, Ranks, Colors, Piece, PieceTypes } from "./utils";
import { getSquare, getColorToMove } from "./back-end";

interface FrontEnd{
    board: HTMLElement,
    turnContainer: HTMLElement,
    rowLabelContainer: HTMLElement,
    columnLabelContainer: HTMLElement,
    isWhiteOnBottom: boolean,
    isMouseDown: boolean,
    isDragging: boolean,
    hasMadeMove: boolean
}

let frontEnd: FrontEnd | null = null;

function getFrontEnd(){
    if (frontEnd === null){
        throw new Error("frontEnd not initialized");
    }
    return frontEnd;
}

function colorToString(color: Colors){
    switch (color){
        case Colors.WHITE:
            return "white";
        case Colors.BLACK:
            return "black";
    }
}

function pieceTypeToString(pieceType: PieceTypes){
    switch (pieceType){
        case PieceTypes.PAWN:
            return "pawn";
        case PieceTypes.KNIGHT:
            return "knight";
        case PieceTypes.BISHOP:
            return "bishop";
        case PieceTypes.ROOK:
            return "rook";
        case PieceTypes.QUEEN:
            return "queen";
        case PieceTypes.KING:
            return "king";
    }
}

function getPieceElement(piece: Piece){
    let pieceDiv = document.createElement("div");
    let pieceTypeString = pieceTypeToString(piece.type);
    let pieceColorString = colorToString(piece.color);
    pieceDiv.classList.add("sprite", pieceTypeString, pieceColorString);
    pieceDiv.role = "img"; /* Console warning for accessibility otherwise */
    pieceDiv.ariaLabel = `${pieceColorString} ${pieceTypeString}`;
    return pieceDiv;
}

function initializeHTML(){
    let board = document.getElementById("board");
    if (board === null) {
        throw new Error("Board element not found in DOM");
    }

    let isLight = true;
    for (let rank = Ranks.EIGHT; rank >= Ranks.ONE; --rank) {
        for (let file = Files.A; file <= Files.H; ++file) {
            let frontEndSquare = document.createElement("div");
            frontEndSquare.classList.add("square");
            frontEndSquare.classList.add(isLight ? "light" : "dark");

            let backEndSquare = getSquare(rank, file);
            if (backEndSquare.piece !== null){
                frontEndSquare.appendChild(getPieceElement(backEndSquare.piece));
            }
            board.appendChild(frontEndSquare);
            isLight = !isLight;
        }
        isLight = !isLight;
    }

    let rowLabelContainer = document.getElementById("row-label-container");
    if (rowLabelContainer === null){
        throw new Error("rowLabelContainer element not found in DOM");
    }

    let charCode1 = "1".charCodeAt(0);
    for (let rank = Ranks.ONE; rank <= Ranks.EIGHT; ++rank){
        let label = document.createElement("div");
        label.classList.add("label");
        label.innerHTML = String.fromCharCode(charCode1 + Ranks.EIGHT - rank);
        rowLabelContainer.appendChild(label);
    }

    let columnLabelContainer = document.getElementById("column-label-container");
    if (columnLabelContainer === null){
        throw new Error("columnLabelContainer element not found in DOM");
    }

    let charCodea = "a".charCodeAt(0);
    for (let file = Files.A; file <= Files.H; ++file){
        let label = document.createElement("div");
        label.classList.add("label");
        label.innerHTML = String.fromCharCode(charCodea + file - 1);
        columnLabelContainer.appendChild(label);
    }

    let turnContainer = document.getElementById("turn-container");
    if (turnContainer === null) {
        throw new Error("Turn Container element not found in DOM");
    }

    turnContainer.className = colorToString(getColorToMove());

    frontEnd = {
        board: board,
        turnContainer: turnContainer,
        rowLabelContainer: rowLabelContainer,
        columnLabelContainer: columnLabelContainer,
        isWhiteOnBottom: true,
        isMouseDown: false,
        isDragging: false,
        hasMadeMove: true
    }

    /*  Explanation of how to mimic a MouseDrag Event with mousedown, mousemove, and mouseup EventListeners:
        https://techozu.com/detect-mouse-drag-javascript/#:~:text=The%20idea%20is%20very%20straightforward%3A%201%20Create%20a,was%20dragged%3B%20if%20false%2C%20it%20was%20just%20clicked.
    */
    document.addEventListener("mousedown", (event) => handleMouseDown(event));
    document.addEventListener("mousemove", (event) => handleMouseMove(event));
    document.addEventListener("mouseup", (event) => handleMouseUp(event));
}

function handleMouseDown(event: MouseEvent){
    event.preventDefault();

    let frontEnd = getFrontEnd();
    if (.hasMadeMove === false){
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

function handleMouseMove(event: MouseEvent){

}
function handleMouseUp(event: MouseEvent){

}

// class FrontEnd{
//     constructor(){
//         this.board = document.getElementById("board");
//         this.turnContainer = document.getElementById("turn-container");
//         this.moveOptionDivs = [];
//         this.numRows = 8;
//         this.numColumns = 8;
//         this.numSquares = this.numRows * this.numColumns;
//         this.isWhiteOnBottom = true;
//         this.isMouseDown = false;
//         this.isDragging = false;
//         this.hasMadeMove = true;
//     }
//     initializeHTML(){
//         let isLight = true;
//         for (let r = 0; r < this.numRows; ++r){
//             for (let c = 0; c < this.numColumns; ++c){
//                 let square = document.createElement("div");
//                 square.classList.add("square");
//                 if (isLight){
//                     square.classList.add("light");
//                 }
//                 else{
//                     square.classList.add("dark");
//                 }
//                 let moveOptionDiv = document.createElement("div");
//                 moveOptionDiv.classList.add("move-option-container", "hide");
//                 this.moveOptionDivs.push(moveOptionDiv);
//                 square.appendChild(moveOptionDiv);
//                 this.board.appendChild(square);
//                 isLight = !isLight;
//             }
//             isLight = !isLight;
//         }
//         let rowLabelContainer = document.getElementById("row-label-container");
//         let charCode1 = "1".charCodeAt(0);
//         for (let r = 0; r < this.numRows; ++r){
//             let label = document.createElement("div");
//             label.classList.add("label");
//             label.innerHTML = String.fromCharCode(charCode1 + this.numRows - r - 1);
//             rowLabelContainer.appendChild(label);
//         }
//         let columnLabelContainer = document.getElementById("column-label-container");
//         let charCodea = "a".charCodeAt(0);
//         for (let c = 0; c < this.numColumns; ++c){
//             let label = document.createElement("div");
//             label.classList.add("label");
//             label.innerHTML = String.fromCharCode(charCodea + c);
//             columnLabelContainer.appendChild(label);
//         }
//         for (let rank = Ranks.ONE; rank <= Ranks.EIGHT; ++rank){
//             for (let file = Files.A; file <= Files.H; ++file){
//                 let square = BACK_END.getSquare(rank, file);
//                 if (square.piece !== Piece.NONE){
//                     this.createPieceElement(square);
//                 }
//             }
//         }
//         this.turnContainer.classList.add(Piece.Color.getString(BACK_END.colorToMove));
//         /*  
//         Explanation of how to mimic a MouseDrag Event with mousedown, mousemove, and mouseup EventListeners:
//         https://techozu.com/detect-mouse-drag-javascript/#:~:text=The%20idea%20is%20very%20straightforward%3A%201%20Create%20a,was%20dragged%3B%20if%20false%2C%20it%20was%20just%20clicked.
//         */
//         document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
//         document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
//         document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
//     }
//     /*  
//     Note: event.offsetX and event.offsetY are relative to the "target" node, regardless of what element has the EventListener.
//     The "target" node seems to be the innermost child element of the element that has the EventListener.
//     Use event.currentTarget to retrieve the element that has the EventListener.
//     Link to Explanation:
//     https://stackoverflow.com/questions/35360704/wrong-offsetx-and-offsety-on-mousedown-event-of-parent-element#answer-35364901
//     Documentation for getBoundingClientRect():
//     https://developer.mozilla.org/en-US/docs/Web/API/DOMRect#instance_properties
//     */
//     handleMouseDown(event){
//         event.preventDefault();
//         if (this.hasMadeMove === false){
//             event.stopPropagation();
//             this.tryMove(event);
//             this.hasMadeMove = true;
//             return;
//         }
//         if (event.target.classList.contains("sprite") === false){
//             return;
//         }
//         let rect = this.board.getBoundingClientRect();
//         let offsetX = event.clientX - rect.left;
//         let offsetY = event.clientY - rect.top;
//         let row = clamp(0, Math.floor(offsetY * this.numRows / rect.height), this.numRows - 1);
//         let column = clamp(0, Math.floor(offsetX * this.numColumns / rect.width), this.numColumns - 1);
//         this.selected = {
//             rank: this.getRank(row),
//             file: this.getFile(column),
//             square: event.target.parentElement,
//             piece: event.target,
//             clientX: event.clientX,
//             clientY: event.clientY
//         };
//         this.selected.square.classList.add("highlighted");
//         this.selected.piece.style.transform = "translate(0px, 0px)";
//         this.selected.piece.classList.add("selected");
//         BACK_END.setFromSquare(this.selected.rank, this.selected.file);
//         this.showMoves(BACK_END.getMoves());
//         this.isMouseDown = true;
//         this.isDragging = false;
//         this.hasMadeMove = false;
//     }
//     handleMouseMove(event){
//         event.preventDefault();
//         if (this.isMouseDown === false){
//             return;
//         }
//         /* Add tolerance to prevent accidental dragging */
//         if (this.isDragging === false && Math.abs(this.selected.clientX - event.clientX) + Math.abs(this.selected.clientY - event.clientY) < 5){
//             return;
//         }
//         let boardRect = this.board.getBoundingClientRect();
//         let squareRect = this.selected.square.getBoundingClientRect();
//         let spriteRect = this.selected.piece.getBoundingClientRect();
//         let squareOffsetX = clamp(boardRect.left, event.clientX, boardRect.right) - squareRect.left;
//         let squareOffsetY = clamp(boardRect.top, event.clientY, boardRect.bottom) - squareRect.top;
//         this.selected.piece.style.transform = `translate(${squareOffsetX - 0.5 * spriteRect.width}px, ${squareOffsetY - 0.5 * spriteRect.height}px)`;
//         this.isDragging = true;
//     }
//     handleMouseUp(event){
//         event.preventDefault();
//         this.isMouseDown = false;
//         if (this.hasMadeMove){
//             return;
//         }
//         if (this.isDragging){
//             this.tryMove(event);
//         }
//         this.hasMadeMove = this.isDragging;
//     }
//     createPieceElement(backEndSquare){
//         let pieceDiv = document.createElement("div");
//         pieceDiv.classList.add("sprite", Piece.Color.getString(backEndSquare.piece.color), Piece.getTypeString(backEndSquare.piece));
//         pieceDiv.role = "img"; /* Console warning for accessibility otherwise */
//         pieceDiv.ariaLabel = `${Piece.Color.getString(backEndSquare.piece.color)} ${Piece.getTypeString(backEndSquare.piece)}`;
//         this.getSquare(backEndSquare.rank, backEndSquare.file).appendChild(pieceDiv);
//     }
//     updateBoard(){
//         for (const SQUARE_SNAPSHOT of BACK_END.squareSnapshots){
//             let backEndSquare = SQUARE_SNAPSHOT.square;
//             let frontEndSquare = this.getSquare(backEndSquare.rank, backEndSquare.file);
//             let targetPieces = frontEndSquare.getElementsByClassName("sprite");
//             if (targetPieces.length > 0){
//                 frontEndSquare.removeChild(targetPieces[0]);
//             }
//             if (backEndSquare.piece !== Piece.NONE){
//                 this.createPieceElement(backEndSquare);
//             }
//         }
//         this.updateTurnContainer();
//     }
//     updateTurnContainer(){
//         let oppositeColor = BACK_END.colorToMove === Piece.Color.WHITE ? Piece.Color.BLACK : Piece.Color.WHITE;
//         this.turnContainer.classList.replace(Piece.Color.getString(oppositeColor), Piece.Color.getString(BACK_END.colorToMove));
//     }
//     hideMoves(){
//         for (const MOVE_OPTION_DIV of this.moveOptionDivs){
//             MOVE_OPTION_DIV.classList.replace("show", "hide");
//         }
//     }
//     showMoves(moves){
//         for (const SQUARE of moves){
//             let square = this.getSquare(SQUARE.rank, SQUARE.file);
//             let moveOptionDiv = square.getElementsByClassName("move-option-container")[0];
//             moveOptionDiv.classList.replace("hide", "show");
//         }
//     }
//     tryMove(event){
//         let rect = this.board.getBoundingClientRect();
//         let offsetX = event.clientX - rect.left;
//         let offsetY = event.clientY - rect.top;
//         let targetRow = Math.floor(offsetY * this.numRows / rect.height);
//         let targetColumn = Math.floor(offsetX * this.numColumns / rect.width);
//         this.selected.square.classList.remove("highlighted");
//         this.selected.piece.classList.remove("selected");
//         this.selected.piece.removeAttribute("style");
//         this.hideMoves();
//         if (targetRow < 0 || targetRow >= this.numRows || targetColumn < 0 || targetColumn >= this.numColumns){
//             return;
//         }
//         let targetRank = this.getRank(targetRow);
//         let targetFile = this.getFile(targetColumn);
//         BACK_END.setToSquare(targetRank, targetFile);
//         if (BACK_END.isValid){
//             BACK_END.executeMove();
//             this.updateBoard();
//             console.log(BACK_END.getState());
//         }
//     }
//     getRank(row){
//         let rank = row;
//         if (this.isWhiteOnBottom){
//             rank = this.numRows - rank - 1;
//         }
//         return rank + Ranks.ONE;
//     }
//     getFile(column){
//         return column + Files.A;
//     }
//     getSquare(rank, file){
//         let r = rank - Ranks.ONE;
//         let c = file - Files.A;
//         if (this.isWhiteOnBottom){
//             r = this.numRows - r - 1;
//         }
//         return this.board.childNodes[r * this.numColumns + c];
//     }
// }
// const BACK_END = new BackEnd();
// const FRONT_END = new FrontEnd();

export {initializeHTML};