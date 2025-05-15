import Piece, {BACK_END} from "./piece.js";
import {Files} from "../utils.js";

class King extends Piece{
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
        let moves = [];

        for (const DIRECTION of King.getCaptureDirections()){
            let square = BACK_END.getTransposed(from, DIRECTION);
            if (square !== null && (square.getPiece() === null || square.getPiece().color !== this.color)){
                moves.push(square);
            }
        }

        if (this.canCastleKingside(from)){
            console.log("YOU CAN CASTLE KINGSIDE");
        }
        if (this.canCastleQueenside(from)){
            console.log("YOU CAN CASTLE QUEENSIDE");
        }

        return moves;
    }

    canCastleKingside(kingSquare){
        return this.canCastle(kingSquare, Files.G, Files.F);
    }

    canCastleQueenside(kingSquare){
        return this.canCastle(kingSquare, Files.C, Files.D);
    }

    canCastle(kingSquare, kingDestinationFile, rookDestinationFile){
        if (this.hasMoved){
            return false;
        }

        // First, locate the castling rook.
        const ROOK_DIRECTION = {dx: Math.sign(kingDestinationFile - rookDestinationFile), dy: 0};
        let rookSquare = BACK_END.getTransposed(kingSquare, ROOK_DIRECTION);
        while (rookSquare !== null && rookSquare.getPiece() === null){
            rookSquare = BACK_END.getTransposed(rookSquare, ROOK_DIRECTION);
        }
        if (rookSquare === null){
            return false;
        }
        let rook = rookSquare.getPiece();
        if (rook.hasMoved || 
            rook.color !== this.color || 
            rook.type !== Piece.Type.ROOK){
            return false;
        }

        // Second, determine if path is clear for king and rook
        kingSquare.setPiece(null);
        rookSquare.setPiece(null);
        let isKingPathClear = kingSquare.file === kingDestinationFile ||
                              rookSquare.file === kingDestinationFile ||
                              kingSquare.file < kingDestinationFile === kingDestinationFile < rookSquare.file;
        if (!isKingPathClear){
            const SCAN_DIRECTION = {dx: Math.sign(kingDestinationFile - kingSquare.file), dy: 0};
            let startSquare = Math.abs(kingDestinationFile - kingSquare.file) < Math.abs(kingDestinationFile - rookSquare.file) ? kingSquare : rookSquare;
            let square = BACK_END.getTransposed(startSquare, SCAN_DIRECTION);
            while (!isKingPathClear && square.getPiece() === null){
                isKingPathClear = square.file === Files.G;
                square = BACK_END.getTransposed(square, SCAN_DIRECTION);
            }
        }
        let isRookPathClear = BACK_END.getSquare(kingSquare.rank, rookDestinationFile).getPiece() === null;
        kingSquare.setPiece(this);
        rookSquare.setPiece(rook);
        return isKingPathClear && isRookPathClear;
    }
}

export default King;