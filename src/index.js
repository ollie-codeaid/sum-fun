import React from 'react';
import ReactDOM from 'react-dom';

const BLUE_BUTTON = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
const PINK_BUTTON = "bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded"
const NO_BUTTON = "font-bold py-2 px-4 border-b-4 border-grey-700 rounded"
const GRAY_BUTTON = "bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded"
const TILE_SET = [1, 2, 3, 4, 5, 6, 7, 8, 9, '+', '-']

function Tile(props) {
  return (
    <button className={props.buttonClass} onClick={props.onClick}>
        {props.value}
    </button>
  )
}

function EmptyTile() {
  return (
    <button className={NO_BUTTON}></button>
  )
}

class Tiles extends React.Component {
  render() {
    if (this.props.values.length === 0) {
      return (
        <div>
          <EmptyTile />
        </div>
      )
    } else {
      return (
        <div>
            { this.props.values.map((value, index) => (
              <Tile
                key={index}
                value={value}
                onClick={() => this.props.onClick(index)}
                buttonClass={this.props.buttonClass}
              />
            ))}
        </div>
      )
    }
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problem: this.addTiles(['='], 5),
      solution: [],
      solved: false,
      clickCount: 0,
    };
  }

  addTiles(problem, tileCount) {
    let newProblem = problem;
    for (var i=0; i < tileCount; i++) {
      const index = Math.floor(Math.random() * TILE_SET.length);
      newProblem.push(TILE_SET[index]);
    }
    return newProblem;
  }

  addMoreTiles() {
    let problem = this.state.problem;
    this.setState({
      problem: this.addTiles(problem, 3),
    })
  }

  handleProblemClick(i) {
    let problem = this.state.problem;
    const chosen = this.state.problem[i];
    problem.splice(i, 1);

    const solution = this.state.solution.concat(chosen);
    let solved = false;
    if (problem.length === 0) {
      solved = isCorrect(solution);
    }

    this.setState({
      problem: problem,
      solution: solution,
      solved: solved,
      clickCount: this.state.clickCount + 1,
    });
  }

  handleSolutionClick(i) {
    let solution = this.state.solution;
    const chosen = this.state.solution[i];
    solution.splice(i, 1);

    this.setState({
      problem: this.state.problem.concat(chosen),
      solution: solution,
      clickCount: this.state.clickCount + 1,
    });
  }

  render() {
    const problem = this.state.problem;
    const solution = this.state.solution;
    const solved = this.state.solved;

    return (
      <div className="w-full flex content-center flex-wrap h-screen">
        <div className="w-full text-center mb-10">
          <h1>{solved ? "SOLVED!" : "Make me a valid equation using all the tiles."}</h1>
          <h1>You have made {this.state.clickCount} clicks.</h1>
        </div>
        <div className="w-full text-center mb-2">
          <button onClick={() => this.addMoreTiles()} className={GRAY_BUTTON}>
              More tiles?
          </button>
        </div>
        <div className="w-full text-center mb-2">
          <Tiles
            values={problem}
            onClick={i => this.handleProblemClick(i)}
            buttonClass={BLUE_BUTTON}
          />
        </div>
        <div className="w-full text-center mt-2">
          <Tiles
            values={solution}
            onClick={i => this.handleSolutionClick(i)}
            buttonClass={PINK_BUTTON}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function isCorrect(solution) {
  const solutionString = solution.join('');
  const left = solutionString.split('=')[0];
  const right = solutionString.split('=')[1];

  try {
    return eval(left) === eval(right);
  } catch {
    return false
  }
}
