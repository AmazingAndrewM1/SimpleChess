import {Piece} from "./piece-module.js";
import {BACK_END} from "../front-back.js";

class Bishop extends Piece{
    constructor(color){
        super(color);
    }

    static getCaptureDirections(){
        return [
            {dx: 1, dy: 1},
            {dx: 1, dy: -1},
            {dx: -1, dy: -1},
            {dx: -1, dy: 1}
        ];
    }

    getPseudoLegalMoves(){
        let from = super.findSquare();
        return Piece.getSlidingMoves(Bishop.getCaptureDirections(), from);
    }
}

export default Bishop;