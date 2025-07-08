import {Piece} from "./piece-module.js";

class Bishop extends Piece{
    constructor(color, square){
        super(color, square);
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
        return Piece.getSlidingMoves(Bishop.getCaptureDirections(), from);
    }
}

export default Bishop;