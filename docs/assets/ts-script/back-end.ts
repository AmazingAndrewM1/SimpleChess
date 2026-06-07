import {Ranks, Files, PieceTypes, Colors, Piece, OnBoardSquare, OFF_BOARD_SQUARE, Square, createPiece, CastlingSquares} from "./utils";
import {BoardDelta, PAWN_WHITE_CAPTURE_DELTAS, PAWN_BLACK_CAPTURE_DELTAS, PAWN_WHITE_FORWARD_DELTA, PAWN_BLACK_FORWARD_DELTA,
    KNIGHT_DELTAS, BISHOP_DELTAS, ROOK_DELTAS, QUEEN_DELTAS, KING_DELTAS
} from "./piece-deltas";

class BackEnd{
    static readonly NUM_ROWS = 12;
    static readonly NUM_COLUMNS = 10;

    protected board: Square[];
    protected colorToMove: Colors;
    protected enPassantSquare: OnBoardSquare | null;
    protected castlingSquares: CastlingSquares;

    constructor(){
        this.board = this.makeEmptyBoard();
        this.colorToMove = Colors.WHITE;
        this.enPassantSquare = null;
        
        this.castlingSquares = {
            [Colors.WHITE]: {
                king: this.getSquare(Ranks.ONE, Files.A),
                kingsideRook: null,
                queensideRook: null
            },
            [Colors.BLACK]: {
                king: this.getSquare(Ranks.EIGHT, Files.A),
                kingsideRook: null,
                queensideRook: null
            }
        };
    }

    private makeEmptyBoard(): Square[]{
        let board = new Array<Square>(BackEnd.NUM_ROWS * BackEnd.NUM_COLUMNS);
        
        board.fill(OFF_BOARD_SQUARE);
        for (let rank = Ranks.ONE; rank <= Ranks.EIGHT; ++rank){
            for (let file = Files.A; file <= Files.H; ++file){
                board[this.getIndex(rank, file)] = {
                    isOnBoard: true,
                    piece: null,
                    rank: rank,
                    file: file
                }
            }
        }

        return board;
    }

    private getIndex(rank: number, file: number){
        let rankOffset = rank - Ranks.ONE;
        let fileOffset = file - Files.A;

        return BackEnd.NUM_COLUMNS * (rankOffset + 2) + fileOffset + 1;
    }

    public getSquare(rank: Ranks, file: Files): OnBoardSquare{
        let square = this.board[this.getIndex(rank, file)]; // Just trust me that this does not go out of bounds
        return square as OnBoardSquare;
    }

    public getColorToMove(){
        return this.colorToMove;
    }

    public getPiece(rank: Ranks, file: Files){
        return this.getSquare(rank, file).piece;
    }
    
    public isPiecePresent(rank: Ranks, file: Files){
        return this.getPiece(rank, file) !== null;
    }

    public getTransposed(square: OnBoardSquare, delta: BoardDelta): Square{
        let newRank = square.rank + delta.rank;
        let newFile = square.file + delta.file;
        let resultSquare = this.board[this.getIndex(newRank, newFile)];
        return resultSquare;
    }

    public getLeapingMoves(fromSquare: OnBoardSquare, DELTAS: readonly BoardDelta[]): OnBoardSquare[]{
        let moves: OnBoardSquare[] = [];
        for (const DELTA of DELTAS){
            let toSquare = this.getTransposed(fromSquare, DELTA);
            if (toSquare.isOnBoard && (toSquare.piece === null || toSquare.piece.color !== fromSquare.piece!.color)){
                moves.push(toSquare);
            }
        }
        return moves;
    }

    public getSlidingMoves(fromSquare: OnBoardSquare, DELTAS: readonly BoardDelta[]){
        let moves: OnBoardSquare[] = [];
        for (const DELTA of DELTAS){
            let toSquare = this.getTransposed(fromSquare, DELTA);
            while (toSquare.isOnBoard && toSquare.piece === null){
                moves.push(toSquare);
                toSquare = this.getTransposed(toSquare, DELTA);
            }
            if (toSquare.isOnBoard && toSquare.piece!.color !== fromSquare.piece!.color){
                moves.push(toSquare);
            }
        }
        return moves;
    }

