import Piece, {BACK_END} from "./piece.js";
import {Bishop, Rook} from "./piece-module.js";

class King extends Piece{
    constructor(color){
        super(Piece.Type.KING, color);
    }

    static getCaptureDirections(){  // The directions of bishop and rook are the same as king.
        let directions = Bishop.getCaptureDirections();
        for (const DIRECTION of Rook.getCaptureDirections()){
            directions.push(DIRECTION);
        }
        return directions;
    }

    getPseudoLegalMoves(from){
        let moves = [];

        for (const DIRECTION of King.getCaptureDirections()){
            let square = BACK_END.getTransposed(from, DIRECTION);
            if (square !== null && (square.getPiece() === null || square.getPiece().getColor() !== this.color)){
                moves.push(square);
            }
        }

        return moves;
    }
}

export default King;