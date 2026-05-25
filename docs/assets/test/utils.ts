import { Ranks, Files, Colors, Piece, PieceTypes, createPiece } from "../ts-script/utils";
import { backEnd, getSquare } from "../ts-script/back-end";

type PiecePlacement = {
    rank: Ranks,
    file: Files,
    piece: Piece
}

function placePieces(piecePlacements: PiecePlacement[]){
    for (const {rank, file, piece} of piecePlacements){
        getSquare(rank, file).piece = piece;
    }
}

function makeBoard(){
    let piecePlacements: PiecePlacement[] = [
        {
            rank: Ranks.ONE,
            file: Files.E,
            piece: createPiece(PieceTypes.KING, Colors.WHITE)
        },
        {
            rank: Ranks.ONE,
            file: Files.H,
            piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
        }
    ];

    placePieces(piecePlacements);
}

export { PiecePlacement, makeBoard, placePieces };