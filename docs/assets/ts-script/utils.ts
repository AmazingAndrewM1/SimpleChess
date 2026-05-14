enum Files{
    A = 1,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    NONE
}

enum Ranks{
    ONE = 1,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NONE
}

enum Colors{
    WHITE,
    BLACK,
    NONE
}

enum PieceType{
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING,
    NONE
}

interface Piece{
    type: PieceType,
    color: Colors
}

interface OnBoardSquare{
    isOnBoard: true,
    piece: Piece,
    file: Files,
    rank: Ranks
}

interface OffBoardSquare{
    isOnBoard: false
}

type Square = OnBoardSquare | OffBoardSquare

const OFF_BOARD_SQUARE: OffBoardSquare = {isOnBoard: false};

export {Files, Ranks, Piece, OnBoardSquare, OFF_BOARD_SQUARE, Square};