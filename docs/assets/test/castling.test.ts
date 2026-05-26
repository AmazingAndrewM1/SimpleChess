/* https://jestjs.io/docs/getting-started */

import {Ranks, Files, PieceTypes, Colors, createPiece, CastlingSquares } from "../ts-script/utils";
import { BackEnd } from "../ts-script/back-end";
import { PiecePlacement, BackEndTester } from "./utils";
import {describe, expect, test, beforeEach} from '@jest/globals';

function getPiecePlacementsFromCastlingSquares(castlingSquares: CastlingSquares): PiecePlacement[] {
    let piecePlacements: PiecePlacement[] = [];

    for (const color of [Colors.WHITE, Colors.BLACK]){
        for (const [key, square] of Object.entries(castlingSquares[color])){
            if (square !== null){
                let pieceType = key === "king" ? PieceTypes.KING : PieceTypes.ROOK;
                piecePlacements.push({
                    rank: square.rank,
                    file: square.file,
                    piece: createPiece(pieceType, color)
                });
            }
        }
    }

    return piecePlacements;
}

let backEndTester: BackEndTester;

beforeEach(() => {
    backEndTester = new BackEndTester();
})

describe("Testing castling permissions", () => {
    test("king has moved", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.D,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.A,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.H,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.D,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];
        
        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.D),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.H),
                queensideRook: backEndTester.getSquare(Ranks.ONE, Files.A)
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.D),
                kingsideRook: null,
                queensideRook: null
            }
        });

        let whiteCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        whiteCastlingSquares.king.piece!.hasMoved = true;

        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingSquares.king.rank, whiteCastlingSquares.king.file);
        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(whiteCastlingSquares.kingsideRook);
        expect(moves).not.toContain(whiteCastlingSquares.queensideRook);
    });

    test("kingside rook has moved", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.F,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.F,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.B,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.G,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.F),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.F),
                kingsideRook: backEndTester.getSquare(Ranks.EIGHT, Files.G),
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.B)
            }
        });
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingSquares = backEndTester.getCastlingSquares()[Colors.BLACK];
        blackCastlingSquares.kingsideRook!.piece!.hasMoved = true;

        let moves = backEndTester.getPseudoLegalMoves(blackCastlingSquares.king.rank, blackCastlingSquares.king.file);
        expect(moves).not.toContain(blackCastlingSquares.kingsideRook);
        expect(moves).toContain(blackCastlingSquares.queensideRook);
    });

    test("queenside rook has moved", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.B,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.A,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.D,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.B,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.B),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.D),
                queensideRook: backEndTester.getSquare(Ranks.ONE, Files.A)
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.B),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let whiteCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        whiteCastlingSquares.queensideRook!.piece!.hasMoved = true;

        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingSquares.king.rank, whiteCastlingSquares.king.file);
        expect(moves).toContain(whiteCastlingSquares.kingsideRook);
        expect(moves).not.toContain(whiteCastlingSquares.queensideRook);
    });
});

describe("Testing pseudo-legal castling without interfering pieces", () => {
    test("kingside rook is to the right of g-file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.B,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.H,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.B,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.B),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.H),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.B),
                kingsideRook: null,
                queensideRook: null
            }
        });

        let whiteCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingSquares.king.rank, whiteCastlingSquares.king.file);

        expect(moves).toContain(whiteCastlingSquares.kingsideRook);
    });

    test("queenside rook is to the left of c-file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.F,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.F,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.A,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.F),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.F),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.A)
            }
        });
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingPieces = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingPieces.king.rank, blackCastlingPieces.king.file);
        expect(moves).toContain(blackCastlingPieces.queensideRook);
    });

    test("kingside rook is on the g-file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.E,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.G,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.B,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.E),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.G),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.B),
                kingsideRook: null,
                queensideRook: null
            }
        });

        let whiteCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingSquares.king.rank, whiteCastlingSquares.king.file);

        expect(moves).toContain(whiteCastlingSquares.kingsideRook);
    });

    test("queenside rook is on the c-file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.F,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.F,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.C,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.F),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.F),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.C)
            }
        });
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingPieces = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingPieces.king.rank, blackCastlingPieces.king.file);
        expect(moves).toContain(blackCastlingPieces.queensideRook);
    });

    test("kingside rook is to the left of g-file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.C,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.D,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.C,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.C),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.D),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.B),
                kingsideRook: null,
                queensideRook: null
            }
        });

        let whiteCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingSquares.king.rank, whiteCastlingSquares.king.file);

        expect(moves).toContain(whiteCastlingSquares.kingsideRook);
    });

    test("queenside rook is to the left of c-file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.H,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.H,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.E,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.F),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.H),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.E)
            }
        });
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingPieces = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingPieces.king.rank, blackCastlingPieces.king.file);
        expect(moves).toContain(blackCastlingPieces.queensideRook);
    });
});

