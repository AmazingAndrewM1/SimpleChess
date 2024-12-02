import Piece from "./piece.js";

export class Rook extends Piece{
    constructor(color){
        super(Piece.Type.ROOK, color);
    }

    getCaptureDirections(){
        return [];
    }
}

export default Rook;