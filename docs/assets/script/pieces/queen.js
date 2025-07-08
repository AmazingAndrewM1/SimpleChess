import {Piece, King} from "./piece-module.js";

class Queen extends Piece{
    constructor(color, square){
        super(color, square);
    }

    static getCaptureDirections(){
        return King.getCaptureDirections(); // King and queen move in same directions
    }

    getPseudoLegalMoves(from){
        return Piece.getSlidingMoves(Queen.getCaptureDirections(), from);
    }
}

export default Queen;