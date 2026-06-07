import {describe, expect, test, beforeEach} from '@jest/globals';
import {Colors, PieceTypes, Ranks, Files, createPiece} from "../ts-script/utils";
import {BackEndTester, PiecePlacement, expectSameMembers} from "./utils";

let backEndTester: BackEndTester;

beforeEach(() => {
    backEndTester = new BackEndTester();
});

describe("queen movements", () => {
    test("non-capture movements", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FIVE,
                file: Files.D,
                piece: createPiece(PieceTypes.QUEEN, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.FIVE, Files.D);
        let expectedMoves = [
            backEndTester.getSquare(Ranks.SIX, Files.D),
            backEndTester.getSquare(Ranks.SEVEN, Files.D),
            backEndTester.getSquare(Ranks.EIGHT, Files.D),
            backEndTester.getSquare(Ranks.SIX, Files.C),
            backEndTester.getSquare(Ranks.SEVEN, Files.B),
            backEndTester.getSquare(Ranks.EIGHT, Files.A),
            backEndTester.getSquare(Ranks.FIVE, Files.C),
            backEndTester.getSquare(Ranks.FIVE, Files.B),
            backEndTester.getSquare(Ranks.FIVE, Files.A),
            backEndTester.getSquare(Ranks.FOUR, Files.C),
            backEndTester.getSquare(Ranks.THREE, Files.B),
            backEndTester.getSquare(Ranks.TWO, Files.A),
            backEndTester.getSquare(Ranks.FOUR, Files.D),
            backEndTester.getSquare(Ranks.THREE, Files.D),
            backEndTester.getSquare(Ranks.TWO, Files.D),
            backEndTester.getSquare(Ranks.ONE, Files.D),
            backEndTester.getSquare(Ranks.FOUR, Files.E),
            backEndTester.getSquare(Ranks.THREE, Files.F),
            backEndTester.getSquare(Ranks.TWO, Files.G),
            backEndTester.getSquare(Ranks.ONE, Files.H),
            backEndTester.getSquare(Ranks.FIVE, Files.E),
            backEndTester.getSquare(Ranks.FIVE, Files.F),
            backEndTester.getSquare(Ranks.FIVE, Files.G),
            backEndTester.getSquare(Ranks.FIVE, Files.H),
            backEndTester.getSquare(Ranks.SIX, Files.E),
            backEndTester.getSquare(Ranks.SEVEN, Files.F),
            backEndTester.getSquare(Ranks.EIGHT, Files.G)
        ];

        expectSameMembers(moves, expectedMoves);
    });

    test("capture movements with interfering pieces", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FIVE,
                file: Files.D,
                piece: createPiece(PieceTypes.QUEEN, Colors.BLACK)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.A,
                piece: createPiece(PieceTypes.QUEEN, Colors.WHITE)
            },
            {
                rank: Ranks.SIX,
                file: Files.D,
                piece: createPiece(PieceTypes.QUEEN, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.FIVE, Files.D);
        expect(moves).toContain(backEndTester.getSquare(Ranks.EIGHT, Files.A));
        expect(moves).not.toContain(backEndTester.getSquare(Ranks.SIX, Files.D));
    });
});