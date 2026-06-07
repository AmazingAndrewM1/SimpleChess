import {describe, expect, test, beforeEach} from '@jest/globals';
import {Colors, PieceTypes, Ranks, Files, createPiece} from "../ts-script/utils";
import {BackEndTester, PiecePlacement, expectSameMembers} from "./utils";

let backEndTester: BackEndTester;

beforeEach(() => {
    backEndTester = new BackEndTester();
});

describe("knight non-capture movement", () => {
    test("knight movement near center", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FOUR,
                file: Files.D,
                piece: createPiece(PieceTypes.KNIGHT, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.FOUR, Files.D);
        let expectedMoves = [
            backEndTester.getSquare(Ranks.FIVE, Files.F),
            backEndTester.getSquare(Ranks.SIX, Files.E),
            backEndTester.getSquare(Ranks.SIX, Files.C),
            backEndTester.getSquare(Ranks.FIVE, Files.B),
            backEndTester.getSquare(Ranks.THREE, Files.B),
            backEndTester.getSquare(Ranks.TWO, Files.C),
            backEndTester.getSquare(Ranks.TWO, Files.E),
            backEndTester.getSquare(Ranks.THREE, Files.F)   
        ];

        expectSameMembers(moves, expectedMoves);
    });

    test("knight movement in corner", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.EIGHT,
                file: Files.A,
                piece: createPiece(PieceTypes.KNIGHT, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.EIGHT, Files.A);
        let expectedMoves = [
            backEndTester.getSquare(Ranks.SIX, Files.B),
            backEndTester.getSquare(Ranks.SEVEN, Files.C)  
        ];

        expectSameMembers(moves, expectedMoves);
    });
});

describe("knight capture movement", () => {
    test("knight captures enemy piece but not friendly piece", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.B,
                piece: createPiece(PieceTypes.KNIGHT, Colors.BLACK)
            },
            {
                rank: Ranks.THREE,
                file: Files.D,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            },
            {
                rank: Ranks.FOUR,
                file: Files.A,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.B);
        expect(moves).toContain(backEndTester.getSquare(Ranks.THREE, Files.D));
        expect(moves).not.toContain(backEndTester.getSquare(Ranks.FOUR, Files.A));
    });
});