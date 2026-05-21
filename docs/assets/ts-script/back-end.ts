import {Ranks, Files, PieceTypes, Colors, Piece, OnBoardSquare, OFF_BOARD_SQUARE, Square} from "./utils";
import {BoardDelta, PAWN_WHITE_CAPTURE_DELTAS, PAWN_BLACK_CAPTURE_DELTAS, PAWN_WHITE_FORWARD_DELTA, PAWN_BLACK_FORWARD_DELTA,
    KNIGHT_DELTAS, BISHOP_DELTAS, ROOK_DELTAS, QUEEN_DELTAS, KING_DELTAS
} from "./piece-deltas";

interface BackEnd{
    board: Square[],
    colorToMove: Colors,
    enPassantSquare: OnBoardSquare | null,
    kingsideRookFile: Files,
    queensideRookFile: Files
}

const NUM_ROWS = 12;
const NUM_COLUMNS = 10;
let backEnd: BackEnd | null = null;

function getBackEnd(){
    if (backEnd === null){
        throw new Error("backEnd not initialized");
    }
    return backEnd;
}

function getIndex(rank: number, file: number){
    let rankOffset = rank - Ranks.ONE;
    let fileOffset = file - Files.A;

    return NUM_COLUMNS * (rankOffset + 2) + fileOffset + 1;
}

function getSquare(rank: Ranks, file: Files){
    let backEnd = getBackEnd();
    let square = backEnd.board[getIndex(rank, file)]
    if (!square.isOnBoard){
        throw new Error("Square is not on board");
    }
    return square;
}

function getColorToMove(){
    let backEnd = getBackEnd();
    return backEnd.colorToMove;
}

function getPiece(rank: Ranks, file: Files){
    return getSquare(rank, file).piece;
}

function isPiecePresent(rank: Ranks, file: Files){
    return getPiece(rank, file) !== null;
}

function getTransposed(square: OnBoardSquare, delta: BoardDelta): Square{
    let newRank = square.rank + delta.rank;
    let newFile = square.file + delta.file;
    let resultSquare = getBackEnd().board[getIndex(newRank, newFile)];
    return resultSquare;
}

function getLeapingMoves(fromSquare: OnBoardSquare, DELTAS: readonly BoardDelta[]): OnBoardSquare[]{
    let moves: OnBoardSquare[] = [];
    for (const DELTA of DELTAS){
        let toSquare = getTransposed(fromSquare, DELTA);
        if (toSquare.isOnBoard && (toSquare.piece === null || toSquare.piece.color !== fromSquare.piece!.color)){
            moves.push(toSquare);
        }
    }
    return moves;
}

function getSlidingMoves(fromSquare: OnBoardSquare, DELTAS: readonly BoardDelta[]){
    let moves: OnBoardSquare[] = [];
    for (const DELTA of DELTAS){
        let toSquare = getTransposed(fromSquare, DELTA);
        while (toSquare.isOnBoard && toSquare.piece === null){
            moves.push(toSquare);
            toSquare = getTransposed(toSquare, DELTA);
        }
        if (toSquare.isOnBoard && toSquare.piece!.color !== fromSquare.piece!.color){
            moves.push(toSquare);
        }
    }
    return moves;
}

function getPawnMoves(fromSquare: OnBoardSquare){
    let moves: OnBoardSquare[] = [];

    const FORWARD_DIRECTION = fromSquare.piece!.color === Colors.WHITE ? PAWN_WHITE_FORWARD_DELTA : PAWN_BLACK_FORWARD_DELTA;

    let forwardSquare = getTransposed(fromSquare, FORWARD_DIRECTION) as OnBoardSquare; /* Guaranteed to be OnBoardSquare in this case */
    if (forwardSquare.piece === null){
        moves.push(forwardSquare);
    }

    let forward2Square = getTransposed(forwardSquare, FORWARD_DIRECTION);
    if (fromSquare.piece!.hasMoved === false && forwardSquare.piece === null && (forward2Square as OnBoardSquare).piece === null){
        moves.push(forward2Square as OnBoardSquare);
    }

    let directions = fromSquare.piece!.color === Colors.WHITE ? PAWN_WHITE_CAPTURE_DELTAS : PAWN_BLACK_CAPTURE_DELTAS;
    for (const CAPTURE_DIRECTION of directions){
        let captureSquare = getTransposed(fromSquare, CAPTURE_DIRECTION);
        if (captureSquare.isOnBoard && captureSquare.piece !== null && captureSquare.piece.color !== fromSquare.piece!.color){
            moves.push(captureSquare);
        }
        else if (captureSquare === getBackEnd().enPassantSquare){
            moves.push(captureSquare);
        }
    }

    return moves;
}

