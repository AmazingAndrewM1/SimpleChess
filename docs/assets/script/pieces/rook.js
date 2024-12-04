import Piece, {BACK_END} from "./piece.js";

export class Rook extends Piece{
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
        let moves = [];

        for (const DIRECTION of Rook.getCaptureDirections()){
            let square = BACK_END.getTransposed(from, DIRECTION);
            while (square !== null && square.getPiece() === null){
                moves.push(square);
                square = BACK_END.getTransposed(square, DIRECTION);
            }
            if (square !== null && square.getPiece().getColor() !== this.color){
                moves.push(square);
            }
        }

        return moves;
    }
}

export default Rook;