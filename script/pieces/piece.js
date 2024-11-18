/* Class exhibits abstract behavior by throwing error if instantiated. */
class Piece{
    static Type = Object.freeze({
        KING: Symbol("KING"),
        QUEEN: Symbol("QUEEN"),
        ROOK: Symbol("ROOK"),
        BISHOP: Symbol("BISHOP"),
        KNIGHT: Symbol("KNIGHT"),
        PAWN: Symbol("PAWN")
    });
    static Color = Object.freeze({
        WHITE: Symbol("WHITE"),
        BLACK: Symbol("BLACK")
    });

    constructor(){
        throw new Error("Cannot instantiate Piece");
    }
}