const OFF_BOARD_SQUARE = { isOnBoard: false };
function createPiece(type, color) {
    return {
        type: type,
        color: color,
        hasMoved: false
    };
}
export { OFF_BOARD_SQUARE, createPiece };
