import React from "react";
import "./Tabuleiro.css";

class Tabuleiro extends React.Component {
  state = {
    colorMatrix: null,
    ships: [5, 4, 3, 2],
  };

  componentDidMount() {
    let auxMatrix = [];
    for (let i = 0; i < this.props.cols; i++) {
      auxMatrix[i] = [];
      for (let j = 0; j < this.props.lines; j++) {
        auxMatrix[i][j] = "teal";
      }
    }

    this.setState({ colorMatrix: auxMatrix });
  }

  componentDidUpdate() {
    if (this.props.socket !== undefined) {
      this.props.socket.on("explosion", ([id, position]) => {
        let auxMatrix = this.state.colorMatrix;
        console.log("a");
        if (id !== this.props.sessionId) {
          auxMatrix[parseInt(position[0])][position.charCodeAt(1) - 65] = "red";
          this.setState({ colorMatrix: auxMatrix });
        }
      });
    }
  }

  headerGenerate = (columns) => {
    let response = [];

    for (let i = 0; i < columns; i++) {
      response.push(<th key={i}>{String.fromCharCode(65 + i)}</th>);
    }

    return response;
  };

  setShip = (event, line, col, color) => {
    let auxMatrix = this.state.colorMatrix;

    let checkCollision = () => {
      let response = false;

      for (let i = 0; i < this.state.ships[0]; i++) {
        if (this.props.orientation) {
          if (this.state.colorMatrix[line + i][col] !== "teal") {
            response = true;
          }
        } else {
          if (this.state.colorMatrix[line][col + i] !== "teal") {
            response = true;
          }
        }
      }

      return response;
    };

    if (
      this.props.orientation &&
      line > this.props.lines - this.state.ships[0]
    ) {
      line = this.props.lines - this.state.ships[0];
    }

    if (
      this.props.orientation === false &&
      col > this.props.cols - this.state.ships[0]
    ) {
      col = this.props.cols - this.state.ships[0];
    }

    if (checkCollision() === false) {
      for (let i = 0; i < this.state.ships[0]; i++) {
        if (this.props.orientation) {
          auxMatrix[line + i][col] = color;
        } else {
          auxMatrix[line][col + i] = color;
        }
      }
    }

    this.setState({ colorMatrix: auxMatrix });
    if (this.props.canPlace && event.type === "mouseleave") {
      this.props.operation(null);

      let auxShips = this.state.ships;

      auxShips.shift();

      this.setState({ ships: auxShips });
    }
  };

  linesGenerate = (lines) => {
    const linesGenerateAux = (lines, position) => {
      let response = [];

      for (let i = 0; i < lines; i++) {
        response.push(
          <td
            key={i}
            id={position + String.fromCharCode(65 + i)}
            onClick={this.props.operation}
            onMouseEnter={(e) => this.setShip(e, position, i, "blue")}
            onMouseLeave={(e) =>
              this.setShip(
                e,
                position,
                i,
                this.props.canPlace ? "blue" : "teal"
              )
            }
            style={{
              backgroundColor:
                this.state.colorMatrix !== null
                  ? this.state.colorMatrix[position][i]
                  : "black",
            }}
          ></td>
        );
      }

      return response;
    };

    let response = [];

    for (let i = 0; i < lines; i++) {
      response.push(
        <tr key={i}>
          <td className="no-border-left">{i}</td>
          {linesGenerateAux(lines, i)}
        </tr>
      );
    }

    return response;
  };

  render() {
    return (
      <div
        style={{
          visibility:
            this.props.visible || this.props.visible === undefined
              ? "visible"
              : "hidden",
        }}
      >
        <table>
          <tbody>
            <tr className="no-border-up">
              <th className="no-border-left"></th>
              {this.headerGenerate(this.props.cols)}
            </tr>
            {this.linesGenerate(this.props.lines)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Tabuleiro;
