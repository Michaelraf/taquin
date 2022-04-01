/**
 * @author RAFALIMANANA Michaël
 */
const len = 3;
let table = document.querySelector('.table');
let solveBtn = document.querySelector('#solve');
let shuffleBtn = document.querySelector('#shuffle');
table.style.width = 100*len + 20 +"px";
table.style.height = 100*len + 20 + "px";
table_rect = table.getBoundingClientRect();
let nodes = []; // The nodes when solving
let moveList = []; // The list of the moves to the solution

class Piece {
    constructor(number, posX, posY) {
        this.number = number;
        this.posX = posX;
        this.posY = posY;
        this.elt = document.createElement('div');
        this.elt.classList.add('piece');
        if(this.number == "")
            this.elt.classList.add("empty");
        this.elt.innerHTML = this.number;
    }
    set setNumber(number){
        this.number = number;
    }
    set setPosX(X){
        this.posX = X;
    }
    set setPosY(Y){
        this.posY = Y;
    }

    get getNumber(){
        return this.number;
    }
    get getElt(){
        return this.elt;
    }
    get getPos(){
        return {"x" : this.posX, "y": this.posY};
    }

    put(){
        this.elt.style.top = table_rect.top + this.posX*100 + 10 + "px";
        this.elt.style.left = table_rect.left + this.posY*100 + 10 + "px";
        this.changeBackgroundColor();
    }
    changeBackgroundColor(){
        if(this.number!="" & Math.ceil(this.number/len)%2 == 0){
            this.elt.style.backgroundColor = "#6a789f"
        }
        else if(this.number!="" & Math.ceil(this.number/len)%2 != 0){
            this.elt.style.backgroundColor = "rgb(67, 47, 206)";
        }
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
                    this.pieces[i][j] = new Piece('', i,j);
                else {
                    this.pieces[i][j] = new Piece(number, i, j);
                    number++;
                }
            }
        }
    }
    get getPieces(){
        return this.pieces;
    }
    moveByClick(number){

        // Find the position of the element having the specified number
        let x = null;
        let y = null;
        ext:
        for (let i=0; i<len; i++){
            for(let j=0; j<len; j++){
                if(this.pieces[i][j].getNumber == number){
                    x = i;
                    y = j;
                    break ext;
                }
            }
        }
        if(this.pieces[x][y].getNumber != ""){
            // verifier si le vide est en haut
            if (checkRange(x-1, y)){
                if (this.pieces[x-1][y].getNumber == ""){
                    this.permute(this.pieces[x][y], this.pieces[x-1][y])
                }
            }
            // verifier si le vide est en bas
            if (checkRange(x+1, y)){
                if (this.pieces[x+1][y].getNumber == ""){
                    this.permute(this.pieces[x][y], this.pieces[x+1][y])
                }
            }
            // verifier si le vide est à gauche
            if (checkRange(x, y-1)){
                if (this.pieces[x][y-1].getNumber == ""){
                    this.permute(this.pieces[x][y], this.pieces[x][y-1])
                }
            }
            // verifier si le vide est à droite
            if (checkRange(x, y+1)){
                if (this.pieces[x][y+1].getNumber == ""){
                    this.permute(this.pieces[x][y], this.pieces[x][y+1])
                }
            }
        }
    }
    init(){
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                this.pieces[i][j].put();
                table.appendChild(this.pieces[i][j].getElt)
            }
        }
    }
    permute(piece1, piece2){

        // Permute elt1 and elt2

        let x1 = piece1.getPos.x;
        let x2 = piece2.getPos.x;
        let y1 = piece1.getPos.y;
        let y2 = piece2.getPos.y;

        this.pieces[x1][y1] = piece2;
        this.pieces[x2][y2] = piece1;
        this.pieces[x1][y1].setPosX = x1;
        this.pieces[x1][y1].setPosY = y1;
        this.pieces[x2][y2].setPosX = x2;
        this.pieces[x2][y2].setPosY = y2;

        this.pieces[x1][y1].put();
        this.pieces[x2][y2].put();
    }
    move(direction){
        let ind = {};
        let ind1 = {};
        ext:
        for (let i=0; i<len; i++){
            for (let j=0; j<len; j++){
                if (this.pieces[i][j].getNumber == ""){
                    ind["x"] = i;
                    ind["y"] = j;
                    break ext;
                }
            }
        }
        if(direction == 'U'){
            ind1["x"] = ind.x+1;
            ind1["y"] = ind.y;
            if(checkRange(ind1.x, ind1.y)){
                this.permute(this.pieces[ind.x][ind.y],this.pieces[ind1.x][ind1.y]);
            }
            else{
                return false;
            }
        }
        else if(direction == 'D'){
            ind1["x"] = ind.x-1;
            ind1["y"] = ind.y;
            if(checkRange(ind1.x, ind1.y)){
                this.permute(this.pieces[ind.x][ind.y],this.pieces[ind1.x][ind1.y]);
            }
            else{
                return false;
            }
        }
        else if(direction == 'R'){
            ind1["x"] = ind.x;
            ind1["y"] = ind.y-1;
            if(checkRange(ind1.x, ind1.y)){
                this.permute(this.pieces[ind.x][ind.y],this.pieces[ind1.x][ind1.y]);
            }
            else{
                return false;
            }
        }
        else if(direction == 'L'){
            ind1["x"] = ind.x;
            ind1["y"] = ind.y+1;
            if(checkRange(ind1.x, ind1.y)){
                this.permute(this.pieces[ind.x][ind.y],this.pieces[ind1.x][ind1.y]);
            }
            else{
                return false;
            }
        }
        return true;
    }
    shuffle(iterations){
        let i = 0;
        let lastMove = '';
        let id = window.setInterval(()=>{
            let moves = ['U','D','R','L']; // List of moves
            if(i>0){
                // Suppression immédiat de l'inverse du dérnier coup
                let index = moves.indexOf(this.getInverse(lastMove));
                moves.splice(index, 1);
            }
            let move = moves[Math.ceil(Math.random()*moves.length-1)];
            while (!this.move(move)){
                // Remove the impossible move from the list
                let index = moves.indexOf(move);
                moves.splice(index, 1);
                move = moves[Math.ceil(Math.random()*moves.length-1)];
            }
            lastMove = move;
            i++;
            if(i >= iterations){
                window.clearInterval(id);
            }
            
        }, 150);
    }
    getInverse(move){
        if (move == 'U')
            return 'D';
        else if (move == 'D')
            return 'U';
        else if (move == 'R')
            return 'L';
        else if (move == 'L')
            return 'R';
        else
            return false;
    }
}

