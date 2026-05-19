type BoardDelta = {
    rank: number,
    file: number
};

const KNIGHT_DELTAS = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2]
]

const BISHOP_DELTAS = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1]
]

const ROOK_DELTAS = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1]
]

const QUEEN_DELTAS = [
    ...BISHOP_DELTAS,
    ...ROOK_DELTAS
]

const KING_DELTAS = QUEEN_DELTAS;