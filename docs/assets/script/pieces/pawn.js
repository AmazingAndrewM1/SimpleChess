import Piece, {FRONT_END, BACK_END} from "./piece.js";

class Pawn extends Piece{
    constructor(color){
        super(Piece.Type.PAWN, color);
    }

    static getCaptureDirections(color){
        switch (color){
            case Piece.Color.WHITE:
                return [
                    {dx: 1, dy: 1},
                    {dx: -1, dy: 1}
                ];
            case Piece.Color.BLACK:
                return [
                    {dx: 1, dy: -1},
                    {dx: -1, dy: -1}
                ];
            default:
                throw new Error("Piece color not in list.");
        }
    }   

    getPseudoLegalMoves(from){
        let moves = [];
        let captureDirections = Pawn.getCaptureDirections(this.color);
        let forwardDirection = {dx: 0, dy: captureDirections[0].dy};
        
        let forward1Square = BACK_END.getTransposed(from, forwardDirection);
        if (forward1Square.getPiece() === null){
            moves.push(forward1Square);
        }

        return moves;
    }
}

export default Pawn;