let grid = new Grid();
grid.init();

window.addEventListener("keydown",(e)=>{
    if(e.key == 'ArrowUp'){
       grid.move('U');
    }
    else if(e.key == 'ArrowDown'){
        grid.move('D');

    }
    else if(e.key == 'ArrowRight'){
        grid.move('R');
    }
    else if(e.key == 'ArrowLeft'){
        grid.move('L');
    }
    else if (e.key == 's' || e.key == 'S'){
        // grid.shuffle(Math.floor(Math.exp(len)));
        grid.shuffle(100);
    }
    else if (e.key == 'r' || e.key == 'R'){
        // Creating the target state
        let target = [];
        let number = 1;
        for (let i=0; i<len; i++){
            target[i] = []
            for (let j=0; j<len; j++){
                target[i][j] = number;
                number++;
                if (i==len-1 & j==len-1)
                target[i][j] = ""
            };
        }
        nodes = [];
        moveList = [];
        state = ["", currentState()];
        solve(state, target, 0);
    }
})
window.addEventListener('click', (e)=>{
    if (e.target.classList.contains("piece")){
        grid.moveByClick(e.target.textContent);
    }
});
window.addEventListener("resize", (e)=>{
    table_rect = table.getBoundingClientRect();
    for (let i=0; i<len; i++){
        for(let j=0; j<len; j++){
            grid.getPieces[i][j].put();
        }
    }
});
shuffleBtn.addEventListener('click', (e)=>{
    // grid.shuffle((Math.floor(Math.exp(len))));
    grid.shuffle(100);
});
solveBtn.addEventListener('click', (e)=>{
    // Creating the target state
    let target = [];
    let number = 1;
    for (let i=0; i<len; i++){
        target[i] = []
        for (let j=0; j<len; j++){
            target[i][j] = number;
            number++;
            if (i==len-1 & j==len-1)
            target[i][j] = ""
        };
    }
    depth = 0;
    nodes = [];
    moveList = [];
    state = ["", currentState()];
    solve(state, target, 0);
    console.log(moveList);
    putSolved();
});
function indMin(arr){
    // getting an 1D array in the parameter and return the indice of the minimum elt
    let ind = 0;
    for (let i=1; i<arr.length; i++){
        if (arr[i]<arr[i-1])
            ind = i;
    }
    return ind;
}
function sortIndex(arr){
    // get 1D array, sort and return the 1D of indexes
    let arr1 = [...arr];
    arr1.sort();
    let index = [];
    for (let i=0; i<arr.length; i++){
        index.push(arr.indexOf(arr1[i]));
    }
    return index;
}
function hamming(state, target){5
    // getting two len x len dimension arrays and return the hamming distance between them
    let sum = 0;
    for (let i=0; i<len; i++){
        for (let j=0; j<len; j++){
            if(state[i][j]!="" & state[i][j] != target[i][j]){
                sum++;
            }
        }
    }
    return sum;
}
function manhattan(state, target){
    // getting two len x len dimension arrays and return the manhattan distance between them
    let sum = 0;
    for (let i=0; i<len; i++){ // 
        for (let j=0; j<len; j++){
            for (let p=0; p<len; p++){ // Browse along the column p
                if(state[i][j] == "");
                else{
                    let ind = target[p].indexOf(state[i][j]);
                    if(ind != -1){
                        sum += Math.abs(i-p) + Math.abs(j-ind);
                    }
                }
            }
        }
    }
    return sum;
}
function checkRange(i, j){
    if(i<0 || j<0 || i >= len || j >= len)
        return false;
    return true;
}
function adjacents(state){
    let possibleMoves = [];
    let states = [];

    // Find the index of the empty case
    let x = -1, y = -1;
    ext:
    for (let i=0; i<len; i++){
        for(let j=0; j<len; j++){
            if(state[i][j] == ""){
                x = i;
                y = j;
                break ext;
            }
        }
    }
    // Create the list of possible moves
    /// Check for UP
    if (checkRange(x+1, y))
        possibleMoves.push("U");
    /// Check for DOWN
    if (checkRange(x-1, y))
    possibleMoves.push("D");
    /// Check for RIGHT
    if (checkRange(x, y-1))
        possibleMoves.push("R");
    /// Check for LEFT
    if (checkRange(x, y+1))
        possibleMoves.push("L");
    for (move of possibleMoves){
        let newState = JSON.stringify(state);
        newState = JSON.parse(newState);
        if (move == 'U'){
            // Permute empty and the element below it
            [newState[x][y], newState[x+1][y]] = [newState[x+1][y], newState[x][y]];
            states.push(['U',newState]);
        }
        else if(move == "D"){
            // Permute empty and the element above it
            [newState[x][y], newState[x-1][y]] = [newState[x-1][y], newState[x][y]];
            states.push(['D',newState]);
        }
        else if(move == "R"){
            // Permute empty and the element at it's left side
            [newState[x][y], newState[x][y-1]] = [newState[x][y-1], newState[x][y]];
            states.push(['R',newState]);
        }
        else if(move == "L"){
            // Permute empty and the element at it's right side
            [newState[x][y], newState[x][y+1]] = [newState[x][y+1], newState[x][y]];
            states.push(['L',newState]);
        }
    }
    return states;
}
function currentState(){
    let state = [];
    for (let i=0; i<len; i++){
        state[i] = [];
        for(let j=0; j<len; j++){
            state[i][j] = grid.getPieces[i][j].getNumber;
        }
    }
    return state;
}
function equalArr(arr1, arr2){
    if (arr1.length != arr2.length)
        return false;
    else {
        for (let i=0; i<arr1.length; i++){
            for (let j=0; j<arr1[i].length; j++){
                if (arr1[i][j] != arr2[i][j])
                    return false;
            }
        }
    }
    return true;
}
function contains(nodes, state){
    for (let i=0; i<nodes.length; i++){
        if(equalArr(nodes[i], state))
            return true;
    }
    return false;
}
function solve(state, target, depth){
    if (depth == 50){
        return false;
    }
    console.log(depth);
    let newState = JSON.stringify(state);
    newState = JSON.parse(newState);
    let newTarget = JSON.stringify(target);
    newTarget = JSON.parse(newTarget); 
    console.log(newState[0]);
    console.table(newState[1]);
    if(contains(nodes, newState[1])){ 
        return false;
    }
    nodes.push(newState[1]);
    if (equalArr(newState[1], newTarget)){
        return true;
    }
    let children = adjacents(newState[1]);
    let h = [];
    for (let i=0; i<children.length; i++){
        h.push(manhattan(children[i][1], newTarget) + 3*hamming(children[i][1], newTarget));
    }
    h = sortIndex(h);
    for (let i=0; i<h.length; i++){
        if (solve(children[h[i]], newTarget, depth+1)){
            
            moveList.push(children[h[i]][0]);
            return true;
        }
    }
    return false;
}
function putSolved(){
    moveList = moveList.reverse();
    let i = 0;
    let id = window.setInterval(()=>{
        grid.move(moveList[i]);
        i++;
        if(i >= moveList.length){
            window.clearInterval(id);
        }
    }, 150);
} 