const len = 4;
let table = document.querySelector('.table');

init = function(){
    for (let i=0; i<len; i++){
        let row = document.createElement('div');
        row.classList.add("row");
        table.appendChild(row);
    }
    window.rows = document.querySelectorAll('.row');
}

class Piece {
    constructor(number) {
        this.number = number;
        this.elt = document.createElement('div');
        this.elt.classList.add('piece');
        this.elt.innerHTML = this.number;
    }
    get getNumber(){
        return this.number;
    }
}
class Grid {

    constructor() {
        this.pieces = [len]
        let number = 1;
        for (let i = 0; i < len; i++) {
            this.pieces[i] = [];
            for (let j = 0; j < len; j++) {
                if (i == len - 1 & j == len - 1)
                    this.pieces[i][j] = new Piece('');
                else {
                    this.pieces[i][j] = new Piece(number);
                    number++;
                }
                this.pieces[i][j].elt.addEventListener('click', (e)=>{
                    this.moveByClick(e, i, j);
                });
            }
        }
    }
    get getPieces(){
        return this.pieces;
    }
    shuffle(){
        
    }
    moveByClick(e, i, j){
        if(e.target.textContent != ""){
            // verifier si le vide est en haut
            if (this.checkRange(i-1, j)){
                if (this.pieces[i-1][j].getNumber == ""){
                    this.permute(this.pieces[i][j].getNumber, this.pieces[i-1][j].getNumber)
                }
            }
            // verifier si le vide est en bas
            if (this.checkRange(i+1, j)){
                if (this.pieces[i+1][j].getNumber == ""){
                    this.permute(this.pieces[i][j].getNumber, this.pieces[i+1][j].getNumber)
                }
            }
            // verifier si le vide est à gauche
            if (this.checkRange(i, j-1)){
                if (this.pieces[i][j-1].getNumber == ""){
                    this.permute(this.pieces[i][j].getNumber, this.pieces[i][j-1].getNumber)
                }
            }
            // verifier si le vide est à droite
            if (this.checkRange(i, j+1)){
                if (this.pieces[i][j+1].getNumber == ""){
                    this.permute(this.pieces[i][j].getNumber, this.pieces[i][j+1].getNumber)
                }
            }                        

        }
    }
    init(){
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                rows[i].appendChild(this.pieces[i][j].elt);
                this.changeBackgroundColor(rows[i].children.item(j));
            }
        }
    }
    permute(num1, num2){
        // Find the pieces with the specified numbers
        let ind1 = {};
        let ind2 = {};
        for (let i=0; i<len; i++){
            for (let j=0; j<len; j++){
                if (this.pieces[i][j].getNumber == num1){
                    ind1["x"] = i;
                    ind1["y"] = j;
                }
                else if(this.pieces[i][j].getNumber == num2){
                    ind2["x"] = i;
                    ind2["y"] = j;
                }
            }
        }

        // Permute num1 and num2
        [this.pieces[ind1["x"]][ind1["y"]], this.pieces[ind2["x"]][ind2["y"]]] = [this.pieces[ind2["x"]][ind2["y"]], this.pieces[ind1["x"]][ind1["y"]]]
        rows[ind1["x"]].children.item(ind1["y"]).textContent = num2;
        rows[ind2["x"]].children.item(ind2["y"]).textContent = num1;
        this.changeBackgroundColor(rows[ind1["x"]].children.item(ind1["y"]))
        this.changeBackgroundColor(rows[ind2["x"]].children.item(ind2["y"]))
    }
    checkRange(i, j){
        if(i<0 || j<0 || i >= len || j >= len)
            return false;
        return true;
    }
    changeBackgroundColor(node){
        if(node.textContent!="" & Math.ceil(node.textContent/len)%2 == 0){
            node.style.backgroundColor = "#6a789f"
        }
        else if(node.textContent!="" & Math.ceil(node.textContent/len)%2 != 0){
            node.style.backgroundColor = "rgb(67, 47, 206)";
        }
        else{
            node.style.backgroundColor = "#c8c5c5";
        }
    }
}

let grid = new Grid();
init();
grid.init();

window.addEventListener("keydown",(e)=>{
    let ind = {};
    let ind1 = {}
    for (let i=0; i<len; i++){
        for (let j=0; j<len; j++){
            if (grid.getPieces[i][j].getNumber == ""){
                ind["x"] = i;
                ind["y"] = j;
            }
        }
    }
    if(e.key == 'ArrowUp'){
        ind1["x"] = ind["x"]+1;
        ind1["y"] = ind["y"];
        if(grid.checkRange(ind1["x"], ind1["y"])){
            grid.permute("",grid.getPieces[ind1["x"]][ind1["y"]].getNumber)
        }
    }
    if(e.key == 'ArrowDown'){
        ind1["x"] = ind["x"]-1;
        ind1["y"] = ind["y"];
        if(grid.checkRange(ind1["x"], ind1["y"])){
            grid.permute("",grid.getPieces[ind1["x"]][ind1["y"]].getNumber)
        }
    }
    if(e.key == 'ArrowRight'){
        ind1["x"] = ind["x"];
        ind1["y"] = ind["y"]-1;
        if(grid.checkRange(ind1["x"], ind1["y"])){
            grid.permute("",grid.getPieces[ind1["x"]][ind1["y"]].getNumber)
        }
    }
    if(e.key == 'ArrowLeft'){
        ind1["x"] = ind["x"];
        ind1["y"] = ind["y"]+1;
        if(grid.checkRange(ind1["x"], ind1["y"])){
            grid.permute("",grid.getPieces[ind1["x"]][ind1["y"]].getNumber)
        }
    }
})