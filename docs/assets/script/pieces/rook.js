import {Piece, SlidingPiece} from "./piece-module.js";

export class Rook extends SlidingPiece{
    constructor(color){
        super(Piece.Type.ROOK, color);
    }

    static getCaptureDirections(){
        return [
            {dx: 0, dy: 1},
            {dx: 1, dy: 0},
            {dx: 0, dy: -1},
            {dx: -1, dy: 0}
        ];
    }

    getPseudoLegalMoves(from){
        return super.getPseudoLegalMoves(from);
    }
}

export default Rook;