import {describe, expect, test, beforeEach} from '@jest/globals';
import {Colors, PieceTypes, Ranks, Files, createPiece} from "../ts-script/utils";
import {BackEndTester, PiecePlacement, expectSameMembers} from "./utils";

let backEndTester: BackEndTester;

beforeEach(() => {
    backEndTester = new BackEndTester();
});

describe("king movements", () => {
    test("non-capture movements", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FIVE,
                file: Files.H,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.FIVE, Files.H);
        let expectedMoves = [
            backEndTester.getSquare(Ranks.SIX, Files.H),
            backEndTester.getSquare(Ranks.SIX, Files.G),
            backEndTester.getSquare(Ranks.FIVE, Files.G),
            backEndTester.getSquare(Ranks.FOUR, Files.G),
            backEndTester.getSquare(Ranks.FOUR, Files.H)
        ];

        expectSameMembers(moves, expectedMoves);
    });

    test("capture movements with interfering pieces", () => {
       let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.SEVEN,
                file: Files.B,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            },
            {
                rank: Ranks.SEVEN,
                file: Files.C,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            },
            {
                rank: Ranks.SIX,
                file: Files.C,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.SEVEN, Files.B);
        expect(moves).toContain(backEndTester.getSquare(Ranks.SEVEN, Files.C));
        expect(moves).not.toContain(backEndTester.getSquare(Ranks.SIX, Files.C));
    });
});