import Piece from "./piece.js";

class Bishop extends Piece{
    constructor(color){
        super(Piece.Type.BISHOP, color);
    }

    getCaptureDirections(){
        return [];
    }
}

export default Bishop;