import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { kruskals } from '../algorithms/kruskals';
import { game } from '../algorithms/game';
import { getMaze } from '../algorithms/getMaze';
import { recursiveDivision, generate_arr } from '../algorithms/RecursiveDivision';
import { func, huntAndKill } from '../algorithms/huntAndKill';
import { binaryTree } from '../algorithms/binaryTree';
import { some_one } from '../algorithms/play';

import './PathfindingVisualizer.css';

var is_Start = false;
var is_Finish = false;
var prevRowStart, prevColStart, prevRowFinish, prevColFinish, prevClass;
var is_board_clear = true;
var is_game_on = false;
var visualizing = false;

var random_dfs_content = <p>
  <h1>Random Dfs Content</h1>
  <ul>
    <li>Choose the initial cell, mark it as visited and push it to the stack</li>
    <li>While the stack is not empty</li>
    <ol>
      <li>Pop a cell from the stack and make it a current cell</li>
      <li>If the current cell has any neighbours which have not been visited</li>
      <ol>
        <li>Push the current cell to the stack</li>
        <li>Choose one of the unvisited neighbours</li>
        <li>Remove the wall between the current cell and the chosen cell</li>
        <li>Mark the chosen cell as visited and push it to the stack</li>
      </ol>
    </ol>
  </ul>
</p>

var hunt_and_kill_content = <p>
  <ol>
    <li>Choose a starting location.</li>
    <li>Until the current cell has no unvisited neighbors.</li>
    <ul>
      <li>Perform a random walk, carving passages to unvisited neighbors. </li>
    </ul>
    <li>Enter “hunt” mode, where you scan the grid looking for an unvisited cell that is adjacent to a visited cell. If found, carve a passage between the two and let the formerly unvisited cell be the new starting location.</li>
    <li>Repeat steps 2 and 3 until the hunt mode scans the entire grid and finds no unvisited cells.</li>
  </ol>
</p>

var binary_tree_content = <p>
  <ul>
    <li>For each existing cell in the grid:</li>
    <ol>
      <li>Get if they exist, north or west neighbors.</li>
      <li>Toss a coin to connect with one of them.</li>
    </ol>
    <li>It is already done!</li>
  </ul>
</p>

var kruskals_content = <p>
  <ul>
    <li>Create a list of all walls, and create a set for each cell, each containing just that one cell.</li>
    <li>For each wall, in some random order:</li>
    <ul>
      <li>
        If the cells divided by this wall belong to distinct sets:
        <ol>
          <li>
            Remove the current wall.
          </li>
          <li>
            Join the sets of the formerly divided cells.
          </li>
        </ol>
      </li>
    </ul>
  </ul>
</p>

var recursive_division_content = <p>
  <ol>
    <li>
      Begin with an empty field.
    </li>
    <li>
      Bisect the field with a wall, either horizontally or vertically. Add a single passage through the wall.
    </li>
    <li>
      Repeat step #2 with the areas on either side of the wall.
    </li>
    <li>
      Continue, recursively, until the maze reaches the desired resolution.
    </li>
  </ol>
</p>

var djikstra_content = <p>
  <ol>
    <li>This is not right algo. Its just demo.</li>
    <li>Choose a starting location.</li>
    <li>Until the current cell has no unvisited neighbors.</li>
    <ul>
      <li>Perform a random walk, carving passages to unvisited neighbors. </li>
    </ul>
    <li>Enter “hunt” mode, where you scan the grid looking for an unvisited cell that is adjacent to a visited cell. If found, carve a passage between the two and let the formerly unvisited cell be the new starting location.</li>
    <li>Repeat steps 2 and 3 until the hunt mode scans the entire grid and finds no unvisited cells.</li>
  </ol>
</p>

