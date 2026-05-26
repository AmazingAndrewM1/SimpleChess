import { Ranks, Files, Piece, CastlingSquares, Colors } from "../ts-script/utils";
import { BackEnd } from "../ts-script/back-end";

type PiecePlacement = {
    rank: Ranks,
    file: Files,
    piece: Piece
}

class BackEndTester extends BackEnd{
    public placePieces(piecePlacements: PiecePlacement[]){
        for (const {rank, file, piece} of piecePlacements){
            this.getSquare(rank, file).piece = piece;
        }
    }
    public setColorToMove(color: Colors){
        this.colorToMove = color;
    }

    public getCastlingSquares(){
        return this.castlingSquares;
    }
    public setCastlingSquares(castlingSquares: CastlingSquares){
        this.castlingSquares = castlingSquares;
    }
}

export { PiecePlacement, BackEndTester };