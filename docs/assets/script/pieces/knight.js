import {Piece, LeapingPiece} from "./piece-module.js";

class Knight extends LeapingPiece{
    constructor(color){
        super(Piece.Type.KNIGHT, color);
    }

    static getCaptureDirections(color){
        return Knight.getCaptureDirections();
    }

    static getCaptureDirections(){
        return [
            {dx: 1, dy: 2},
            {dx: 2, dy: 1},
            {dx: 2, dy: -1},
            {dx: 1, dy: -2},
            {dx: -1, dy: -2},
            {dx: -2, dy: -1},
            {dx: -2, dy: 1},
            {dx: -1, dy: 2}
        ];
    }

    getPseudoLegalMoves(from){
        return super.getPseudoLegalMoves(from);
    }
}

export default Knight;