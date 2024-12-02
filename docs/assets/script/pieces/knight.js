import Piece from "./piece.js";

export class Knight extends Piece{
    constructor(color){
        super(Piece.Type.KNIGHT, color);
    }

    getCaptureDirections(){
        return [];
    }
}

export default Knight;