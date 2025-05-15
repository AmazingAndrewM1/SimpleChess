import {Piece} from "./piece-module.js";
import {BACK_END, Square} from "../front-back.js";

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
        if (forward1Square.piece === Piece.NONE){    // Out of bounds check not necessary
            moves.push(forward1Square);
        }

        let forward2Square = BACK_END.getTransposed(forward1Square, forwardDirection);
        if (this.hasMoved === false && forward1Square.piece === Piece.NONE && forward2Square.piece === Piece.NONE){   // Out of bounds check not necessary
            moves.push(forward2Square);
        }

        for (const DIRECTION of captureDirections){
            let captureSquare = BACK_END.getTransposed(from, DIRECTION);
            if (captureSquare !== Square.NONE && captureSquare.piece !== Piece.NONE && captureSquare.piece.color !== this.color){
                moves.push(captureSquare);
            }
        }

        return moves;
    }
}

export default Pawn;