function canCastle(kingSquare: OnBoardSquare, rookFile: Files): boolean{
    if (kingSquare.piece!.hasMoved){
        return false;
    }

    let rookSquare = getSquare(kingSquare.rank, rookFile);
    if (rookSquare.piece === null || rookSquare.piece.hasMoved){
        return false;
    }

    let kingDestinationFile = kingSquare.file < rookFile ? Files.G : Files.C;
    let kingScanFile = kingSquare.file === kingDestinationFile || (kingSquare.file < kingDestinationFile === kingDestinationFile < rookFile) ? rookFile : kingDestinationFile;
    
    let KING_DELTA: BoardDelta = {
        rank: 0,
        file: Math.sign(kingScanFile - kingSquare.file)
    };

    const KING_PIECE = kingSquare.piece;
    const ROOK_PIECE = rookSquare.piece;
    kingSquare.piece = null;    /* Remove king and rook temporarily so that rook does not trigger false negative. */
    rookSquare.piece = null;

    let prevFile: Files = kingSquare.file;
    let currSquare = getTransposed(kingSquare, KING_DELTA) as OnBoardSquare;
    while (prevFile !== kingScanFile && currSquare.piece === null){
        prevFile = currSquare.file;
        currSquare = getTransposed(currSquare, KING_DELTA) as OnBoardSquare;    /* Trust me: This will not go off board! */
    }

    let rookDestinationFile = kingSquare.file < rookFile ? Files.F : Files.D;
    let canCastle = prevFile === kingScanFile && getSquare(kingSquare.rank, rookDestinationFile).piece === null;    /* Make sure rook destination square is empty */

    kingSquare.piece = KING_PIECE;   /* Restore the pieces */
    rookSquare.piece = ROOK_PIECE;

    return canCastle;
}

function getKingMoves(fromSquare: OnBoardSquare){
    let moves = getLeapingMoves(fromSquare, KING_DELTAS);

    let backEnd = getBackEnd();
    
    let kingsideRookFile = backEnd.kingsideRookFile;
    if (canCastle(fromSquare, kingsideRookFile)){
        moves.push(getSquare(fromSquare.rank, kingsideRookFile));
    }

    let queensideRookFile = backEnd.queensideRookFile;
    if (canCastle(fromSquare, queensideRookFile)){
        moves.push(getSquare(fromSquare.rank, queensideRookFile));
    }
    
    return moves;
}

function getPseudoLegalMoves(rank: Ranks, file: Files): Array<OnBoardSquare>{
    let square = getSquare(rank, file);
    if (square.piece === null || square.piece.color !== getColorToMove()){
        return [];
    }

    switch (square.piece.type){
        case PieceTypes.PAWN:
            return getPawnMoves(square);
        case PieceTypes.KNIGHT:
            return getLeapingMoves(square, KNIGHT_DELTAS);
        case PieceTypes.BISHOP:
            return getSlidingMoves(square, BISHOP_DELTAS);
        case PieceTypes.ROOK:
            return getSlidingMoves(square, ROOK_DELTAS);
        case PieceTypes.QUEEN:
            return getSlidingMoves(square, QUEEN_DELTAS);
        case PieceTypes.KING:
            return getKingMoves(square);
        default:
            throw new Error("unknown piece type");
    }
}

function createPiece(type: PieceTypes, color: Colors): Piece{
    return {
        type: type,
        color: color,
        hasMoved: false
    }
}

