import { OFF_BOARD_SQUARE } from "./utils.js";
import { PAWN_WHITE_CAPTURE_DELTAS, PAWN_BLACK_CAPTURE_DELTAS, PAWN_WHITE_FORWARD_DELTA, PAWN_BLACK_FORWARD_DELTA, KNIGHT_DELTAS, BISHOP_DELTAS, ROOK_DELTAS, QUEEN_DELTAS, KING_DELTAS } from "./piece-deltas.js";
class BackEnd {
    static NUM_ROWS = 12;
    static NUM_COLUMNS = 10;
    board;
    colorToMove;
    enPassantSquare;
    castlingSquares;
    constructor() {
        this.board = this.makeEmptyBoard();
        this.colorToMove = 0 /* Colors.WHITE */;
        this.enPassantSquare = null;
        this.castlingSquares = {
            [0 /* Colors.WHITE */]: {
                king: this.getSquare(1 /* Ranks.ONE */, 1 /* Files.A */),
                kingsideRook: null,
                queensideRook: null
            },
            [1 /* Colors.BLACK */]: {
                king: this.getSquare(8 /* Ranks.EIGHT */, 1 /* Files.A */),
                kingsideRook: null,
                queensideRook: null
            }
        };
    }
    makeEmptyBoard() {
        let board = new Array(BackEnd.NUM_ROWS * BackEnd.NUM_COLUMNS);
        board.fill(OFF_BOARD_SQUARE);
        for (let rank = 1 /* Ranks.ONE */; rank <= 8 /* Ranks.EIGHT */; ++rank) {
            for (let file = 1 /* Files.A */; file <= 8 /* Files.H */; ++file) {
                board[this.getIndex(rank, file)] = {
                    isOnBoard: true,
                    piece: null,
                    rank: rank,
                    file: file
                };
            }
        }
        return board;
    }
    getIndex(rank, file) {
        let rankOffset = rank - 1 /* Ranks.ONE */;
        let fileOffset = file - 1 /* Files.A */;
        return BackEnd.NUM_COLUMNS * (rankOffset + 2) + fileOffset + 1;
    }
    getSquare(rank, file) {
        let square = this.board[this.getIndex(rank, file)]; // Just trust me that this does not go out of bounds
        return square;
    }
    getColorToMove() {
        return this.colorToMove;
    }
    getPiece(rank, file) {
        return this.getSquare(rank, file).piece;
    }
    isPiecePresent(rank, file) {
        return this.getPiece(rank, file) !== null;
    }
    getTransposed(square, delta) {
        let newRank = square.rank + delta.rank;
        let newFile = square.file + delta.file;
        let resultSquare = this.board[this.getIndex(newRank, newFile)];
        return resultSquare;
    }
    getLeapingMoves(fromSquare, DELTAS) {
        let moves = [];
        for (const DELTA of DELTAS) {
            let toSquare = this.getTransposed(fromSquare, DELTA);
            if (toSquare.isOnBoard && (toSquare.piece === null || toSquare.piece.color !== fromSquare.piece.color)) {
                moves.push(toSquare);
            }
        }
        return moves;
    }
    getSlidingMoves(fromSquare, DELTAS) {
        let moves = [];
        for (const DELTA of DELTAS) {
            let toSquare = this.getTransposed(fromSquare, DELTA);
            while (toSquare.isOnBoard && toSquare.piece === null) {
                moves.push(toSquare);
                toSquare = this.getTransposed(toSquare, DELTA);
            }
            if (toSquare.isOnBoard && toSquare.piece.color !== fromSquare.piece.color) {
                moves.push(toSquare);
            }
        }
        return moves;
    }
    getPawnMoves(fromSquare) {
        let moves = [];
        const [STARTING_RANK, FORWARD_DIRECTION, CAPTURE_DIRECTIONS] = fromSquare.piece.color === 0 /* Colors.WHITE */
            ? [2 /* Ranks.TWO */, PAWN_WHITE_FORWARD_DELTA, PAWN_WHITE_CAPTURE_DELTAS]
            : [7 /* Ranks.SEVEN */, PAWN_BLACK_FORWARD_DELTA, PAWN_BLACK_CAPTURE_DELTAS];
        let forwardSquare = this.getTransposed(fromSquare, FORWARD_DIRECTION); /* Guaranteed to be OnBoardSquare in this case */
        if (forwardSquare.piece === null) {
            moves.push(forwardSquare);
        }
        let forward2Square = this.getTransposed(forwardSquare, FORWARD_DIRECTION);
        if (fromSquare.rank === STARTING_RANK && forwardSquare.piece === null && forward2Square.piece === null) {
            moves.push(forward2Square);
        }
        for (const CAPTURE_DIRECTION of CAPTURE_DIRECTIONS) {
            let captureSquare = this.getTransposed(fromSquare, CAPTURE_DIRECTION);
            if (captureSquare.isOnBoard && captureSquare.piece !== null && captureSquare.piece.color !== fromSquare.piece.color) {
                moves.push(captureSquare);
            }
            else if (captureSquare === this.enPassantSquare) {
                moves.push(captureSquare);
            }
        }
        return moves;
    }
    canCastle(kingSquare, rookSquare) {
        if (kingSquare.piece.hasMoved || rookSquare === null || rookSquare.piece.hasMoved) {
            return false;
        }
        let castlingRank = this.colorToMove === 0 /* Colors.WHITE */ ? 1 /* Ranks.ONE */ : 8 /* Ranks.EIGHT */;
        if (kingSquare.rank !== castlingRank || rookSquare.rank !== castlingRank) {
            return false;
        }
        let kingDestinationFile = kingSquare.file < rookSquare.file ? 7 /* Files.G */ : 3 /* Files.C */;
        let kingScanFile = kingSquare.file === kingDestinationFile || (kingSquare.file < kingDestinationFile === kingDestinationFile < rookSquare.file) ? rookSquare.file : kingDestinationFile;
        let KING_DELTA = {
            rank: 0,
            file: Math.sign(kingScanFile - kingSquare.file)
        };
        const KING_PIECE = kingSquare.piece;
        const ROOK_PIECE = rookSquare.piece;
        kingSquare.piece = null; /* Remove king and rook temporarily so that rook does not trigger false negative. */
        rookSquare.piece = null;
        let prevFile = kingSquare.file;
        let currSquare = this.getTransposed(kingSquare, KING_DELTA);
        while (prevFile !== kingScanFile && currSquare.piece === null) {
            prevFile = currSquare.file;
            currSquare = this.getTransposed(currSquare, KING_DELTA); /* Trust me: This will not go off board! */
        }
        let rookDestinationFile = kingSquare.file < rookSquare.file ? 6 /* Files.F */ : 4 /* Files.D */;
        let canCastle = prevFile === kingScanFile && this.getSquare(kingSquare.rank, rookDestinationFile).piece === null; /* Make sure rook destination square is empty */
        kingSquare.piece = KING_PIECE; /* Restore the pieces */
        rookSquare.piece = ROOK_PIECE;
        return canCastle;
    }
    getKingMoves(fromSquare) {
        let moves = this.getLeapingMoves(fromSquare, KING_DELTAS);
        let castlingSquares = this.castlingSquares[fromSquare.piece.color];
        if (this.canCastle(fromSquare, castlingSquares.kingsideRook)) {
            moves.push(castlingSquares.kingsideRook);
        }
        if (this.canCastle(fromSquare, castlingSquares.queensideRook)) {
            moves.push(castlingSquares.queensideRook);
        }
        return moves;
    }
    getPseudoLegalMoves(rank, file) {
        let square = this.getSquare(rank, file);
        if (square.piece === null || square.piece.color !== this.colorToMove) {
            return [];
        }
        switch (square.piece.type) {
            case 0 /* PieceTypes.PAWN */:
                return this.getPawnMoves(square);
            case 1 /* PieceTypes.KNIGHT */:
                return this.getLeapingMoves(square, KNIGHT_DELTAS);
            case 2 /* PieceTypes.BISHOP */:
                return this.getSlidingMoves(square, BISHOP_DELTAS);
            case 3 /* PieceTypes.ROOK */:
                return this.getSlidingMoves(square, ROOK_DELTAS);
            case 4 /* PieceTypes.QUEEN */:
                return this.getSlidingMoves(square, QUEEN_DELTAS);
            case 5 /* PieceTypes.KING */:
                return this.getKingMoves(square);
            default:
                throw new Error("unknown piece type");
        }
    }
}
// function initialize(){
//     const NUM_FILES = 8;
//     // Ensure bishops are on opposite colors
//     let bishopFile1 = 2 * Math.floor(NUM_FILES / 2 * Math.random()) + 1;
//     let bishopFile2 = 2 * Math.floor(NUM_FILES / 2 * Math.random()) + 2;
//     // Only consider files not in bishopFile1 or bishopFile2
//     let fileOptions: Files[] = [];
//     for (let file = Files.A; file <= Files.H; ++file){
//         if (file !== bishopFile1 && file !== bishopFile2){
//             fileOptions.push(file);
//         }
//     }
//     // Shuffle with Fisher-Yates algorithm
//     for (let i = 0; i < fileOptions.length - 1; ++i){
//         let swapIndex = Math.floor(Math.random() * (fileOptions.length - i)) + i;
//         let temp = fileOptions[i];
//         fileOptions[i] = fileOptions[swapIndex];
//         fileOptions[swapIndex] = temp;
//     }
//     let [knightFile1, knightFile2, queenFile, rookFile1, rookFile2, kingFile] = fileOptions;
//     // Ensure king is in between rooks
//     if (kingFile < rookFile1 === rookFile1 < rookFile2){
//         let temp = kingFile;
//         kingFile = rookFile1;
//         rookFile1 = temp;
//     }
//     else if (kingFile < rookFile2 === rookFile2 < rookFile1){
//         let temp = kingFile;
//         kingFile = rookFile2;
//         rookFile2 = temp;
//     }
//     let kingsideRookFile = kingFile < rookFile1 ? rookFile1 : rookFile2;
//     let queensideRookFile = rookFile1 < kingFile ? rookFile1 : rookFile2;
//     getSquare(Ranks.ONE, knightFile1).piece = createPiece(PieceTypes.KNIGHT, Colors.WHITE);
//     getSquare(Ranks.ONE, knightFile2).piece = createPiece(PieceTypes.KNIGHT, Colors.WHITE);
//     getSquare(Ranks.ONE, bishopFile1).piece = createPiece(PieceTypes.BISHOP, Colors.WHITE);
//     getSquare(Ranks.ONE, bishopFile2).piece = createPiece(PieceTypes.BISHOP, Colors.WHITE);
//     getSquare(Ranks.ONE, rookFile1).piece = createPiece(PieceTypes.ROOK, Colors.WHITE);
//     getSquare(Ranks.ONE, rookFile2).piece = createPiece(PieceTypes.ROOK, Colors.WHITE);
//     getSquare(Ranks.ONE, queenFile).piece = createPiece(PieceTypes.QUEEN, Colors.WHITE);
//     getSquare(Ranks.ONE, kingFile).piece = createPiece(PieceTypes.KING, Colors.WHITE);
//     for (let file = Files.A; file <= Files.H; ++file){
//         getSquare(Ranks.TWO, file).piece = createPiece(PieceTypes.PAWN, Colors.WHITE);
//         getSquare(Ranks.SEVEN, file).piece = createPiece(PieceTypes.PAWN, Colors.BLACK);
//         let rank1Piece = getSquare(Ranks.ONE, file).piece;
//         if (rank1Piece === null){
//             throw new Error("Rank1 Piece not yet initialized");
//         }
//         getSquare(Ranks.EIGHT, file).piece = createPiece(rank1Piece.type, Colors.BLACK);
//     }
//     backEnd.colorToMove = Colors.WHITE;
//     backEnd.enPassantSquare = null;
//     backEnd.kingsideRookFile = kingsideRookFile;
//     backEnd.queensideRookFile = queensideRookFile;
// }
export { BackEnd };
