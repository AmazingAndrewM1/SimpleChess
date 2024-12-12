import Piece, {BACK_END} from "./piece.js";

class King extends Piece{
    constructor(color){
        super(Piece.Type.KING, color);
    }

    static getCaptureDirections(){
        return [
            {dx: 0, dy: 1},
            {dx: 1, dy: 1},
            {dx: 1, dy: 0},
            {dx: 1, dy: -1},
            {dx: 0, dy: -1},
            {dx: -1, dy: -1},
            {dx: -1, dy: 0},
            {dx: -1, dy: 1}
        ];
    }

    getPseudoLegalMoves(from){
        let moves = [];

        for (const DIRECTION of King.getCaptureDirections()){
            let square = BACK_END.getTransposed(from, DIRECTION);
            if (square !== null && (square.getPiece() === null || square.getPiece().getColor() !== this.color)){
                moves.push(square);
            }
        }

        return moves;
    }
}

export default King;