import {Piece, SlidingPiece} from "./piece-module.js";

class Bishop extends SlidingPiece{
    constructor(color){
        super(Piece.Type.BISHOP, color);
    }

    static getCaptureDirections(){
        return [
            {dx: 1, dy: 1},
            {dx: 1, dy: -1},
            {dx: -1, dy: -1},
            {dx: -1, dy: 1}
        ];
    }

    getPseudoLegalMoves(from){
        return super.getPseudoLegalMoves(from);
    }
}

export default Bishop;