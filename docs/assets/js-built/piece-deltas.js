function toBoardDeltas(directions) {
    return directions.map(([rankDelta, fileDelta]) => {
        let result = {
            rank: rankDelta,
            file: fileDelta
        };
        return result;
    });
}
const PAWN_WHITE_CAPTURE_DIRECTIONS = [
    [1, 1],
    [1, -1]
];
const PAWN_BLACK_CAPTURE_DIRECTIONS = [
    [-1, 1],
    [-1, -1]
];
const PAWN_WHITE_FORWARD_DIRECTIONS = [
    [1, 0]
];
const PAWN_BLACK_FORWARD_DIRECTIONS = [
    [-1, 0]
];
const KNIGHT_DIRECTIONS = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2]
];
const BISHOP_DIRECTIONS = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1]
];
const ROOK_DIRECTIONS = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1]
];
const QUEEN_DIRECTIONS = [
    ...BISHOP_DIRECTIONS,
    ...ROOK_DIRECTIONS
];
const KING_DIRECTIONS = QUEEN_DIRECTIONS;
const PAWN_WHITE_CAPTURE_DELTAS = toBoardDeltas(PAWN_WHITE_CAPTURE_DIRECTIONS);
const PAWN_BLACK_CAPTURE_DELTAS = toBoardDeltas(PAWN_BLACK_CAPTURE_DIRECTIONS);
const PAWN_WHITE_FORWARD_DELTA = toBoardDeltas(PAWN_WHITE_FORWARD_DIRECTIONS)[0];
const PAWN_BLACK_FORWARD_DELTA = toBoardDeltas(PAWN_BLACK_FORWARD_DIRECTIONS)[0];
const KNIGHT_DELTAS = toBoardDeltas(KNIGHT_DIRECTIONS);
const BISHOP_DELTAS = toBoardDeltas(BISHOP_DIRECTIONS);
const ROOK_DELTAS = toBoardDeltas(ROOK_DIRECTIONS);
const QUEEN_DELTAS = toBoardDeltas(QUEEN_DIRECTIONS);
const KING_DELTAS = toBoardDeltas(KING_DIRECTIONS);
export { PAWN_WHITE_CAPTURE_DELTAS, PAWN_BLACK_CAPTURE_DELTAS, PAWN_WHITE_FORWARD_DELTA, PAWN_BLACK_FORWARD_DELTA, KNIGHT_DELTAS, BISHOP_DELTAS, ROOK_DELTAS, QUEEN_DELTAS, KING_DELTAS };
