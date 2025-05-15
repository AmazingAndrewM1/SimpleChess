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

    findRookSquare(kingSquare, kingDestinationFile, rookDestinationFile){
        const ROOK_DIRECTION = {dx: Math.sign(kingDestinationFile - rookDestinationFile), dy: 0};
        let rookSquare = BACK_END.getTransposed(kingSquare, ROOK_DIRECTION);
        while (rookSquare !== null && rookSquare.getPiece() === null){
            rookSquare = BACK_END.getTransposed(rookSquare, ROOK_DIRECTION);
        }
        if (rookSquare === null){
            return null;
        }
        let maybeRook = rookSquare.getPiece();
        return maybeRook.hasMoved === false && maybeRook.color === this.color && maybeRook.type === Piece.Type.ROOK ? 
                rookSquare:
                null;
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
        while (square.file !== kingDestinationFile && square.getPiece() === null){
            square = BACK_END.getTransposed(square, SCAN_DIRECTION);
        }
        return square.file === kingDestinationFile;
    }

    canCastle(kingSquare, kingDestinationFile, rookDestinationFile){
        if (this.hasMoved){
            return false;
        }

        let rookSquare = findRookSquare(kingSquare, kingDestinationFile, rookDestinationFile);
        if (rookSquare === null){
            return false;
        }

        if (!isKingPathClear(kingSquare, rookSquare, kingDestinationFile)){
            return false;
        }

        let rookDestinationPiece = BACK_END.getSquare(kingSquare.rank, rookDestinationFile).getPiece();
        return rookDestinationPiece === null ||
               rookDestinationPiece === this ||
               rookDestinationPiece === rookSquare.getPiece();
    }
}

export default King;