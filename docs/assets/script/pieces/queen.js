import {Piece, King} from "./piece-module.js";

class Queen extends Piece{
    constructor(color){
        super(Piece.Type.QUEEN, color);
    }

    static getCaptureDirections(){
        return King.getCaptureDirections(); // King and queen move in same directions
    }

    getPseudoLegalMoves(from){
        return Piece.getSlidingMoves(Queen.getCaptureDirections(), from);
    }
}

export default Queen;