describe("Testing kingside castling with pieces interfering the king", () => {
    test("kingside rook is to the left of g-file with in-between piece", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.D,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.E,
                piece: createPiece(PieceTypes.KNIGHT, Colors.BLACK)
            },
            {
                rank: Ranks.ONE,
                file: Files.F,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.D,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.D),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.F),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.D),
                kingsideRook: null,
                queensideRook: null
            }
        });

        let whiteCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingSquares.king.rank, whiteCastlingSquares.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(whiteCastlingSquares.kingsideRook);
    });

    test("kingside rook is to the left of g-file with piece on g-file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.B,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.C,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.G,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.A,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.B),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.C),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.B),
                kingsideRook: null,
                queensideRook: null
            }
        });

        let whiteCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingSquares.king.rank, whiteCastlingSquares.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(whiteCastlingSquares.kingsideRook);
    });

    test("kingside rook is to the left of g-file with piece on h-file", () => {
        let piecePlacements: PiecePlacement[] = [
            {
                rank: Ranks.ONE,
                file: Files.E,
                piece: createPiece(PieceTypes.KING, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.F,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            },
            {
                rank: Ranks.ONE,
                file: Files.H,
                piece: createPiece(PieceTypes.KNIGHT, Colors.BLACK)
            },
            {
                rank: Ranks.EIGHT,
                file: Files.E,
                piece: createPiece(PieceTypes.KING, Colors.BLACK)
            }
        ];

        backEndTester.placePieces(piecePlacements);
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.E),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.F),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.E),
                kingsideRook: null,
                queensideRook: null
            }
        });

        let whiteCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingSquares.king.rank, whiteCastlingSquares.king.file);

        expect(moves).toContain(whiteCastlingSquares.kingsideRook);
    });

    test("kingside rook is on g-file with in-between piece", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.D),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.G),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.D),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.ONE,
                file: Files.F,
                piece: createPiece(PieceTypes.KNIGHT, Colors.BLACK)
            }
        ]);
        backEndTester.placePieces(piecePlacements);

        let whiteCastlingPieces = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingPieces.king.rank, whiteCastlingPieces.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(whiteCastlingPieces.kingsideRook);
    });

    test("kingside rook is on g-file with piece on h-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.D),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.G),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.D),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.ONE,
                file: Files.H,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ]);
        backEndTester.placePieces(piecePlacements);

        let whiteCastlingPieces = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingPieces.king.rank, whiteCastlingPieces.king.file);

        expect(moves).toContain(whiteCastlingPieces.kingsideRook);
    });

    test("kingside rook is to the right of g-file with in-between piece", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.B),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.B),
                kingsideRook: backEndTester.getSquare(Ranks.EIGHT, Files.H),
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.EIGHT,
                file: Files.F,
                piece: createPiece(PieceTypes.KNIGHT, Colors.BLACK)
            }
        ]);
        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingPieces = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingPieces.king.rank, blackCastlingPieces.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(blackCastlingPieces.kingsideRook);
    });
});

describe("Testing queenside castling with pieces interfering the king", () => {
    test("queenside rook is to the right of c-file with in-between piece", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.G),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.ONE, Files.E)
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.G),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.ONE,
                file: Files.F,
                piece: createPiece(PieceTypes.QUEEN, Colors.WHITE)
            }
        ]);
        backEndTester.placePieces(piecePlacements);

        let whiteCastlingPieces = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingPieces.king.rank, whiteCastlingPieces.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(whiteCastlingPieces.queensideRook);
    });

    test("queenside rook is to the right of c-file with piece on c-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.H),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.H),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.G)
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.EIGHT,
                file: Files.C,
                piece: createPiece(PieceTypes.ROOK, Colors.WHITE)
            }
        ]);
        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingPieces = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingPieces.king.rank, blackCastlingPieces.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(blackCastlingPieces.queensideRook);
    });

    test("queenside rook is to the right of c-file with piece to left of c-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.H),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.H),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.G)
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.EIGHT,
                file: Files.B,
                piece: createPiece(PieceTypes.QUEEN, Colors.BLACK)
            }
        ]);
        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingPieces = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingPieces.king.rank, blackCastlingPieces.king.file);

        expect(moves).toContain(blackCastlingPieces.queensideRook);
    });

    test("queenside rook in on the c-file with in-between piece", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.G),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.G),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.C)
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.EIGHT,
                file: Files.F,
                piece: createPiece(PieceTypes.BISHOP, Colors.WHITE)
            }
        ]);
        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingSquares = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingSquares.king.rank, blackCastlingSquares.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(blackCastlingSquares.queensideRook);
    });

    test("queenside rook in on the c-file with piece to the right of c-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.G),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.G),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.C)
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.EIGHT,
                file: Files.B,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ]);
        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingSquares = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingSquares.king.rank, blackCastlingSquares.king.file);

        expect(moves).toContain(blackCastlingSquares.queensideRook);
    });

    test("queenside rook in on the c-file with piece to the left of c-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.G),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.G),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.C)
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.EIGHT,
                file: Files.B,
                piece: createPiece(PieceTypes.ROOK, Colors.BLACK)
            }
        ]);
        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingSquares = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingSquares.king.rank, blackCastlingSquares.king.file);

        expect(moves).toContain(blackCastlingSquares.queensideRook);
    });

    test("queenside rook is to the left of c-file with in-between piece", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.G),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.ONE, Files.A)
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.G),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.ONE,
                file: Files.B,
                piece: createPiece(PieceTypes.BISHOP, Colors.BLACK)
            }
        ]);
        backEndTester.placePieces(piecePlacements);

        let blackCastlingSquares = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingSquares.king.rank, blackCastlingSquares.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(blackCastlingSquares.queensideRook);
    });

    test("queenside rook on b-file, piece on a-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.C),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.C),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.B)
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        piecePlacements = piecePlacements.concat([
            {
                rank: Ranks.EIGHT,
                file: Files.A,
                piece: createPiece(PieceTypes.KNIGHT, Colors.BLACK)
            }
        ]);
        backEndTester.placePieces(piecePlacements);
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingSquares = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingSquares.king.rank, blackCastlingSquares.king.file);
        
        expect(moves).toContain(blackCastlingSquares.queensideRook);
    });
});

