import {Piece, LeapingPiece} from "./piece-module.js";
import {BACK_END, Square} from "../front-back.js";
import {Files} from "../utils.js";

class King extends LeapingPiece{
    constructor(color){
        super(Piece.Type.KING, color);
    }

    static getCaptureDirections(){
        return [
            {dx: 0, dy: 1},
            {dx: 1, dy: 1},
            {dx: 1, dy: 0},
            {dx: 1, dy: -1},
            {dx: 0, dy: -1},
            {dx: -1, dy: -1},
            {dx: -1, dy: 0},
            {dx: -1, dy: 1}
        ];
    }

    getPseudoLegalMoves(from){
        let moves = super.getPseudoLegalMoves(from);

        let kingsideRookSquare = this.getKingsideRookSquare(from);
        if (kingsideRookSquare !== Square.NONE){
            moves.push(kingsideRookSquare);
        }

        let queensideRookSquare = this.getQueensideRookSquare(from);
        if (queensideRookSquare !== Square.NONE){
            moves.push(queensideRookSquare);
        }

        return moves;
    }

    getKingsideRookSquare(kingSquare){
        return this.getRookSquare(kingSquare, Files.G, Files.F);
    }

    getQueensideRookSquare(kingSquare){
        return this.getRookSquare(kingSquare, Files.C, Files.D);
    }

    findRookSquare(kingSquare, kingDestinationFile, rookDestinationFile){
        const ROOK_DIRECTION = {dx: Math.sign(kingDestinationFile - rookDestinationFile), dy: 0};
        let rookSquare = BACK_END.getTransposed(kingSquare, ROOK_DIRECTION);
        while (rookSquare !== Square.NONE && rookSquare.piece === Piece.NONE){
            rookSquare = BACK_END.getTransposed(rookSquare, ROOK_DIRECTION);
        }
        if (rookSquare === Square.NONE){
            return Square.NONE;
        }
        let maybeRook = rookSquare.piece;
        return maybeRook.hasMoved === false && maybeRook.color === this.color && maybeRook.type === Piece.Type.ROOK ? 
                rookSquare:
                Square.NONE;
    }

    isKingPathClear(kingSquare, rookSquare, kingDestinationFile){
        if (kingSquare.file === kingDestinationFile ||
            rookSquare.file === kingDestinationFile ||
            kingSquare.file < kingDestinationFile === kingDestinationFile < rookSquare.file){
            return true;
        }

        const SCAN_DIRECTION = {dx: Math.sign(kingDestinationFile - kingSquare.file), dy: 0};
        let startSquare = Math.abs(kingDestinationFile - kingSquare.file) < Math.abs(kingDestinationFile - rookSquare.file) ? kingSquare : rookSquare;
        let square = BACK_END.getTransposed(startSquare, SCAN_DIRECTION);
        while (square.file !== kingDestinationFile && square.piece === Piece.NONE){
            square = BACK_END.getTransposed(square, SCAN_DIRECTION);
        }
        return square.file === kingDestinationFile;
    }

    getRookSquare(kingSquare, kingDestinationFile, rookDestinationFile){
        if (this.hasMoved){
            return Square.NONE;
        }

        let rookSquare = this.findRookSquare(kingSquare, kingDestinationFile, rookDestinationFile);
        if (rookSquare === Square.NONE){
            return Square.NONE;
        }

        if (!this.isKingPathClear(kingSquare, rookSquare, kingDestinationFile)){
            return Square.NONE;
        }

        let rookDestinationPiece = BACK_END.getSquare(kingSquare.rank, rookDestinationFile).piece;
        return rookDestinationPiece === Piece.NONE || rookDestinationPiece === this || rookDestinationPiece === rookSquare.piece ?
                rookSquare : 
                Square.NONE;
    }
}

export default King;