import {Ranks, Files, PieceTypes, Colors, Piece, OnBoardSquare, OFF_BOARD_SQUARE, Square} from "./utils";

interface BackEnd{
    board: Square[],
    colorToMove: Colors
    enPassantSquare: OnBoardSquare | null
}

type BoardDelta = {
    rank: number,
    file: number
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
    console.log(square, delta, resultSquare);

    return resultSquare;
}

function getPawnMoves(fromSquare: OnBoardSquare){
    let deltaRank;
    switch (fromSquare.piece!.color){
        case Colors.WHITE:
            deltaRank = 1;
            break;
        case Colors.BLACK:
            deltaRank = -1;
            break;
    }

    let forwardDirection: BoardDelta = {
        rank: deltaRank,
        file: 0
    }
    let moves: Array<OnBoardSquare> = [];

    let forwardSquare = getTransposed(fromSquare, forwardDirection) as OnBoardSquare; /* Guaranteed to be OnBoardSquare in this case */
    if (forwardSquare.piece === null){
        moves.push(forwardSquare);
    }

    let forward2Square = getTransposed(forwardSquare, forwardDirection);
    if (fromSquare.piece!.hasMoved === false && forwardSquare.piece === null && (forward2Square as OnBoardSquare).piece === null){
        moves.push(forward2Square as OnBoardSquare);
    }

    for (let deltaFile of [-1, +1]){
        let captureDirection: BoardDelta = {
            rank: deltaRank,
            file: deltaFile
        }
        let captureSquare = getTransposed(fromSquare, captureDirection);
        if (captureSquare.isOnBoard && captureSquare.piece !== null && captureSquare.piece.color !== fromSquare.piece!.color){
            moves.push(captureSquare);
        }
        else if (captureSquare === getBackEnd().enPassantSquare){
            moves.push(captureSquare);
        }
    }

    return moves;
}

function getKnightMoves(fromSquare: OnBoardSquare){
    let knightDeltas = [
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
        [-1, 2]
    ]

    let moves = [];
    for (const [fileDelta, rankDelta] of knightDeltas){
        let direction: BoardDelta = {
            rank: rankDelta,
            file: fileDelta
        };

        let destinationSquare = getTransposed(fromSquare, direction);
        if (destinationSquare.isOnBoard && (destinationSquare.piece === null || destinationSquare.piece.color !== fromSquare.piece!.color)){
            moves.push(destinationSquare);
        }
    }
    return moves;
}

function getBishopMoves(fromSquare: OnBoardSquare){
    let bishopDeltas = [
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1]
    ]

    let moves: OnBoardSquare[] = [];
    for (const [fileDelta, rankDelta] of bishopDeltas){
        let direction: BoardDelta = {
            rank: rankDelta,
            file: fileDelta
        }

        let toSquare = getTransposed(fromSquare, direction);
        while (toSquare.isOnBoard && toSquare.piece === null){
            moves.push(toSquare);
            toSquare = getTransposed(toSquare, direction);
        }
        if (toSquare.isOnBoard && toSquare.piece!.color !== fromSquare.piece!.color){
            moves.push(toSquare);   
        }
    }
    return moves;
}