    public getPawnMoves(fromSquare: OnBoardSquare){
        let moves: OnBoardSquare[] = [];

        const [STARTING_RANK, FORWARD_DIRECTION, CAPTURE_DIRECTIONS] = 
            fromSquare.piece!.color === Colors.WHITE
                ? [Ranks.TWO, PAWN_WHITE_FORWARD_DELTA, PAWN_WHITE_CAPTURE_DELTAS]
                : [Ranks.SEVEN, PAWN_BLACK_FORWARD_DELTA, PAWN_BLACK_CAPTURE_DELTAS];

        let forwardSquare = this.getTransposed(fromSquare, FORWARD_DIRECTION) as OnBoardSquare; /* Guaranteed to be OnBoardSquare in this case */
        if (forwardSquare.piece === null){
            moves.push(forwardSquare);
        }

        let forward2Square = this.getTransposed(forwardSquare, FORWARD_DIRECTION);
        if (fromSquare.rank === STARTING_RANK && forwardSquare.piece === null && (forward2Square as OnBoardSquare).piece === null){
            moves.push(forward2Square as OnBoardSquare);
        }

        for (const CAPTURE_DIRECTION of CAPTURE_DIRECTIONS){
            let captureSquare = this.getTransposed(fromSquare, CAPTURE_DIRECTION);
            if (captureSquare.isOnBoard && captureSquare.piece !== null && captureSquare.piece.color !== fromSquare.piece!.color){
                moves.push(captureSquare);
            }
            else if (captureSquare === this.enPassantSquare){
                moves.push(captureSquare);
            }
        }

        return moves;
    }

    private canCastle(kingSquare: OnBoardSquare, rookSquare: OnBoardSquare | null): boolean{
        if (kingSquare.piece!.hasMoved || rookSquare === null || rookSquare.piece!.hasMoved){
            return false;
        }

        let castlingRank = this.colorToMove === Colors.WHITE ? Ranks.ONE : Ranks.EIGHT;
        if (kingSquare.rank !== castlingRank || rookSquare.rank !== castlingRank){
            return false;
        }

        let kingDestinationFile = kingSquare.file < rookSquare.file ? Files.G : Files.C;
        let kingScanFile = kingSquare.file === kingDestinationFile || (kingSquare.file < kingDestinationFile === kingDestinationFile < rookSquare.file) ? rookSquare.file : kingDestinationFile;

        let KING_DELTA: BoardDelta = {
            rank: 0,
            file: Math.sign(kingScanFile - kingSquare.file)
        };

        const KING_PIECE = kingSquare.piece;
        const ROOK_PIECE = rookSquare.piece;
        kingSquare.piece = null;    /* Remove king and rook temporarily so that rook does not trigger false negative. */
        rookSquare.piece = null;

        let prevFile: Files = kingSquare.file;
        let currSquare = this.getTransposed(kingSquare, KING_DELTA) as OnBoardSquare;
        while (prevFile !== kingScanFile && currSquare.piece === null){
            prevFile = currSquare.file;
            currSquare = this.getTransposed(currSquare, KING_DELTA) as OnBoardSquare;    /* Trust me: This will not go off board! */
        }

        let rookDestinationFile = kingSquare.file < rookSquare.file ? Files.F : Files.D;
        let canCastle = prevFile === kingScanFile && this.getSquare(kingSquare.rank, rookDestinationFile).piece === null;    /* Make sure rook destination square is empty */

        kingSquare.piece = KING_PIECE;   /* Restore the pieces */
        rookSquare.piece = ROOK_PIECE;

        return canCastle;
    }

    public getKingMoves(fromSquare: OnBoardSquare){
        let moves = this.getLeapingMoves(fromSquare, KING_DELTAS);
        
        let castlingSquares = this.castlingSquares[fromSquare.piece!.color];
        if (this.canCastle(fromSquare, castlingSquares.kingsideRook)){
            moves.push(castlingSquares.kingsideRook as OnBoardSquare);
        }
        if (this.canCastle(fromSquare, castlingSquares.queensideRook)){
            moves.push(castlingSquares.queensideRook as OnBoardSquare);
        }

        return moves;
    }

    public getPseudoLegalMoves(rank: Ranks, file: Files): OnBoardSquare[]{
        let square = this.getSquare(rank, file);
        if (square.piece === null || square.piece.color !== this.colorToMove){
            return [];
        }

        switch (square.piece.type){
            case PieceTypes.PAWN:
                return this.getPawnMoves(square);
            case PieceTypes.KNIGHT:
                return this.getLeapingMoves(square, KNIGHT_DELTAS);
            case PieceTypes.BISHOP:
                return this.getSlidingMoves(square, BISHOP_DELTAS);
            case PieceTypes.ROOK:
                return this.getSlidingMoves(square, ROOK_DELTAS);
            case PieceTypes.QUEEN:
                return this.getSlidingMoves(square, QUEEN_DELTAS);
            case PieceTypes.KING:
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

export {BackEnd}