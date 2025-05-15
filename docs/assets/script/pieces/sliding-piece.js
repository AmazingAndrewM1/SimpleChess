import {Piece} from "./piece-module.js";
import {BACK_END, Square} from "../front-back.js";

class SlidingPiece extends Piece{
    constructor(type, color){
        super(type, color);
    }

    getPseudoLegalMoves(from){
        let moves = [];

        for (const DIRECTION of from.piece.constructor.getCaptureDirections()){
            let square = BACK_END.getTransposed(from, DIRECTION);
            while (square !== Square.NONE && square.piece === Piece.NONE){
                moves.push(square);
                square = BACK_END.getTransposed(square, DIRECTION);
            }
            if (square !== Square.NONE && this.color !== square.piece.color){
                moves.push(square);
            }
        }

        return moves;
    }
}

export default SlidingPiece;