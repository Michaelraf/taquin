// Global variables
let nodes = []; //  List of nodes already appeared when solving
let moveList = []; // The list of moves to the solution

// Useful functions
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
function adjacents(state){
    // get a state and return array of its adjacents states
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