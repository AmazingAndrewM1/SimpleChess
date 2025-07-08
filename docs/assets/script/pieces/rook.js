import {Piece} from "./piece-module.js";

class Rook extends Piece{
    constructor(color){
        super(color);
    }

    static getCaptureDirections(){
        return [
            {dx: 0, dy: 1},
            {dx: 1, dy: 0},
            {dx: 0, dy: -1},
            {dx: -1, dy: 0}
        ];
    }

    getPseudoLegalMoves(){
        let from = super.findSquare();
        return Piece.getSlidingMoves(Rook.getCaptureDirections(), from);
    }
}

export default Rook;