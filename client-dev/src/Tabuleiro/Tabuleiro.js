import React from "react";
import "./Tabuleiro.css";

class Tabuleiro extends React.Component {
  state = {
    colorMatrix: null,
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

  linesGenerate = (lines) => {
    const linesGenerateAux = (lines, position) => {
      let response = [];

      for (let i = 0; i < lines; i++) {
        response.push(
          <td
            key={i}
            id={position + String.fromCharCode(65 + i)}
            onClick={this.props.operation}
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
      <div style={{visibility: this.props.visible || this.props.visible === undefined ? "visible" : "hidden"}}>
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
