// Global variables
let nodes = []; //  List of nodes already appeared when solving
let moveList = []; // The list of moves to the solution
let len = 3; // Default value for len
let depth = 0;
let state = [];
let target = [];

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
    let index = [];
    for (let i=0; i<arr1.length; i++){
        arr1[i] = [arr1[i], i];
    }
    arr1.sort((a, b)=>{
        return a[0] < b[0] ? -1 : 1;
    });
    for (let j=0; j<arr1.length; j++){
        index.push(arr1[j][1]);
    }
    return index;
}
function indexOf(arr1, arr2){
    let k = 0;
    // get two 2D arrays as parameter and return the indice of arr1 in arr2
    for(let index=0; index<arr2.length; index++){
        for (let i=0; i<arr2[index].length; i++){
            for(let j=0; j<arr2[index][i].length; i++){
                if (arr1[index][i][j] == arr2[i][j]){
                    if(k == arr2.length-1)
                        return index;
                    k++;    
                }
            }
        }
    }
    return false;
}
function hamming(state, target){
    // get two len x len dimension arrays and return the hamming distance between them
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

/*     if (depth > 20){
        return {"success": false, "reason": "depth"};
    } */
    // console.log(depth);
    let newState = JSON.stringify(state);
    newState = JSON.parse(newState);
    let newTarget = JSON.stringify(target);
    newTarget = JSON.parse(newTarget); 
    // console.log(newState[0]);
    // console.table(newState[1]);
    if(contains(nodes, newState[1])){
        // console.log("inside nodes")
        return {"success": false, "reason": "node"};
    }
    nodes.push(newState[1]);
    if (equalArr(newState[1], newTarget)){
        return {"success": true};
    }
    let children = adjacents(newState[1]);
    let h = [];
    for (let i=0; i<children.length; i++){
        h.push(manhattan(children[i][1], newTarget) + len*hamming(children[i][1], newTarget));
    }
    h = sortIndex(h);
    // console.log(h);
    for (let i=0; i<h.length; i++){
        let solve_state = solve(children[h[i]], newTarget, depth+1)
        if (solve_state.success){
            moveList.push(children[h[i]][0]);
            return {"success": true};
        }
        else if(solve_state.reason == "depth" & i==h.length-1){
            nodes.pop();
            // console.log("pop nodes");
            return {"success": false, "reason": "depth"};
        }

    }
    return {"success": false, "reason": "child"};
}
const solver = (req, res)=>{
    len = req.body.len;
    state = req.body.state;
    target = req.body.target;
/*     res.json({
        message : 'resolving'
    }); */
/*     return new Promise((resolve, reject)=>{
        solve(state, target);
    }) */
    moveList = [];
    depth = 0;
    nodes = [];
    if(solve(state, target, depth).success){
        // console.log(moveList);
        res.json({
            solved : true,
            moveList
        })
    }
    else{
        console.log("Not solved");
        res.json({
            solved : false
        })
    }
}
module.exports = {
    solver
}