function initialize(){
    let board = new Array<Square>(NUM_ROWS * NUM_COLUMNS);
    
    board.fill(OFF_BOARD_SQUARE);
    for (let rank = Ranks.ONE; rank <= Ranks.EIGHT; ++rank){
        for (let file = Files.A; file <= Files.H; ++file){
            board[getIndex(rank, file)] = {
                isOnBoard: true,
                piece: null,
                rank: rank,
                file: file
            }
        }
    }

    const NUM_FILES = 8;

    // Ensure bishops are on opposite colors
    let bishopFile1 = 2 * Math.floor(NUM_FILES / 2 * Math.random()) + 1;
    let bishopFile2 = 2 * Math.floor(NUM_FILES / 2 * Math.random()) + 2;

    // Only consider files not in bishopFile1 or bishopFile2
    let fileOptions: Files[] = [];
    for (let file = Files.A; file <= Files.H; ++file){
        if (file !== bishopFile1 && file !== bishopFile2){
            fileOptions.push(file);
        }
    }

    // Shuffle with Fisher-Yates algorithm
    for (let i = 0; i < fileOptions.length - 1; ++i){
        let swapIndex = Math.floor(Math.random() * (fileOptions.length - i)) + i;
        let temp = fileOptions[i];
        fileOptions[i] = fileOptions[swapIndex];
        fileOptions[swapIndex] = temp;
    }

    let [knightFile1, knightFile2, queenFile, rookFile1, rookFile2, kingFile] = fileOptions;

    // Ensure king is in between rooks
    if (kingFile < rookFile1 === rookFile1 < rookFile2){
        let temp = kingFile;
        kingFile = rookFile1;
        rookFile1 = temp;
    }
    else if (kingFile < rookFile2 === rookFile2 < rookFile1){
        let temp = kingFile;
        kingFile = rookFile2;
        rookFile2 = temp;
    }

    let kingsideRookFile = kingFile < rookFile1 ? rookFile1 : rookFile2;
    let queensideRookFile = rookFile1 < kingFile ? rookFile1 : rookFile2;

    backEnd = {
        board: board,
        colorToMove: Colors.WHITE,
        enPassantSquare: null,
        kingsideRookFile,
        queensideRookFile
    }

    getSquare(Ranks.ONE, knightFile1).piece = createPiece(PieceTypes.KNIGHT, Colors.WHITE);
    getSquare(Ranks.ONE, knightFile2).piece = createPiece(PieceTypes.KNIGHT, Colors.WHITE);
    getSquare(Ranks.ONE, bishopFile1).piece = createPiece(PieceTypes.BISHOP, Colors.WHITE);
    getSquare(Ranks.ONE, bishopFile2).piece = createPiece(PieceTypes.BISHOP, Colors.WHITE);
    getSquare(Ranks.ONE, rookFile1).piece = createPiece(PieceTypes.ROOK, Colors.WHITE);
    getSquare(Ranks.ONE, rookFile2).piece = createPiece(PieceTypes.ROOK, Colors.WHITE);
    getSquare(Ranks.ONE, queenFile).piece = createPiece(PieceTypes.QUEEN, Colors.WHITE);
    getSquare(Ranks.ONE, kingFile).piece = createPiece(PieceTypes.KING, Colors.WHITE);

    for (let file = Files.A; file <= Files.H; ++file){
        getSquare(Ranks.TWO, file).piece = createPiece(PieceTypes.PAWN, Colors.WHITE);
        getSquare(Ranks.SEVEN, file).piece = createPiece(PieceTypes.PAWN, Colors.BLACK);

        let rank1Piece = getSquare(Ranks.ONE, file).piece;
        if (rank1Piece === null){
            throw new Error("Rank1 Piece not yet initialized");
        }
        getSquare(Ranks.EIGHT, file).piece = createPiece(rank1Piece.type, Colors.BLACK);
    }
}

export {initialize, getSquare, getColorToMove, getPiece, isPiecePresent, getPseudoLegalMoves }