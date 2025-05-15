import Piece, {BACK_END} from "./piece.js";

export class Knight extends Piece{
    constructor(color){
        super(Piece.Type.KNIGHT, color);
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
        let moves = [];

        for (const DIRECTION of Knight.getCaptureDirections()){
            let square = BACK_END.getTransposed(from, DIRECTION);
            if (square !== null && (square.piece === null || square.piece.color !== this.color)){
                moves.push(square);
            }
        }

        return moves;
    }
}

export default Knight;