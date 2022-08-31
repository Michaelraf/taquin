// Global variables
let nodes = []; //  List of nodes already appeared when solving
let queue = []; // Will contain the queue for the BFS algorithm
let moveList = []; // The list of moves to the solution
let len = 3; // Default value for len
let depth = 0;
let state = [];
let target = [];

// Useful functions
function indMin(arr) {
    // getting an 1D array in the parameter and return the indice of the minimum elt
    let ind = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1])
            ind = i;
    }
    return ind;
}
function sortIndex(arr) {
    // get 1D array, sort and return the 1D of indexes
    let arr1 = [...arr];
    let index = [];
    for (let i = 0; i < arr1.length; i++) {
        arr1[i] = [arr1[i], i];
    }
    arr1.sort((a, b) => {
        return a[0] < b[0] ? -1 : 1;
    });
    for (let j = 0; j < arr1.length; j++) {
        index.push(arr1[j][1]);
    }
    return index;
}
function indexOf(arr1, arr2) {
    let k = 0;
    // get two 2D arrays as parameter and return the indice of arr1 in arr2
    for (let index = 0; index < arr2.length; index++) {
        for (let i = 0; i < arr2[index].length; i++) {
            for (let j = 0; j < arr2[index][i].length; i++) {
                if (arr1[index][i][j] == arr2[i][j]) {
                    if (k == arr2.length - 1)
                        return index;
                    k++;
                }
            }
        }
    }
    return false;
}
function hamming(state, target) {
    // get two len x len dimension arrays and return the hamming distance between them
    let sum = 0;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (state[i][j] != "" & state[i][j] != target[i][j]) {
                sum++;
            }
        }
    }
    return sum;
}
function manhattan(state, target) {
    // getting two len x len dimension arrays and return the manhattan distance between them
    let sum = 0;
    for (let i = 0; i < len; i++) { // 
        for (let j = 0; j < len; j++) {
            for (let p = 0; p < len; p++) { // Browse along the column p
                if (state[i][j] == "");
                else {
                    let ind = target[p].indexOf(state[i][j]);
                    if (ind != -1) {
                        sum += Math.abs(i - p) + Math.abs(j - ind);
                    }
                }
            }
        }
    }
    return sum;
}
function checkRange(i, j) {
    if (i < 0 || j < 0 || i >= len || j >= len)
        return false;
    return true;
}
function adjacents(state) {
    // get a state and return array of its adjacents states
    let possibleMoves = [];
    let states = [];

    // Find the index of the empty case
    let x = -1, y = -1;
    ext:
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (state[i][j] == "") {
                x = i;
                y = j;
                break ext;
            }
        }
    }
    // Create the list of possible moves
    /// Check for UP
    if (checkRange(x + 1, y))
        possibleMoves.push("U");
    /// Check for DOWN
    if (checkRange(x - 1, y))
        possibleMoves.push("D");
    /// Check for RIGHT
    if (checkRange(x, y - 1))
        possibleMoves.push("R");
    /// Check for LEFT
    if (checkRange(x, y + 1))
        possibleMoves.push("L");
    for (move of possibleMoves) {
        let newState = JSON.stringify(state);
        newState = JSON.parse(newState);
        if (move == 'U') {
            // Permute empty and the element below it
            [newState[x][y], newState[x + 1][y]] = [newState[x + 1][y], newState[x][y]];
            states.push(['U', newState]);
        }
        else if (move == "D") {
            // Permute empty and the element above it
            [newState[x][y], newState[x - 1][y]] = [newState[x - 1][y], newState[x][y]];
            states.push(['D', newState]);
        }
        else if (move == "R") {
            // Permute empty and the element at it's left side
            [newState[x][y], newState[x][y - 1]] = [newState[x][y - 1], newState[x][y]];
            states.push(['R', newState]);
        }
        else if (move == "L") {
            // Permute empty and the element at it's right side
            [newState[x][y], newState[x][y + 1]] = [newState[x][y + 1], newState[x][y]];
            states.push(['L', newState]);
        }
    }
    return states;
}
function equalArr(arr1, arr2) {
    if (arr1.length != arr2.length)
        return false;
    else {
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr1[i].length; j++) {
                if (arr1[i][j] != arr2[i][j])
                    return false;
            }
        }
    }
    return true;
}
function contains(nodes, state) {
    for (let i = 0; i < nodes.length; i++) {
        if (equalArr(nodes[i], state))
            return true;
    }
    return false;
}
function DFS(state, target, depth) {

    // copying state and target to newState and new target
    let newState = JSON.stringify(state);
    newState = JSON.parse(newState);
    let newTarget = JSON.stringify(target);
    newTarget = JSON.parse(newTarget);


    if (contains(nodes, newState[1])) {
        // console.log("inside nodes")
        return { "success": false, "reason": "node" };
    }
    nodes.push(newState[1]);
    if (equalArr(newState[1], newTarget)) {
        return { "success": true };
    }
    let children = adjacents(newState[1]);
    let h = [];
    for (let i = 0; i < children.length; i++) {
        h.push(manhattan(children[i][1], newTarget) + len * hamming(children[i][1], newTarget));
    }
    h = sortIndex(h);
    // console.log(h);
    for (let i = 0; i < h.length; i++) {
        let solve_state = DFS(children[h[i]], newTarget, depth + 1)
        if (solve_state.success) {
            moveList.push(children[h[i]][0]);
            return { "success": true };
        }
        else if (solve_state.reason == "depth" & i == h.length - 1) {
            nodes.pop();
            // console.log("pop nodes");
            return { "success": false, "reason": "depth" };
        }

    }
    return { "success": false, "reason": "child" };
}

const BFS = (state, target) => {
    let child_parent = {};
    queue[0] = state;
    nodes[0] = state[1];
    ext:
    while (queue.length > 0) {
        ext1:
        for (let child of adjacents(queue[0][1])) {
            if (!contains(nodes, child[1])) {
                // create the child-parent node
                child_parent[JSON.stringify(child[1])] = queue[0];
                // check if the child is already the target
                if (equalArr(child[1], target)) {
                    let parent = child_parent[JSON.stringify(child[1])]
                    moveList.push(child[0]);
                    // finding the way to solution
                    while (!equalArr(state[1], parent[1])) {
                        moveList.push(parent[0]);
                        parent = child_parent[JSON.stringify(parent[1])];
                    }
                    return { "sucess": true };
                }
                else {
                    queue.push(child);
                    nodes.push(child[1]);
                }
            }
        }
        // remove the first element of queue
        queue.shift();
    }
    return { "sucess": false };
}

const solver = (req, res) => {
    len = req.body.len;
    state = req.body.state;
    target = req.body.target;
    moveList = [];
    depth = 0;
    nodes = [];
    queue = [];
    // Solving with DFS algorithm
    // if (DFS(state, target, depth).success) {
    //     // console.log(moveList);
    //     res.json({
    //         solved: true,
    //         moveList: moveList.reverse(),
    //     })
    // }
    // Solving with BFS algorithm
    console.log("solving...");
    console.time();
    if (BFS(state, target).sucess == true) {
        console.timeEnd();
        console.log("solved");
        res.json({
            solved: true,
            moveList: moveList.reverse()
        })
    }
    else {
        console.log("Not solved");
        res.json({
            solved: false,
            moveList
        })
    }

}
module.exports = {
    solver
}