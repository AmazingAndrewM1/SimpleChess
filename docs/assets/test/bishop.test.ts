import {describe, expect, test, beforeEach} from '@jest/globals';
import {Colors, PieceTypes, Ranks, Files, createPiece} from "../ts-script/utils";
import {BackEndTester, PiecePlacement, expectSameMembers} from "./utils";

let backEndTester: BackEndTester;

beforeEach(() => {
    backEndTester = new BackEndTester();
});

describe("bishop movements", () => {
    test("non-capture movements", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.SIX,
                file: Files.F,
                piece: createPiece(PieceTypes.BISHOP, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.SIX, Files.F);
        let expectedMoves = [
            backEndTester.getSquare(Ranks.SEVEN, Files.G),
            backEndTester.getSquare(Ranks.EIGHT, Files.H),
            backEndTester.getSquare(Ranks.SEVEN, Files.E),
            backEndTester.getSquare(Ranks.EIGHT, Files.D),
            backEndTester.getSquare(Ranks.FIVE, Files.E),
            backEndTester.getSquare(Ranks.FOUR, Files.D),
            backEndTester.getSquare(Ranks.THREE, Files.C),
            backEndTester.getSquare(Ranks.TWO, Files.B),
            backEndTester.getSquare(Ranks.ONE, Files.A),
            backEndTester.getSquare(Ranks.FIVE, Files.G),
            backEndTester.getSquare(Ranks.FOUR, Files.H)
        ];

        expectSameMembers(moves, expectedMoves);
    });

    test("capture movements with interfering pieces", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.THREE,
                file: Files.B,
                piece: createPiece(PieceTypes.BISHOP, Colors.BLACK)
            },
            {
                rank: Ranks.TWO,
                file: Files.C,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            },
            {
                rank: Ranks.FOUR,
                file: Files.A,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.THREE, Files.B);
        expect(moves).toContain(backEndTester.getSquare(Ranks.FOUR, Files.A));
        expect(moves).not.toContain(backEndTester.getSquare(Ranks.TWO, Files.C));
    });
});