import {describe, expect, test, beforeEach} from '@jest/globals';
import {Colors, PieceTypes, Ranks, Files, createPiece} from "../ts-script/utils";
import {BackEndTester, PiecePlacement, expectSameMembers} from "./utils";

let backEndTester: BackEndTester;

beforeEach(() => {
    backEndTester = new BackEndTester();
});

describe("rook movements", () => {
    test("non-capture movements", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.A,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.A);
        let expectedMoves = [
            backEndTester.getSquare(Ranks.THREE, Files.A),
            backEndTester.getSquare(Ranks.FOUR, Files.A),
            backEndTester.getSquare(Ranks.FIVE, Files.A),
            backEndTester.getSquare(Ranks.SIX, Files.A),
            backEndTester.getSquare(Ranks.SEVEN, Files.A),
            backEndTester.getSquare(Ranks.EIGHT, Files.A),
            backEndTester.getSquare(Ranks.TWO, Files.B),
            backEndTester.getSquare(Ranks.TWO, Files.C),
            backEndTester.getSquare(Ranks.TWO, Files.D),
            backEndTester.getSquare(Ranks.TWO, Files.E),
            backEndTester.getSquare(Ranks.TWO, Files.F),
            backEndTester.getSquare(Ranks.TWO, Files.G),
            backEndTester.getSquare(Ranks.TWO, Files.H),
            backEndTester.getSquare(Ranks.ONE, Files.A)
        ];

        expectSameMembers(moves, expectedMoves);
    });

    test("capture movements with interfering pieces", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FOUR,
                file: Files.F,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.SIX,
                file: Files.F,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            },
            {
                rank: Ranks.FOUR,
                file: Files.A,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.FOUR, Files.F);
        expect(moves).toContain(backEndTester.getSquare(Ranks.SIX, Files.F));
        expect(moves).not.toContain(backEndTester.getSquare(Ranks.FOUR, Files.A));
    });
});