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
    static spriteWidth;
    static spriteHeight;

    static {
        let spriteSheet = new Image();
        spriteSheet.src = "/images/ChessMenSpriteSheet.png";
        Piece.spriteWidth = spriteSheet.width / Object.keys(Piece.Type).length;
        Piece.spriteHeight = spriteSheet.height / Object.keys(Piece.Color).length;
    }

    constructor(){
        throw new Error("Cannot instantiate Piece");
    }
}