// kruskals(5, 5);

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      speed: 5,
      START_NODE_ROW: 0,
      START_NODE_COL: 0,
      FINISH_NODE_ROW: 20,
      FINISH_NODE_COL: 56,
      generating_algo: "Random Dfs",
      generating_algo_content: random_dfs_content,
      solving_algo: "Djikstra",
      solving_algo_content: djikstra_content
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.START_NODE_ROW, this.state.START_NODE_COL, this.state.FINISH_NODE_ROW, this.state.FINISH_NODE_COL);
    this.setState({ grid });
  }

  // Handle Mouse Down works when we click
  handleMouseDown(row, col) {
    if (visualizing || !is_board_clear) return;

    if (row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL) {
      if (is_game_on) return;
      is_Start = true;
      prevClass = 'node';
      prevRowStart = row;
      prevColStart = col;
      return;
    }
    if (row === this.state.FINISH_NODE_ROW && col === this.state.FINISH_NODE_COL) {
      if (is_game_on) return;
      is_Finish = true;
      prevRowFinish = row;
      prevColFinish = col;
      return;
    }
    if (is_game_on) {
      const { grid } = this.state;
      const node = grid[row][col];
      if (node.isWall) return;
      var newGameWallsCount;
      if (node.isGameWall)
        newGameWallsCount = this.state.gameWallsCount - 1;
      else
        newGameWallsCount = this.state.gameWallsCount + 1;
      const newGrid = getNewGridWithWallToggledGame(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true, gameWallsCount: newGameWallsCount });
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  // This fires up when mouse enters a div
  // Here used for scrolling
  handleMouseEnter(row, col) {
    if (visualizing || !is_board_clear) return;
    if (is_Start) {
      document.getElementById(`node-${prevRowStart}-${prevColStart}`).className =
        prevClass;
      prevClass = document.getElementById(`node-${row}-${col}`).className;
      document.getElementById(`node-${row}-${col}`).className =
        'node node-start';
      prevRowStart = row;
      prevColStart = col;
      this.setState({ START_NODE_ROW: row, START_NODE_COL: col });
      return;
    }
    if (is_Finish) {
      document.getElementById(`node-${prevRowFinish}-${prevColFinish}`).className =
        'node';
      document.getElementById(`node-${row}-${col}`).className =
        'node node-finish';
      prevRowFinish = row;
      prevColFinish = col;
      this.setState({ FINISH_NODE_ROW: row, FINISH_NODE_COL: col });
      return;
    }
    if (
      !this.state.mouseIsPressed ||
      (row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL) ||
      (row === this.state.FINISH_NODE_ROW && col === this.state.FINISH_NODE_COL)
    ) return;
    if (is_game_on) {
      const { grid } = this.state;
      const node = grid[row][col];
      if (node.isWall) return;
      var newGameWallsCount;
      if (grid[row][col].isGameWall)
        newGameWallsCount = this.state.gameWallsCount - 1;
      else
        newGameWallsCount = this.state.gameWallsCount + 1;
      const newGrid = getNewGridWithWallToggledGame(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true, gameWallsCount: newGameWallsCount });
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  // Handle Mouse Down works when finished click
  handleMouseUp() {
    if (visualizing || !is_board_clear) return;
    if (is_Start) {
      is_Start = false;
      return;
    }
    if (is_Finish) {
      is_Finish = false;
      return;
    }
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.state.speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        var flag = false;
        if (node.row === this.state.START_NODE_ROW && node.col === this.state.START_NODE_COL) {
          flag = true;
        }
        else if (node.row === this.state.FINISH_NODE_ROW && node.col === this.state.FINISH_NODE_COL) {
          flag = true;
        }
        if (!flag) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, this.state.speed * i);
    }
  }




  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        var flag = false;
        if (node.row === this.state.START_NODE_ROW && node.col === this.state.START_NODE_COL) {
          flag = true;
        }
        else if (node.row === this.state.FINISH_NODE_ROW && node.col === this.state.FINISH_NODE_COL) {
          flag = true;
        }
        if (!flag) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }
      }, this.state.speed * 5 * i);
    }
    setTimeout(() => {
      document.getElementById("clearBoardBtn").disabled = false;
      document.getElementById("clearBoardBtn").className = "button";
      visualizing = false;
    }, this.state.speed * 5 * nodesInShortestPathOrder.length);
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];

    const nodesInShortestPathOrder = some_one(grid, startNode, finishNode);
    const visitedNodesInOrder = [];

    // const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    // const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    visualizing = true;
    // document.getElementById("visualiseDataBtn").disabled = true;
    // document.getElementById("visualiseDataBtn").className = "button-disabled";
    // document.getElementById("gameBtn").disabled = true;
    // document.getElementById("gameBtn").className = "button-disabled";
    // document.getElementById("clearBoardBtn").disabled = true;
    // document.getElementById("clearBoardBtn").className = "button-disabled";
    is_board_clear = false;
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  create_maze(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        var row = node[0];
        var col = node[1];
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
      }, this.state.speed * 5 * i);
    }
  }

  create_random_dfs_maze(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        var row = node.row;
        var col = node.col;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
      }, this.state.speed * 5 * i);
    }
  }

  kruskals() {
    const x = kruskals(21, 57);
    const visitedNodesInOrder = x[1];
    const nodesInShortestPathOrder = x[0];

    for (var i = 0; i < visitedNodesInOrder.length; i++) {
      const row = visitedNodesInOrder[i][0];
      const col = visitedNodesInOrder[i][1];
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
    this.create_maze(nodesInShortestPathOrder);
  }


  recursiveDiv() {
    generate_arr();
    const visitedNodesInOrder = recursiveDivision(0, 20, 0, 56)
    this.create_maze(visitedNodesInOrder);
  }

  huntAndKill() {
    for (var i = 0; i < 21; i++) {
      for (var j = 0 + !(i % 2); j < 57; j = j + 1 + !(i % 2)) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, i, j);
        this.setState({ grid: newGrid });
      }
    }
    func();
    var visitedNodesInOrder = huntAndKill(0, 0, false);
    this.create_maze(visitedNodesInOrder);
  }

  binaryTree() {
    for (var i = 0; i < 21; i++) {
      for (var j = 0 + !(i % 2); j < 57; j = j + 1 + !(i % 2)) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, i, j);
        this.setState({ grid: newGrid });
      }
    }
    var visitedNodesInOrder = binaryTree();
    this.create_maze(visitedNodesInOrder);
  }

  randomDfs() {
    const { grid } = this.state;
    const nodesWithWall = getMaze(grid);
    this.create_random_dfs_maze(nodesWithWall);
  }

  resetGrid() {
    // const grid = getInitialGrid(this.state.START_NODE_ROW, this.state.START_NODE_COL, this.state.FINISH_NODE_ROW, this.state.FINISH_NODE_COL);
    var grid = this.state.grid;
    for (let row = 0; row < 21; row++) {
      for (let column = 0; column < 57; column++) {
        if (row === this.state.START_NODE_ROW && column === this.state.START_NODE_COL) {

        }
        else if (row === this.state.FINISH_NODE_ROW && column === this.state.FINISH_NODE_COL) {

        }
        else {
          var node = grid[row][column];
          if (node.isWall) {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, column);
            this.setState({ grid: newGrid });
          }
          else {
            document.getElementById(`node-${row}-${column}`).className =
              'node';
          }
        }
      }
    }
  }

  changeSpeed() {
    var x = document.getElementById("selectSpeed").value;
    this.setState({ speed: x });
  }

  changeLevel() {
    var x = document.getElementById("selectLevel").value;
    this.setState({ level: x });
  }

  changeContent() {
    this.setState({ generating_algo_content: 'Other' });
  }

  generate_maze() {
    var generating_algo = this.state.generating_algo;
    if (generating_algo === "Random Dfs") {
      this.randomDfs();
    }
    else if (generating_algo === "Kruskals") {
      this.kruskals();
    }
    else if (generating_algo === "Hunt And Kill") {
      this.huntAndKill();
    }
    else if (generating_algo === "Recursive Division") {
      this.recursiveDiv();
    }
    else {
      this.binaryTree();
    }
  }

  solve_maze() {
    var solving_algo = this.state.solving_algo;
    if (solving_algo === "Djikstra") {
      this.visualizeDijkstra();
    }
  }

  changeGeneratingAlgo() {
    var generating_algo = document.getElementById("change_generating_algo").value;
    var content;
    if (generating_algo === "Random Dfs") {
      content = random_dfs_content;
    }
    else if (generating_algo === "Kruskals") {
      content = kruskals_content;
    }
    else if (generating_algo === "Hunt And Kill") {
      content = hunt_and_kill_content;
    }
    else if (generating_algo === "Recursive Division") {
      content = recursive_division_content;
    }
    else {
      content = binary_tree_content;
    }
    this.setState({ generating_algo: generating_algo, generating_algo_content: content });
  }

  changeSolvingAlgo() {
    var solving_algo = document.getElementById("change_solving_algo").value;
    var content;
    if (solving_algo === "Djikstra") {
      content = djikstra_content;
    }
    this.setState({ solving_algo: solving_algo, solving_algo_content: content });
  }


  render() {
    const { grid, mouseIsPressed } = this.state;
    const gameBtn = is_game_on ? 'Stop Game' : 'Start Game';
    return (
      <>

        <div className="navbar">
          <select onChange={() => this.changeGeneratingAlgo()} name="algos" id="change_generating_algo">
            <option value="Random Dfs">Random Dfs</option>
            <option value="Kruskals">Kruskals</option>
            <option value="Hunt And Kill">Hunt And Kill</option>
            <option value="Recursive Division">Recursive Division</option>
            <option value="Binary Tree">Binary Tree</option>
          </select>
          <button onClick={() => this.generate_maze()} id="generate_maze" className="button">
            Generate Maze
        </button>
          <select onChange={() => this.changeSolvingAlgo()} name="algos" id="change_solving_algo">
            <option value="Djikstra">Djikstra</option>
          </select>
          <button onClick={() => this.solve_maze()} id="solve_maze" className="button">
            Solve Maze
        </button>
          <button onClick={() => this.resetGrid()} id="clearBoardBtn" className="button">
            Clear Board
        </button>
        </div>
        <div className="w3-dropdown-hover">
          <button className="w3-button w3-black">Want to know about maze genearting algorithm?</button>
          <div className="w3-dropdown-content w3-bar-block w3-border">
            {this.state.generating_algo_content}
          </div>
        </div>
        <div className="w3-dropdown-hover">
          <button className="w3-button w3-black">Want to know about maze solving algorithm?</button>
          <div className="w3-dropdown-content w3-bar-block w3-border">
            {this.state.solving_algo_content}
          </div>
        </div>


        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="check">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall, isGameWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isGameWall={isGameWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = (startRow, startCol, finishRow, finishCol) => {
  const grid = [];
  for (let row = 0; row < 21; row++) {
    const currentRow = [];
    for (let col = 0; col < 57; col++) {
      currentRow.push(createNode(col, row, startRow, startCol, finishRow, finishCol));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, startRow, startCol, finishRow, finishCol) => {
  return {
    col,
    row,
    isStart: row === startRow && col === startCol,
    isFinish: row === finishRow && col === finishCol,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isGameWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWallToggledGame = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isGameWall: !node.isGameWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
