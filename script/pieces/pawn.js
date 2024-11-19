import Piece from "./piece.js";

class Pawn extends Piece{
    constructor(color){
        super(Piece.Type.PAWN, color);
    }
}

export default Pawn;