import Piece, {FRONT_END, BACK_END} from "./piece.js";


class Pawn extends Piece{
    constructor(color){
        super(Piece.Type.PAWN, color);
    }

    static getCaptureDirections(color){
        switch (color){
            case Piece.Color.WHITE:
                return [
                    {dx: 1, dy: -1},
                    {dx: -1, dy: -1}
                ];
            case Piece.Color.BLACK:
                return [
                    {dx: 1, dy: 1},
                    {dx: -1, dy: 1}
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
        if (BACK_END.getPiece(forward1Square) === null){
            moves.push(forward1Square);
        }

        let forward2Square = BACK_END.getTransposed(forward1Square, forwardDirection);
        if (this.hasMoved === false && BACK_END.getPiece(forward1Square) === null && BACK_END.getPiece(forward2Square) === null){
            moves.push(forward2Coordinate);
        }

        for (const DIRECTION in captureDirections){
            let captureSquare = BACK_END.getTransposed(from, DIRECTION);
            if (captureSquare !== null && BACK_END.getPiece(captureSquare) !== null && BACK_END.getPiece(captureSquare).getColor() !== this.color){
                moves.push(captureSquare);
            }
            // Handle en-passant case later
        }

        return moves;
    }
}

export default Pawn;