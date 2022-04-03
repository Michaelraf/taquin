/**
 * @author RAFALIMANANA Michaël
 */
const len = 3;
let table = document.querySelector('.table');
let solveBtn = document.querySelector('#solve');
let shuffleBtn = document.querySelector('#shuffle');
table.style.width = 100 * len + 20 + "px";
table.style.height = 100 * len + 20 + "px";
table_rect = table.getBoundingClientRect();
let moveList = [];

class Piece {
    constructor(number, posX, posY) {
        this.number = number;
        this.posX = posX;
        this.posY = posY;
        this.elt = document.createElement('div');
        this.elt.classList.add('piece');
        if (this.number == "")
            this.elt.classList.add("empty");
        this.elt.innerHTML = this.number;
    }
    set setNumber(number) {
        this.number = number;
    }
    set setPosX(X) {
        this.posX = X;
    }
    set setPosY(Y) {
        this.posY = Y;
    }

    get getNumber() {
        return this.number;
    }
    get getElt() {
        return this.elt;
    }
    get getPos() {
        return { "x": this.posX, "y": this.posY };
    }

    put() {
        this.elt.style.top = table_rect.top + this.posX * 100 + 10 + "px";
        this.elt.style.left = table_rect.left + this.posY * 100 + 10 + "px";
        this.changeBackgroundColor();
    }
    changeBackgroundColor() {
        if (this.number != "" & Math.ceil(this.number / len) % 2 == 0) {
            this.elt.style.backgroundColor = "#6a789f"
        }
        else if (this.number != "" & Math.ceil(this.number / len) % 2 != 0) {
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
                    this.pieces[i][j] = new Piece('', i, j);
                else {
                    this.pieces[i][j] = new Piece(number, i, j);
                    number++;
                }
            }
        }
    }
    get getPieces() {
        return this.pieces;
    }
    moveByClick(number) {

        // Find the position of the element having the specified number
        let x = null;
        let y = null;
        ext:
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                if (this.pieces[i][j].getNumber == number) {
                    x = i;
                    y = j;
                    break ext;
                }
            }
        }
        if (this.pieces[x][y].getNumber != "") {
            // verifier si le vide est en haut
            if (checkRange(x - 1, y)) {
                if (this.pieces[x - 1][y].getNumber == "") {
                    this.permute(this.pieces[x][y], this.pieces[x - 1][y])
                }
            }
            // verifier si le vide est en bas
            if (checkRange(x + 1, y)) {
                if (this.pieces[x + 1][y].getNumber == "") {
                    this.permute(this.pieces[x][y], this.pieces[x + 1][y])
                }
            }
            // verifier si le vide est à gauche
            if (checkRange(x, y - 1)) {
                if (this.pieces[x][y - 1].getNumber == "") {
                    this.permute(this.pieces[x][y], this.pieces[x][y - 1])
                }
            }
            // verifier si le vide est à droite
            if (checkRange(x, y + 1)) {
                if (this.pieces[x][y + 1].getNumber == "") {
                    this.permute(this.pieces[x][y], this.pieces[x][y + 1])
                }
            }
        }
    }
    init() {
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                this.pieces[i][j].put();
                table.appendChild(this.pieces[i][j].getElt)
            }
        }
    }
    permute(piece1, piece2) {

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
    move(direction) {
        let ind = {};
        let ind1 = {};
        ext:
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                if (this.pieces[i][j].getNumber == "") {
                    ind["x"] = i;
                    ind["y"] = j;
                    break ext;
                }
            }
        }
        if (direction == 'U') {
            ind1["x"] = ind.x + 1;
            ind1["y"] = ind.y;
            if (checkRange(ind1.x, ind1.y)) {
                this.permute(this.pieces[ind.x][ind.y], this.pieces[ind1.x][ind1.y]);
            }
            else {
                return false;
            }
        }
        else if (direction == 'D') {
            ind1["x"] = ind.x - 1;
            ind1["y"] = ind.y;
            if (checkRange(ind1.x, ind1.y)) {
                this.permute(this.pieces[ind.x][ind.y], this.pieces[ind1.x][ind1.y]);
            }
            else {
                return false;
            }
        }
        else if (direction == 'R') {
            ind1["x"] = ind.x;
            ind1["y"] = ind.y - 1;
            if (checkRange(ind1.x, ind1.y)) {
                this.permute(this.pieces[ind.x][ind.y], this.pieces[ind1.x][ind1.y]);
            }
            else {
                return false;
            }
        }
        else if (direction == 'L') {
            ind1["x"] = ind.x;
            ind1["y"] = ind.y + 1;
            if (checkRange(ind1.x, ind1.y)) {
                this.permute(this.pieces[ind.x][ind.y], this.pieces[ind1.x][ind1.y]);
            }
            else {
                return false;
            }
        }
        return true;
    }
    shuffle(iterations) {
        let i = 0;
        let lastMove = '';
        let id = window.setInterval(() => {
            let moves = ['U', 'D', 'R', 'L']; // List of moves
            if (i > 0) {
                // Suppression immédiat de l'inverse du dérnier coup
                let index = moves.indexOf(this.getInverse(lastMove));
                moves.splice(index, 1);
            }
            let move = moves[Math.ceil(Math.random() * moves.length - 1)];
            while (!this.move(move)) {
                // Remove the impossible move from the list
                let index = moves.indexOf(move);
                moves.splice(index, 1);
                move = moves[Math.ceil(Math.random() * moves.length - 1)];
            }
            lastMove = move;
            i++;
            if (i >= iterations) {
                window.clearInterval(id);
            }

        }, 100);
    }
    getInverse(move) {
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

window.addEventListener("keydown", (e) => {
    if (e.key == 'ArrowUp') {
        grid.move('U');
    }
    else if (e.key == 'ArrowDown') {
        grid.move('D');

    }
    else if (e.key == 'ArrowRight') {
        grid.move('R');
    }
    else if (e.key == 'ArrowLeft') {
        grid.move('L');
    }
    else if (e.key == 's' || e.key == 'S') {
        // grid.shuffle(Math.floor(Math.exp(len)));
        grid.shuffle(20*len);
    }
    else if (e.key == 'r' || e.key == 'R') {
        const content = getSolvedList();
        /* solve(state, target, 0); */
    }
})
window.addEventListener('click', (e) => {
    if (e.target.classList.contains("piece")) {
        grid.moveByClick(e.target.textContent);
    }
});
window.addEventListener("resize", (e) => {
    table_rect = table.getBoundingClientRect();
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            grid.getPieces[i][j].put();
        }
    }
});
shuffleBtn.addEventListener('click', (e) => {
    // grid.shuffle((Math.floor(Math.exp(len))));
    grid.shuffle(20*len);
});
solveBtn.addEventListener('click', (e) => {
    let content = getSolvedList();
});
function checkRange(i, j) {
    if (i < 0 || j < 0 || i >= len || j >= len)
        return false;
    return true;
}
function currentState() {
    let state = [];
    for (let i = 0; i < len; i++) {
        state[i] = [];
        for (let j = 0; j < len; j++) {
            state[i][j] = grid.getPieces[i][j].getNumber;
        }
    }
    return state;
}
function putSolved() {
    moveList = moveList.reverse();
    let i = 0;
    let id = window.setInterval(() => {
        grid.move(moveList[i]);
        i++;
        if (i >= moveList.length) {
            window.clearInterval(id);
        }
    }, 125);
}
function getSolvedList() {
    // Creating the target state
    let target = [];
    let number = 1;
    for (let i = 0; i < len; i++) {
        target[i] = []
        for (let j = 0; j < len; j++) {
            target[i][j] = number;
            number++;
            if (i == len - 1 & j == len - 1)
                target[i][j] = ""
        };
    }
    nodes = [];
    moveList = [];
    state = ["", currentState()];
    (async () => {

        const rawResponse = await fetch('../', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'len' : len,
                'state': state,
                'target': target
            })
        });
        const content = await rawResponse.json();
        console.log(content);
        moveList = content.moveList;
        putSolved();
    })();
}
