const enum Files{
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

const enum Ranks{
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

const enum Colors{
    WHITE,
    BLACK
}

const enum PieceTypes{
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING
}

interface Piece{
    type: PieceTypes,
    color: Colors,
    hasMoved: boolean
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

export {Files, Ranks, PieceTypes, Colors, Piece, OnBoardSquare, OFF_BOARD_SQUARE, Square};