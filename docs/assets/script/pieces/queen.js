import {Piece, SlidingPiece, King} from "./piece-module.js";

class Queen extends SlidingPiece{
    constructor(color){
        super(Piece.Type.QUEEN, color);
    }

    static getCaptureDirections(){
        return King.getCaptureDirections(); // King and queen move in same directions
    }

    getPseudoLegalMoves(from){
        return super.getPseudoLegalMoves(from);
    }
}

export default Queen;