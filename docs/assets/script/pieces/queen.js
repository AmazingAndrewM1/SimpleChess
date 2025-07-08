import {Piece, King} from "./piece-module.js";

class Queen extends Piece{
    constructor(color){
        super(color);
    }

    static getCaptureDirections(){
        return King.getCaptureDirections(); // King and queen move in same directions
    }

    getPseudoLegalMoves(){
        let from = super.findSquare();
        return Piece.getSlidingMoves(Queen.getCaptureDirections(), from);
    }
}

export default Queen;