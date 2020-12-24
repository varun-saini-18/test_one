class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        this.items.push(element);
    }
    pop() {
        if (this.items.length == 0)
            return "Underflow";
        return this.items.pop();
    }
    empty() {
        return this.items.length == 0;
    }
}

function getNeighboursUnvisited(grid, node) {
    const { col, row } = node;
    let neighbors = []
    if (row != 0)
        neighbors.push(grid[row - 1][col])
    if (col != 0)//&& visited[row][col-1] === false)
        neighbors.push(grid[row][col - 1])
    if (col != 56)//&&visited[row][col+1] === false)
        neighbors.push(grid[row][col + 1])
    if (row != 20)//&&visited[row+1][col] === false)
        neighbors.push(grid[row + 1][col])
    return neighbors.filter(neighbor => !neighbor.isVisited);


}
export function some_one(grid, startNode, endNode) {
    let stack = new Stack();
    var resultantNode = [];
    stack.push(startNode);
    resultantNode.push(startNode);
    startNode.isVisited = true;
    let flag = false;
    while (!stack.empty()) {
        let node = stack.pop();
        let neighbours = getNeighboursUnvisited(grid, node);
        for (let i = 0; i < neighbours.length; i++) {
            neighbours[i].isVisited = true;
            if (neighbours[i].isWall)
                continue;
            if (neighbours[i] === endNode) {
                resultantNode.push(neighbours[i]);
                flag = true
                break;
            }
            stack.push(neighbours[i]);
            resultantNode.push(neighbours[i]);
        }
        if (flag)
            break;
    }
    console.log(resultantNode)
    return resultantNode;
}