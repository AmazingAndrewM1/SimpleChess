import {Piece} from "./piece-module.js";

class Knight extends Piece{
    constructor(color){
        super(color);
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
        return Piece.getLeapingMoves(Knight.getCaptureDirections(), from);
    }
}

export default Knight;