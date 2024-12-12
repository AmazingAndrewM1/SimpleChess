import Piece from "./piece.js";
import {Bishop, Rook, King} from "./piece-module.js";

class Queen extends Piece{
    constructor(color){
        super(Piece.Type.QUEEN, color);
    }

    static getCaptureDirections(){
        return King.getCaptureDirections(); // King and queen move in same directions
    }

    getPseudoLegalMoves(from){
        let moves = new Bishop(this.color).getPseudoLegalMoves(from);
        for (const SQUARE of new Rook(this.color).getPseudoLegalMoves(from)){
            moves.push(SQUARE);
        }
        return moves;
    }
}

export default Queen;