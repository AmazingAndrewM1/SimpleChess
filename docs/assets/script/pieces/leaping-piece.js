import {Piece} from "./piece-module.js";
import {BACK_END, Square} from "../front-back.js";

class LeapingPiece extends Piece{
    constructor(type, color){
        super(type, color);
    }

    getPseudoLegalMoves(from){
        let moves = [];

        for (const DIRECTION of from.piece.constructor.getCaptureDirections()){
            let square = BACK_END.getTransposed(from, DIRECTION);
            if (square !== Square.NONE && this.color !== square.piece.color){
                moves.push(square);
            }
        }

        return moves;
    }
}

export default LeapingPiece;