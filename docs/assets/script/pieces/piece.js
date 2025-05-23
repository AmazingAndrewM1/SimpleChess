import {FRONT_END, BACK_END, Square} from "../front-back.js";

class Piece{
    static Type = Object.freeze({
        KING: 0,
        QUEEN: 1,
        ROOK: 2,
        BISHOP: 3,
        KNIGHT: 4,
        PAWN: 5,
        NONE: 6,
        getString: function(type){
            switch (type){
                case Piece.Type.KING:
                    return "king";
                case Piece.Type.QUEEN:
                    return "queen";
                case Piece.Type.ROOK:
                    return "rook";
                case Piece.Type.BISHOP:
                    return "bishop";
                case Piece.Type.KNIGHT:
                    return "knight";
                case Piece.Type.PAWN:
                    return "pawn";
                default:
                    throw new Error("Type not in list");
            }
        }
    });
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

    static getChar(piece){
        let charCode = 0;
        switch (piece.type){
            case Piece.Type.KING:
                charCode = "k".charCodeAt(0);
                break;
            case Piece.Type.QUEEN:
                charCode = "q".charCodeAt(0);
                break;
            case Piece.Type.ROOK:
                charCode = "r".charCodeAt(0);
                break;
            case Piece.Type.BISHOP:
                charCode = "b".charCodeAt(0);
                break;
            case Piece.Type.KNIGHT:
                charCode = "n".charCodeAt(0);
                break;
            case Piece.Type.PAWN:
                charCode = "p".charCodeAt(0);
                break;
            default:
                throw new Error("Piece type not in list");
        }

        if (piece.color === Piece.Color.WHITE){
            charCode -= 32;
        }

        return String.fromCharCode(charCode);
    }

    static NONE = new Piece(Piece.Type.NONE, Piece.Color.NONE);

    constructor(type, color){
        this._hasMoved = false;
        this._color = color;
        this._type = type;
    }

    get hasMoved(){
        return this._hasMoved;
    }

    get type(){
        return this._type;
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