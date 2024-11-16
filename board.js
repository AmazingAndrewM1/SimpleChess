const board = document.getElementById("board");

let isLight = true;
for (let r = 0; r < 8; ++r){
    let boardRow = document.createElement("div");
    boardRow.classList.add("row");
    for (let c = 0; c < 8; ++c){
        let boardSquare = document.createElement("div");
        boardSquare.classList.add("square");
        if (isLight){
            boardSquare.classList.add("light");
            isLight = false;
        }
        else{
            boardSquare.classList.add("dark");
            isLight = true;
        }
        boardRow.appendChild(boardSquare); 
    }
    isLight = !isLight;
    board.appendChild(boardRow);
}