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
    BLACK
}

enum PieceType{
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING
}

interface Piece{
    type: PieceType,
    color: Colors
}

interface OnBoardSquare{
    readonly isOnBoard: true,
    piece: Piece | null,
    rank: Ranks,
    file: Files,
}

interface OffBoardSquare{
    readonly isOnBoard: false
}

type Square = OnBoardSquare | OffBoardSquare

const OFF_BOARD_SQUARE: OffBoardSquare = {isOnBoard: false};

export {Files, Ranks, PieceType, Colors, Piece, OnBoardSquare, OFF_BOARD_SQUARE, Square};