import {FRONT_END, BACK_END, Square} from "../front-back.js";
import {King, Queen, Rook, Bishop, Knight, Pawn} from "./piece-module.js";

class Piece{
    static Color = Object.freeze({
        WHITE: 0,
        BLACK: 1,
        NONE: 2,
        getString: function(color){
            switch (color){
                case Piece.Color.WHITE:
                    return "white";
                case Piece.Color.BLACK:
                    return "black";
                default:
                    throw new Error("Color not in list");
            }
        }
    });

    static getTypeString(piece){
        switch (piece.constructor){
            case King:
                return "king";
            case Queen:
                return "queen";
            case Rook:
                return "rook";
            case Bishop:
                return "bishop";
            case Knight:
                return "knight";
            case Pawn:
                return "pawn";
            default:
                throw new Error("Piece type not recognized: " + piece.constructor);
        }
    }

    static getChar(piece){
        let char;
        switch (piece.constructor){
            case King:
                char = "k";
                break;
            case Queen:
                char = "q";
                break;
            case Rook:
                char = "r";
                break;
            case Bishop:
                char = "b";
                break;
            case Knight:
                char = "n";
                break;
            case Pawn:
                char = "p";
                break;
            default:
                throw new Error("Piece type not recognized: " + piece.constructor);
        }

        switch (piece.color){
            case Piece.Color.WHITE:
                return char;
            case Piece.Color.BLACK:
                return char.toUpperCase();
            default:
                throw new Error("Piece color not recognized: " + piece.color);s
        }
    }

    static getSlidingMoves(captureDirections, from){
        let moves = [];

        for (const DIRECTION of captureDirections){
            let square = BACK_END.getTransposed(from, DIRECTION);
            while (square !== Square.NONE && square.piece === Piece.NONE){
                moves.push(square);
                square = BACK_END.getTransposed(square, DIRECTION);
            }
            if (square !== Square.NONE && square.piece.color !== from.piece.color){
                moves.push(square);
            }
        }

        return moves;
    }

    static getLeapingMoves(captureDirections, from){
        let moves = [];

        for (const DIRECTION of captureDirections){
            let square = BACK_END.getTransposed(from, DIRECTION);
            if (square !== Square.NONE && square.piece.color !== from.piece.color){
                moves.push(square);
            }
        }

        return moves;
    }

    static NONE = new Piece(Piece.Color.NONE);

    constructor(color){
        this._hasMoved = false;
        this._color = color;
    }

    get hasMoved(){
        return this._hasMoved;
    }

    get color(){
        return this._color;
    }

    /**
    Generate all the destinations squares that abide by the rules of movement for the given piece 
    while ignoring if the execution of that move would leave the king in check.
    @param {Square} from - Square from which the current piece stands
    @returns {Square[]} - destinationSquares
    */
    getPseudoLegalMoves(from){
        return [];
    }

    updateState(){
        this._hasMoved = true;
    }
}

export default Piece;
export {FRONT_END, BACK_END};