describe("Testing kingside castling with pieces interfering the kingside rook", () => {
    /* Honestly, I am tired of the manual modifications, so I will rewrite to generate the piece placements for the castling squares because that makes sense*/
    test("king on g-file, rook on h-file, piece on f-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.G),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.G),
                kingsideRook: backEndTester.getSquare(Ranks.EIGHT, Files.H),
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        backEndTester.placePieces(piecePlacements.concat([
            {
                rank: Ranks.EIGHT,
                file: Files.F,
                piece: createPiece(PieceTypes.BISHOP, Colors.WHITE)
            }
        ]));
        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingSquares = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingSquares.king.rank, blackCastlingSquares.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(blackCastlingSquares.kingsideRook);
    });

    test("king on f-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.F),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.G),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.F),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        backEndTester.placePieces(piecePlacements);

        let whiteCastlingPieces = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingPieces.king.rank, whiteCastlingPieces.king.file);

        expect(moves).toContain(whiteCastlingPieces.kingsideRook);
    });

    test("rook on f-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.D),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.F),
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.D),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        backEndTester.placePieces(piecePlacements);

        let whiteCastlingPieces = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingPieces.king.rank, whiteCastlingPieces.king.file);

        expect(moves).toContain(whiteCastlingPieces.kingsideRook);
    });
});

describe("Testing queenside castling with pieces interfering the queenside rook", () => {
    test("king on b-file, rook on a-file, interfering piece on d-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.B),
                kingsideRook: backEndTester.getSquare(Ranks.ONE, Files.D),
                queensideRook: backEndTester.getSquare(Ranks.ONE, Files.A)
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.B),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        backEndTester.placePieces(piecePlacements);

        let whiteCastlingPieces = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingPieces.king.rank, whiteCastlingPieces.king.file);

        expect(moves).not.toHaveLength(0);
        expect(moves).not.toContain(whiteCastlingPieces.queensideRook);
    });

    test("king on d-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.D),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.ONE, Files.C)
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.D),
                kingsideRook: null,
                queensideRook: null
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        backEndTester.placePieces(piecePlacements);

        let whiteCastlingPieces = backEndTester.getCastlingSquares()[Colors.WHITE];
        let moves = backEndTester.getPseudoLegalMoves(whiteCastlingPieces.king.rank, whiteCastlingPieces.king.file);

        expect(moves).toContain(whiteCastlingPieces.queensideRook);
    });

    test("rook on d-file", () => {
        backEndTester.setCastlingSquares({
            [Colors.WHITE]: {
                king: backEndTester.getSquare(Ranks.ONE, Files.D),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: backEndTester.getSquare(Ranks.EIGHT, Files.D),
                kingsideRook: null,
                queensideRook: backEndTester.getSquare(Ranks.EIGHT, Files.G)
            }
        });
        
        let piecePlacements = getPiecePlacementsFromCastlingSquares(backEndTester.getCastlingSquares());
        backEndTester.placePieces(piecePlacements);

        backEndTester.setColorToMove(Colors.BLACK);

        let blackCastlingPieces = backEndTester.getCastlingSquares()[Colors.BLACK];
        let moves = backEndTester.getPseudoLegalMoves(blackCastlingPieces.king.rank, blackCastlingPieces.king.file);

        expect(moves).toContain(blackCastlingPieces.queensideRook);
    });
});