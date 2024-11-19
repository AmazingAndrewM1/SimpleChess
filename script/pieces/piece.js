class Piece{
    static Type = Object.freeze({
        KING: 0,
        QUEEN: 1,
        ROOK: 2,
        BISHOP: 3,
        KNIGHT: 4,
        PAWN: 5
    });
    static Color = Object.freeze({
        WHITE: 0,
        BLACK: 1
    });

    constructor(type, color){
        this.hasMoved = false;
        this.color = color;
        this.type = type;
    }

    hasMoved(){
        return this.hasMoved;
    }

    getType(){
        return this.type;
    }

    getColor(){
        return this.color;
    }

    getTypeToString(){
        switch (this.type){
            case Piece.Type.KING:
                return "king";
            case Piece.Type.QUEEN:
                return "queen";
            case Piece.Type.ROOK:
                return "rook";
            case Piece.Type.BISHOP:
                return "bishop";
            case Piece.Type.KNIGHT:
                return "knight";
            case Piece.Type.PAWN:
                return "pawn";
            default:
                throw new Error("This piece type is not accounted for ...");
        }
    }

    getColorToString(){
        switch (this.color){
            case Piece.Color.WHITE:
                return "white";
            case Piece.Color.BLACK:
                return "black";
            default:
                throw new Error("Color not accounted for...");
        }
    }
}

export default Piece;