class Piece{
    static Type = Object.freeze({
        KING: 0,
        QUEEN: 1,
        ROOK: 2,
        BISHOP: 3,
        KNIGHT: 4,
        PAWN: 5,
        getString: function(type){
            switch (type){
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
                    throw new Error("Type not in list");
            }
        }
    });
    static Color = Object.freeze({
        WHITE: 0,
        BLACK: 1,
        getString: function(color){
            switch (color){
                case Piece.Color.WHITE:
                    return "white";
                case Piece.Color.BLACK:
                    return "black";
                default:
                    throw new Error("Color not in list");
            }
        }
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
}

export default Piece;