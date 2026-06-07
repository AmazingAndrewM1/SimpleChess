import { Ranks, Files, Piece, CastlingSquares, Colors, OnBoardSquare } from "../ts-script/utils";
import { BackEnd } from "../ts-script/back-end";
import {expect} from '@jest/globals';

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

    public getEnPassantSquare(){
        return this.enPassantSquare;
    }
    public setEnPassantSquare(square: OnBoardSquare | null){
        this.enPassantSquare = square;
    }
}

function expectSameMembers<T>(actual: T[], expected: T[]){
    expect(actual).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(actual));
}

export { PiecePlacement, BackEndTester, expectSameMembers};