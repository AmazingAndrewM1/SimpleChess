import Piece from "./piece.js";

class King extends Piece{
    constructor(color){
        super(Piece.Type.KING, color);
    }
}

export default King;