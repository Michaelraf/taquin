const len = 3;
let table = document.querySelector('.table');
let rows = document.querySelectorAll('.row');

class Piece {
    constructor(number) {
        this.number = number;
        this.elt = document.createElement('div');
        this.elt.classList.add('piece')
        this.elt.innerHTML = this.number;
    }
    activate() {
        this.elt.addEventListener('mousedown', (e) => {

        });
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
                this.pieces[i][j].activate();
            }
        }
    }
    get getPieces(){
        return this.pieces;
    }
    init(){
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                rows[i].appendChild(this.pieces[i][j].elt);
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
        this.actualise()
    }
    actualise(){
        for (let i = 0; i < len; i++) {
            rows[i].innerHTML = '';
            for (let j = 0; j < len; j++) {
                rows[i].appendChild(this.pieces[i][j].elt);
            }
        }
    }
}

let grid = new Grid();
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
        if(grid.getPieces[ind1["x"]][ind1["y"]] != undefined){
            grid.permute("",grid.getPieces[ind1["x"]][ind1["y"]].getNumber)
        }
    }
    if(e.key == 'ArrowDown'){
        ind1["x"] = ind["x"]-1;
        ind1["y"] = ind["y"];
        if(grid.getPieces[ind1["x"]][ind1["y"]] != undefined){
            grid.permute("",grid.getPieces[ind1["x"]][ind1["y"]].getNumber)
        }
    }
    if(e.key == 'ArrowRight'){
        ind1["x"] = ind["x"];
        ind1["y"] = ind["y"]-1;
        if(grid.getPieces[ind1["x"]][ind1["y"]] != undefined){
            grid.permute("",grid.getPieces[ind1["x"]][ind1["y"]].getNumber)
        }
    }
    if(e.key == 'ArrowLeft'){
        ind1["x"] = ind["x"];
        ind1["y"] = ind["y"]+1;
        if(grid.getPieces[ind1["x"]][ind1["y"]] != undefined){
            grid.permute("",grid.getPieces[ind1["x"]][ind1["y"]].getNumber)
        }
    }
})