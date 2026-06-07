import {describe, expect, test, beforeEach} from '@jest/globals';
import {Colors, PieceTypes, Ranks, Files, createPiece} from "../ts-script/utils";
import {BackEndTester, PiecePlacement, expectSameMembers} from "./utils";

let backEndTester: BackEndTester;

beforeEach(() => {
    backEndTester = new BackEndTester();
});

describe("pawn forward movements without interfering pieces", () => {
    test("white pawn on 2nd rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.B,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.B);
        let expectedMoves = [backEndTester.getSquare(Ranks.THREE, Files.B), backEndTester.getSquare(Ranks.FOUR, Files.B)];

        expectSameMembers(moves, expectedMoves);
    });

    test("white pawn on 7th rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.SEVEN,
                file: Files.H,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.SEVEN, Files.H);
        expect(moves).toContain(backEndTester.getSquare(Ranks.EIGHT, Files.H));
    });

    test("black pawn on 7th rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.SEVEN,
                file: Files.A,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.SEVEN, Files.A);
        let expectedMoves = [backEndTester.getSquare(Ranks.SIX, Files.A), backEndTester.getSquare(Ranks.FIVE, Files.A)];

        expectSameMembers(moves, expectedMoves);
    });

    test("black pawn on 2nd rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.E,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.E);

        expect(moves).toContain(backEndTester.getSquare(Ranks.ONE, Files.E));
    });
});

describe("pawn forward movements with interfering pieces", () => {
    test("white pawn on 2nd rank, piece on 3rd rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.C,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            },
            {
                rank: Ranks.THREE,
                file: Files.C,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.C);

        expect(moves).toHaveLength(0);
    });

    test("white pawn on 2nd rank, piece on 4th rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.D,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            },
            {
                rank: Ranks.FOUR,
                file: Files.D,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.D);
        let expectedMoves = [backEndTester.getSquare(Ranks.THREE, Files.D)];
        expectSameMembers(moves, expectedMoves);
    });

    test("white pawn on nth rank, piece on (n+1)th rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FIVE,
                file: Files.F,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            },
            {
                rank: Ranks.SIX,
                file: Files.F,
                piece: createPiece(PieceTypes.BISHOP, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.FIVE, Files.F);
        expect(moves).toHaveLength(0);
    });

    test("black pawn on 7th rank, piece on 5th rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.SEVEN,
                file: Files.H,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            },
            {
                rank: Ranks.FIVE,
                file: Files.H,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.SEVEN, Files.H);
        let expectedMoves = [backEndTester.getSquare(Ranks.SIX, Files.H)];

        expectSameMembers(moves, expectedMoves);
    });

    test("black pawn on 7th rank, piece on 6th rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.SEVEN,
                file: Files.C,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            },
            {
                rank: Ranks.SIX,
                file: Files.C,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.SEVEN, Files.C);

        expect(moves).toHaveLength(0);
    });

    test("black pawn on nth rank, piece on (n-1)th rank", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.A,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            },
            {
                rank: Ranks.ONE,
                file: Files.A,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.A);

        expect(moves).toHaveLength(0);
    });
});

describe("pawn capture movements excluding en passant", () => {
    test("white pawn on edge file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.A,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            },
            {
                rank: Ranks.THREE,
                file: Files.B,
                piece: createPiece(PieceTypes.KNIGHT, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.A);
        expect(moves).toContain(backEndTester.getSquare(Ranks.THREE, Files.B));
    });

    test("white pawn on non-edge file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FOUR,
                file: Files.D,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            },
            {
                rank: Ranks.FIVE,
                file: Files.E,
                piece: createPiece(PieceTypes.QUEEN, Colors.BLACK)
            },
            {
                rank: Ranks.FIVE,
                file: Files.C,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        let moves = backEndTester.getPseudoLegalMoves(Ranks.FOUR, Files.D);

        expect(moves).toContain(backEndTester.getSquare(Ranks.FIVE, Files.E));
        expect(moves).not.toContain(backEndTester.getSquare(Ranks.FIVE, Files.C));
    });

    test("black pawn on edge file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.THREE,
                file: Files.H,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            },
            {
                rank: Ranks.TWO,
                file: Files.G,
                piece: createPiece(PieceTypes.BISHOP, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.THREE, Files.H);
        expect(moves).toContain(backEndTester.getSquare(Ranks.TWO, Files.G));
    });

    test("black pawn on non-edge file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.TWO,
                file: Files.G,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            },
            {
                rank: Ranks.ONE,
                file: Files.H,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.F,
                piece: createPiece(PieceTypes.QUEEN, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let moves = backEndTester.getPseudoLegalMoves(Ranks.TWO, Files.G);
        expect(moves).toContain(backEndTester.getSquare(Ranks.ONE, Files.H));
        expect(moves).not.toContain(backEndTester.getSquare(Ranks.ONE, Files.F));
    });
});

describe("pawn en passant capture", () => {
    test("white pawn can access en passant square", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FIVE,
                file: Files.C,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            },
            {
                rank: Ranks.FIVE,
                file: Files.A,
                piece: createPiece(PieceTypes.PAWN, Colors.WHITE)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setEnPassantSquare(backEndTester.getSquare(Ranks.SIX, Files.B));

        let fileCPawnMoves = backEndTester.getPseudoLegalMoves(Ranks.FIVE, Files.C);
        expect(fileCPawnMoves).toContain(backEndTester.getEnPassantSquare());

        let fileAPawnMoves = backEndTester.getPseudoLegalMoves(Ranks.FIVE, Files.A);
        expect(fileAPawnMoves).toContain(backEndTester.getEnPassantSquare());
    });

    test("black pawn can access en passant square", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.FOUR,
                file: Files.D,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            },
            {
                rank: Ranks.FOUR,
                file: Files.F,
                piece: createPiece(PieceTypes.PAWN, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);
        backEndTester.setEnPassantSquare(backEndTester.getSquare(Ranks.THREE, Files.E));

        let fileDPawnMoves = backEndTester.getPseudoLegalMoves(Ranks.FOUR, Files.D);
        expect(fileDPawnMoves).toContain(backEndTester.getEnPassantSquare());

        let fileFPawnMoves = backEndTester.getPseudoLegalMoves(Ranks.FOUR, Files.F);
        expect(fileFPawnMoves).toContain(backEndTester.getEnPassantSquare());
    });
});