function getLegalMoves(rank: Ranks, file: Files): Array<OnBoardSquare>{
    let square = getSquare(rank, file);
    if (square.piece === null || square.piece.color !== getColorToMove()){
        return [];
    }

    switch (square.piece.type){
        case PieceTypes.PAWN:
            return getPawnMoves(square);
        case PieceTypes.KNIGHT:
            return getKnightMoves(square);
        case PieceTypes.BISHOP:
            return getBishopMoves(square);
        default:
            return [];
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

    backEnd = {
        board: board,
        colorToMove: Colors.WHITE,
        enPassantSquare: null
    }

    let numFiles = 8;

    // Ensure bishops are on opposite colors
    let bishopFile1 = 2 * Math.floor(numFiles / 2 * Math.random()) + 1;
    let bishopFile2 = 2 * Math.floor(numFiles / 2 * Math.random()) + 2;

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

// class BackEnd{
//     #numRows = 12;
//     #numColumns = 10;
//     #squareSnapshots = [];

//     constructor(){
//         this.board = new Array(this.#numRows * this.#numColumns);
//         this.board.fill(Square.NONE);

//         this.pieceSquares = [new Set(), new Set()];

//         for (let rank = Ranks.ONE; rank <= Ranks.EIGHT; ++rank){
//             for (let file = Files.A; file <= Files.H; ++file){
//                 this.board[this.getIndex(rank, file)] = new Square(rank, file);
//             }
//         }

//         let fileOptions = Object.values(Files).filter(
//             (file, _) => file !== Files.NONE
//         );

//         let bishopFile1 = fileOptions[2 * Math.floor(fileOptions.length / 2 * Math.random())];
//         let bishopFile2 = fileOptions[2 * Math.floor(fileOptions.length / 2 * Math.random()) + 1];
//         let bishopSquare1 = this.getSquare(Ranks.ONE, bishopFile1);
//         let bishopSquare2 = this.getSquare(Ranks.ONE, bishopFile2);

//         bishopSquare1.piece = new Bishop(Piece.Color.WHITE);
//         bishopSquare2.piece = new Bishop(Piece.Color.WHITE);

//         fileOptions = fileOptions.filter(
//             (file, _) => file !== bishopFile1 &&
//                          file !== bishopFile2
//         );

//         // Shuffle with Fisher-Yates algorithm
//         for (let i = 0; i < fileOptions.length - 1; ++i){
//             let swapIndex = Math.floor(Math.random() * (fileOptions.length - i)) + i;
//             let temp = fileOptions[i];
//             fileOptions[i] = fileOptions[swapIndex];
//             fileOptions[swapIndex] = temp;
//         }

//         let queenSquare = this.getSquare(Ranks.ONE, fileOptions[0]);
//         let knightSquare1 = this.getSquare(Ranks.ONE, fileOptions[1]);
//         let knightSquare2 = this.getSquare(Ranks.ONE, fileOptions[2]);

//         queenSquare.piece = new Queen(Piece.Color.WHITE);
//         knightSquare1.piece = new Knight(Piece.Color.WHITE);
//         knightSquare2.piece = new Knight(Piece.Color.WHITE);

//         // Guess king and rook placement and modify, if necessary.
//         let kingFile = fileOptions[3];
//         let rookFile1 = fileOptions[4];
//         let rookFile2 = fileOptions[5];
//         if (kingFile < rookFile1 === rookFile1 < rookFile2){
//             let temp = kingFile;
//             kingFile = rookFile1;
//             rookFile1 = temp;
//         }
//         else if (kingFile < rookFile2 === rookFile2 < rookFile1){
//             let temp = kingFile;
//             kingFile = rookFile2;
//             rookFile2 = temp;
//         }

//         this.whiteKingSquare = this.getSquare(Ranks.ONE, kingFile);
//         this.blackKingSquare = this.getSquare(Ranks.EIGHT, kingFile);
//         let rookSquare1 = this.getSquare(Ranks.ONE, rookFile1);
//         let rookSquare2 = this.getSquare(Ranks.ONE, rookFile2);

//         this.whiteKingSquare.piece = new King(Piece.Color.WHITE);
//         rookSquare1.piece = new Rook(Piece.Color.WHITE);
//         rookSquare2.piece = new Rook(Piece.Color.WHITE);

//         for (let file = Files.A; file <= Files.H; ++file){
//             let rank1Square = this.getSquare(Ranks.ONE, file);
//             let rank2Square = this.getSquare(Ranks.TWO, file);
//             let rank7Square = this.getSquare(Ranks.SEVEN, file);
//             let rank8Square = this.getSquare(Ranks.EIGHT, file);

//             rank2Square.piece = new Pawn(Piece.Color.WHITE);
//             rank7Square.piece = new Pawn(Piece.Color.BLACK);
//             rank8Square.piece = new rank1Square.piece.constructor(Piece.Color.BLACK);

//             this.pieceSquares[Piece.Color.WHITE].add(rank1Square);
//             this.pieceSquares[Piece.Color.WHITE].add(rank2Square);
//             this.pieceSquares[Piece.Color.BLACK].add(rank7Square);
//             this.pieceSquares[Piece.Color.BLACK].add(rank8Square);
//         }

//         this.colorKingSquare = this.whiteKingSquare;
//         this.possibleSquares = [];
//         this.colorToMove = Piece.Color.WHITE;
//         this.fromSquare = Square.NONE;
//         this.toSquare = Square.NONE;
//         this.enPassantSquare = Square.NONE;
//         this.captureSquareSnapshot = Square.NONE;
//         this.isValid = false;
//     }

//     printDebug(){
//         let output = new String();
//         for (let r = 0; r < this.#numRows; ++r){
//             for (let c = 0; c < this.#numColumns; ++c){
//                 let square = this.board[r * this.#numColumns + c];
//                 if (square === Square.NONE){
//                     output += "- ";
//                 }
//                 else if (square.piece === Piece.NONE){
//                     output += ". ";
//                 }
//                 else{
//                     output += Piece.getChar(square.piece) + " ";
//                 }
//             }
//             output += "\n";
//         }
//         console.log(output);
//     }

//     getIndex(rank, file){
//         const OFFSET = 21;
//         let r = rank - Ranks.ONE;
//         let c = file - Files.A;
//         return r * this.#numColumns + c + OFFSET;
//     }

//     findSquare(piece){
//         if (piece.constructor === King){
//             return piece.color === Piece.Color.WHITE ? this.whiteKingSquare : this.blackKingSquare;
//         }

//         for (const SQUARE of this.pieceSquares[piece.color].values()){
//             if (SQUARE.piece === piece){
//                 return SQUARE;
//             }
//         }

//         throw Error("piece not found");
//     }

//     getSquare(rank, file){
//         return this.board[this.getIndex(rank, file)];
//     }

//     /**
//      * @param {Square} square - the current square
//      * @param {Object} direction - the direction to perform the transformation
//      * @param {number} direction.dx - direction in change of file
//      * @param {number} direction.dy - direction in change of rank
//      * @returns {Square} the square after the transformation and null if the corresponding square would not exist on the standard 8x8 chessboard.
//      */
//     getTransposed(square, direction){
//         return this.getSquare(square.rank + direction.dy, square.file + direction.dx);
//     }

//     hasLegalMoves(){
//         for (const SQUARE of this.pieceSquares[this.colorToMove]){
//             this.fromSquare = SQUARE;
//             for (const DESTINATION_SQUARE of SQUARE.piece.getPseudoLegalMoves()){
//                 if (this.isLegalMove(DESTINATION_SQUARE)){
//                     return true;
//                 }
//             }
//         }

//         return false;
//     }

//     isLegalMove(destinationSquare){
//         this.toSquare = destinationSquare;

//         if (this.fromSquare.piece.color === this.toSquare.piece.color){
//             let kingDestinationFile = this.toSquare.file > this.fromSquare.file ? Files.G : Files.C;
//             let direction = {dx: Math.sign(kingDestinationFile - this.fromSquare.file), dy: 0};
//             let square = this.fromSquare;
//             let prevFile = Files.NONE;
//             while (prevFile !== kingDestinationFile){
//                 if (this.isAttacked(square)){
//                     return false;
//                 }
//                 prevFile = square.file;
//                 square = this.getTransposed(square, direction);
//             }
//         }

//         // It is still possible for castling not to be permissible despite the previous checks, so testing with a temporary move is still required.
//         this.doTemporaryMove();
//         let wasAttacked = this.isAttacked(this.colorKingSquare);
//         this.undoMove();
//         return !wasAttacked;
//     }

//     /* The square specified by row and column should have a piece on that square, so null check should not be necessary. */
//     setFromSquare(rank, file){
//         this.fromSquare = this.getSquare(rank, file);
//         this.possibleSquares = [];
//         if (this.fromSquare.piece.color !== this.colorToMove){
//             return;
//         }
        
//         for (const DESTINATION_SQUARE of this.fromSquare.piece.getPseudoLegalMoves()){
//             if (this.isLegalMove(DESTINATION_SQUARE)){
//                 this.possibleSquares.push(DESTINATION_SQUARE);
//             }
//         }
//     }

//     setToSquare(rank, file){
//         this.toSquare = this.getSquare(rank, file);
//         this.isValid = this.possibleSquares.includes(this.toSquare);
//     }

//     getMoves(){
//         return this.possibleSquares;
//     }

//     get squareSnapshots(){
//         return this.#squareSnapshots;
//     }

//     isAttacked(targetSquare){
//         for (const PIECE_TYPE of [Pawn, Knight]){
//             for (const DIRECTION of PIECE_TYPE.getCaptureDirections(this.colorToMove)){
//                 let maybeEnemyPiece = this.getTransposed(targetSquare, DIRECTION).piece;
//                 if (maybeEnemyPiece.constructor === PIECE_TYPE && maybeEnemyPiece.color !== this.colorToMove){
//                     return true;
//                 }
//             }
//         }

//         for (const PIECE_TYPE of [Bishop, Rook]){
//             for (const DIRECTION of PIECE_TYPE.getCaptureDirections()){
//                 let square = this.getTransposed(targetSquare, DIRECTION);
//                 if (square.piece.constructor === King && square.piece.color !== this.colorToMove){
//                     return true;
//                 }
//                 while (square !== Square.NONE && square.piece === Piece.NONE){
//                     square = this.getTransposed(square, DIRECTION);
//                 }
//                 let maybeEnemyPiece = square.piece;
//                 if ((maybeEnemyPiece.constructor === PIECE_TYPE || maybeEnemyPiece.constructor === Queen) && maybeEnemyPiece.color !== this.colorToMove){
//                     return true;
//                 }
//             }
//         }

//         return false;
//     }

//     updateBoard(){
//         this.enPassantSquare = Square.NONE;
//         if (this.toSquare.piece.constructor === Pawn){
//             let forwardDirection = {dx: 0, dy: Pawn.getCaptureDirections(this.toSquare.piece.color)[0].dy};
//             if (this.getTransposed(this.toSquare, forwardDirection) === Square.NONE){
//                 this.toSquare.piece = new Queen(this.toSquare.piece.color);
//             }
//             else if (this.toSquare.file === this.fromSquare.file && this.toSquare !== this.getTransposed(this.fromSquare, forwardDirection)){
//                 this.enPassantSquare = this.getTransposed(this.fromSquare, forwardDirection);
//             }
//         }

//         for (const SQUARE_SNAPSHOTS of this.#squareSnapshots){
//             let square = SQUARE_SNAPSHOTS.square;
//             if (square.piece === Piece.NONE){
//                 this.pieceSquares[this.colorToMove].delete(square);
//             }
//             else{
//                 this.pieceSquares[this.colorToMove].add(square);
//             }
//         }

//         if (this.captureSquareSnapshot !== SquareSnapshot.NONE){
//             this.pieceSquares[this.captureSquareSnapshot.prevPiece.color].delete(this.captureSquareSnapshot.square);
//             this.captureSquareSnapshot = SquareSnapshot.NONE;
//         }

//         this.toSquare.piece.updateState();

//         if (this.colorToMove === Piece.Color.WHITE){
//             this.whiteKingSquare = this.colorKingSquare;
//             this.colorToMove = Piece.Color.BLACK;
//             this.colorKingSquare = this.blackKingSquare;
//         }
//         else{
//             this.blackKingSquare = this.colorKingSquare;
//             this.colorToMove = Piece.Color.WHITE;
//             this.colorKingSquare = this.whiteKingSquare;
//         }

//         // let isCheck = this.isAttacked(this.colorKingSquare);
//         // let hasLegalMoves = this.hasLegalMoves();

//         this.fromSquare = Square.NONE;
//         this.toSquare = Square.NONE;
//         this.isValid = false;
//     }

//     doTemporaryMove(){
//         this.#squareSnapshots = [];

//         if (this.fromSquare.piece.color === this.toSquare.piece.color){
//             this.captureSquareSnapshot = SquareSnapshot.NONE;
//             let castlingKing = this.fromSquare.piece;
//             let castlingRook = this.toSquare.piece;

//             let kingDestinationFile = this.toSquare.file > this.fromSquare.file ? Files.G : Files.C;
//             let rookDestinationFile = this.toSquare.file > this.fromSquare.file ? Files.F : Files.D;

//             this.#squareSnapshots.push(new SquareSnapshot(this.fromSquare));
//             this.#squareSnapshots.push(new SquareSnapshot(this.toSquare));
//             this.fromSquare.piece = Piece.NONE;
//             this.toSquare.piece = Piece.NONE;

//             let kingDestinationSquare = this.getSquare(this.fromSquare.rank, kingDestinationFile);
//             let rookDestinationSquare = this.getSquare(this.toSquare.rank, rookDestinationFile);
//             this.#squareSnapshots.push(new SquareSnapshot(kingDestinationSquare));
//             this.#squareSnapshots.push(new SquareSnapshot(rookDestinationSquare));
//             kingDestinationSquare.piece = castlingKing;
//             rookDestinationSquare.piece = castlingRook;

//             this.colorKingSquare = kingDestinationSquare;

//             return;
//         }

//         if (this.fromSquare.piece.constructor === Pawn && this.toSquare === this.enPassantSquare){
//             let captureSquare = this.getSquare(this.fromSquare.rank, this.toSquare.file);
//             this.captureSquareSnapshot = new SquareSnapshot(captureSquare);
//             this.#squareSnapshots.push(this.captureSquareSnapshot);
//             captureSquare.piece = Piece.NONE;
//         }
//         else if (this.toSquare.piece !== Piece.NONE){
//             this.captureSquareSnapshot = new SquareSnapshot(this.toSquare);
//         }
//         else{
//             this.captureSquareSnapshot = SquareSnapshot.NONE;
//         }

//         this.#squareSnapshots.push(new SquareSnapshot(this.fromSquare));
//         this.#squareSnapshots.push(new SquareSnapshot(this.toSquare));

//         this.toSquare.piece = this.fromSquare.piece;
//         this.fromSquare.piece = Piece.NONE;

//         if (this.colorKingSquare.piece.constructor !== King){
//             this.colorKingSquare = this.toSquare;
//         }
//     }

//     executeMove(){
//         this.doTemporaryMove();
//         this.updateBoard();
//     }

//     undoMove(){
//         while (this.#squareSnapshots.length > 0){
//             let squareSnapshot = this.#squareSnapshots.pop();
//             squareSnapshot.square.piece = squareSnapshot.prevPiece;
//             if (squareSnapshot.square.piece.constructor === King){
//                 this.colorKingSquare = squareSnapshot.square;
//             }
//         }
//     }

//     getState(){
//         let isCheck = this.isAttacked(this.colorKingSquare);
//         let hasLegalMoves = this.hasLegalMoves();

//         if (isCheck && hasLegalMoves){
//             return "Check";
//         }
//         else if (isCheck && !hasLegalMoves){
//             return "Checkmate";
//         }
//         else if (!hasLegalMoves){
//             return "Stalemate";
//         }
//         else{
//             return "Normal";
//         }
//     }
// }

export {initialize, getSquare, getColorToMove, getPiece, isPiecePresent, getLegalMoves}