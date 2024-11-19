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
                    pieceDiv.classList.add("sprite", piece.getColorToString(), piece.getTypeToString());
                    pieceDiv.role = "img";
                    pieceDiv.ariaLabel = `${piece.getColorToString()} ${piece.getTypeToString()}`;
                    squares[r * Board.getNumRows() + c].appendChild(pieceDiv);
                }
            }
        }
    }
}

const board = new Board();
board.initializeHTML();