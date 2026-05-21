import { OFF_BOARD_SQUARE } from "./utils.js";
import { PAWN_WHITE_CAPTURE_DELTAS, PAWN_BLACK_CAPTURE_DELTAS, PAWN_WHITE_FORWARD_DELTA, PAWN_BLACK_FORWARD_DELTA, KNIGHT_DELTAS, BISHOP_DELTAS, ROOK_DELTAS, QUEEN_DELTAS, KING_DELTAS } from "./piece-deltas.js";
const NUM_ROWS = 12;
const NUM_COLUMNS = 10;
let backEnd = null;
function getBackEnd() {
    if (backEnd === null) {
        throw new Error("backEnd not initialized");
    }
    return backEnd;
}
function getIndex(rank, file) {
    let rankOffset = rank - 1 /* Ranks.ONE */;
    let fileOffset = file - 1 /* Files.A */;
    return NUM_COLUMNS * (rankOffset + 2) + fileOffset + 1;
}
function getSquare(rank, file) {
    let backEnd = getBackEnd();
    let square = backEnd.board[getIndex(rank, file)];
    if (!square.isOnBoard) {
        throw new Error("Square is not on board");
    }
    return square;
}
function getColorToMove() {
    let backEnd = getBackEnd();
    return backEnd.colorToMove;
}
function getPiece(rank, file) {
    return getSquare(rank, file).piece;
}
function isPiecePresent(rank, file) {
    return getPiece(rank, file) !== null;
}
function getTransposed(square, delta) {
    let newRank = square.rank + delta.rank;
    let newFile = square.file + delta.file;
    let resultSquare = getBackEnd().board[getIndex(newRank, newFile)];
    return resultSquare;
}
function getLeapingMoves(fromSquare, DELTAS) {
    let moves = [];
    for (const DELTA of DELTAS) {
        let toSquare = getTransposed(fromSquare, DELTA);
        if (toSquare.isOnBoard && (toSquare.piece === null || toSquare.piece.color !== fromSquare.piece.color)) {
            moves.push(toSquare);
        }
    }
    return moves;
}
function getSlidingMoves(fromSquare, DELTAS) {
    let moves = [];
    for (const DELTA of DELTAS) {
        let toSquare = getTransposed(fromSquare, DELTA);
        while (toSquare.isOnBoard && toSquare.piece === null) {
            moves.push(toSquare);
            toSquare = getTransposed(toSquare, DELTA);
        }
        if (toSquare.isOnBoard && toSquare.piece.color !== fromSquare.piece.color) {
            moves.push(toSquare);
        }
    }
    return moves;
}
function getPawnMoves(fromSquare) {
    let moves = [];
    const FORWARD_DIRECTION = fromSquare.piece.color === 0 /* Colors.WHITE */ ? PAWN_WHITE_FORWARD_DELTA : PAWN_BLACK_FORWARD_DELTA;
    let forwardSquare = getTransposed(fromSquare, FORWARD_DIRECTION); /* Guaranteed to be OnBoardSquare in this case */
    if (forwardSquare.piece === null) {
        moves.push(forwardSquare);
    }
    let forward2Square = getTransposed(forwardSquare, FORWARD_DIRECTION);
    if (fromSquare.piece.hasMoved === false && forwardSquare.piece === null && forward2Square.piece === null) {
        moves.push(forward2Square);
    }
    let directions = fromSquare.piece.color === 0 /* Colors.WHITE */ ? PAWN_WHITE_CAPTURE_DELTAS : PAWN_BLACK_CAPTURE_DELTAS;
    for (const CAPTURE_DIRECTION of directions) {
        let captureSquare = getTransposed(fromSquare, CAPTURE_DIRECTION);
        if (captureSquare.isOnBoard && captureSquare.piece !== null && captureSquare.piece.color !== fromSquare.piece.color) {
            moves.push(captureSquare);
        }
        else if (captureSquare === getBackEnd().enPassantSquare) {
            moves.push(captureSquare);
        }
    }
    return moves;
}
function canCastle(kingSquare, rookFile) {
    if (kingSquare.piece.hasMoved) {
        return false;
    }
    let rookSquare = getSquare(kingSquare.rank, rookFile);
    if (rookSquare.piece === null || rookSquare.piece.hasMoved) {
        return false;
    }
    let kingDestinationFile = kingSquare.file < rookFile ? 7 /* Files.G */ : 3 /* Files.C */;
    let kingScanFile = kingSquare.file === kingDestinationFile || (kingSquare.file < kingDestinationFile === kingDestinationFile < rookFile) ? rookFile : kingDestinationFile;
    let KING_DELTA = {
        rank: 0,
        file: Math.sign(kingScanFile - kingSquare.file)
    };
    const KING_PIECE = kingSquare.piece;
    const ROOK_PIECE = rookSquare.piece;
    kingSquare.piece = null; /* Remove king and rook temporarily so that rook does not trigger false negative. */
    rookSquare.piece = null;
    let prevFile = kingSquare.file;
    let currSquare = getTransposed(kingSquare, KING_DELTA);
    while (prevFile !== kingScanFile && currSquare.piece === null) {
        prevFile = currSquare.file;
        currSquare = getTransposed(currSquare, KING_DELTA); /* Trust me: This will not go off board! */
    }
    let rookDestinationFile = kingSquare.file < rookFile ? 6 /* Files.F */ : 4 /* Files.D */;
    let canCastle = prevFile === kingScanFile && getSquare(kingSquare.rank, rookDestinationFile).piece === null; /* Make sure rook destination square is empty */
    kingSquare.piece = KING_PIECE; /* Restore the pieces */
    rookSquare.piece = ROOK_PIECE;
    return canCastle;
}
function getKingMoves(fromSquare) {
    let moves = getLeapingMoves(fromSquare, KING_DELTAS);
    let backEnd = getBackEnd();
    let kingsideRookFile = backEnd.kingsideRookFile;
    if (canCastle(fromSquare, kingsideRookFile)) {
        moves.push(getSquare(fromSquare.rank, kingsideRookFile));
    }
    let queensideRookFile = backEnd.queensideRookFile;
    if (canCastle(fromSquare, queensideRookFile)) {
        moves.push(getSquare(fromSquare.rank, queensideRookFile));
    }
    return moves;
}
function getPseudoLegalMoves(rank, file) {
    let square = getSquare(rank, file);
    if (square.piece === null || square.piece.color !== getColorToMove()) {
        return [];
    }
    switch (square.piece.type) {
        case 0 /* PieceTypes.PAWN */:
            return getPawnMoves(square);
        case 1 /* PieceTypes.KNIGHT */:
            return getLeapingMoves(square, KNIGHT_DELTAS);
        case 2 /* PieceTypes.BISHOP */:
            return getSlidingMoves(square, BISHOP_DELTAS);
        case 3 /* PieceTypes.ROOK */:
            return getSlidingMoves(square, ROOK_DELTAS);
        case 4 /* PieceTypes.QUEEN */:
            return getSlidingMoves(square, QUEEN_DELTAS);
        case 5 /* PieceTypes.KING */:
            return getKingMoves(square);
        default:
            throw new Error("unknown piece type");
    }
}
function createPiece(type, color) {
    return {
        type: type,
        color: color,
        hasMoved: false
    };
}
function initialize() {
    let board = new Array(NUM_ROWS * NUM_COLUMNS);
    board.fill(OFF_BOARD_SQUARE);
    for (let rank = 1 /* Ranks.ONE */; rank <= 8 /* Ranks.EIGHT */; ++rank) {
        for (let file = 1 /* Files.A */; file <= 8 /* Files.H */; ++file) {
            board[getIndex(rank, file)] = {
                isOnBoard: true,
                piece: null,
                rank: rank,
                file: file
            };
        }
    }
    const NUM_FILES = 8;
    // Ensure bishops are on opposite colors
    let bishopFile1 = 2 * Math.floor(NUM_FILES / 2 * Math.random()) + 1;
    let bishopFile2 = 2 * Math.floor(NUM_FILES / 2 * Math.random()) + 2;
    // Only consider files not in bishopFile1 or bishopFile2
    let fileOptions = [];
    for (let file = 1 /* Files.A */; file <= 8 /* Files.H */; ++file) {
        if (file !== bishopFile1 && file !== bishopFile2) {
            fileOptions.push(file);
        }
    }
    // Shuffle with Fisher-Yates algorithm
    for (let i = 0; i < fileOptions.length - 1; ++i) {
        let swapIndex = Math.floor(Math.random() * (fileOptions.length - i)) + i;
        let temp = fileOptions[i];
        fileOptions[i] = fileOptions[swapIndex];
        fileOptions[swapIndex] = temp;
    }
    let [knightFile1, knightFile2, queenFile, rookFile1, rookFile2, kingFile] = fileOptions;
    // Ensure king is in between rooks
    if (kingFile < rookFile1 === rookFile1 < rookFile2) {
        let temp = kingFile;
        kingFile = rookFile1;
        rookFile1 = temp;
    }
    else if (kingFile < rookFile2 === rookFile2 < rookFile1) {
        let temp = kingFile;
        kingFile = rookFile2;
        rookFile2 = temp;
    }
    let kingsideRookFile = kingFile < rookFile1 ? rookFile1 : rookFile2;
    let queensideRookFile = rookFile1 < kingFile ? rookFile1 : rookFile2;
    backEnd = {
        board: board,
        colorToMove: 0 /* Colors.WHITE */,
        enPassantSquare: null,
        kingsideRookFile,
        queensideRookFile
    };
    getSquare(1 /* Ranks.ONE */, knightFile1).piece = createPiece(1 /* PieceTypes.KNIGHT */, 0 /* Colors.WHITE */);
    getSquare(1 /* Ranks.ONE */, knightFile2).piece = createPiece(1 /* PieceTypes.KNIGHT */, 0 /* Colors.WHITE */);
    getSquare(1 /* Ranks.ONE */, bishopFile1).piece = createPiece(2 /* PieceTypes.BISHOP */, 0 /* Colors.WHITE */);
    getSquare(1 /* Ranks.ONE */, bishopFile2).piece = createPiece(2 /* PieceTypes.BISHOP */, 0 /* Colors.WHITE */);
    getSquare(1 /* Ranks.ONE */, rookFile1).piece = createPiece(3 /* PieceTypes.ROOK */, 0 /* Colors.WHITE */);
    getSquare(1 /* Ranks.ONE */, rookFile2).piece = createPiece(3 /* PieceTypes.ROOK */, 0 /* Colors.WHITE */);
    getSquare(1 /* Ranks.ONE */, queenFile).piece = createPiece(4 /* PieceTypes.QUEEN */, 0 /* Colors.WHITE */);
    getSquare(1 /* Ranks.ONE */, kingFile).piece = createPiece(5 /* PieceTypes.KING */, 0 /* Colors.WHITE */);
    for (let file = 1 /* Files.A */; file <= 8 /* Files.H */; ++file) {
        getSquare(2 /* Ranks.TWO */, file).piece = createPiece(0 /* PieceTypes.PAWN */, 0 /* Colors.WHITE */);
        getSquare(7 /* Ranks.SEVEN */, file).piece = createPiece(0 /* PieceTypes.PAWN */, 1 /* Colors.BLACK */);
        let rank1Piece = getSquare(1 /* Ranks.ONE */, file).piece;
        if (rank1Piece === null) {
            throw new Error("Rank1 Piece not yet initialized");
        }
        getSquare(8 /* Ranks.EIGHT */, file).piece = createPiece(rank1Piece.type, 1 /* Colors.BLACK */);
    }
}
export { initialize, getSquare, getColorToMove, getPiece, isPiecePresent, getPseudoLegalMoves };
