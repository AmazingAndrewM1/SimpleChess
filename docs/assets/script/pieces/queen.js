import Piece from "./piece.js";

class Queen extends Piece{
    constructor(color){
        super(Piece.Type.QUEEN, color);
    }
}

export default Queen;