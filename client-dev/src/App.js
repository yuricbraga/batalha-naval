import React from "react";
import Tabuleiro from "./Tabuleiro/Tabuleiro";
import io from "socket.io-client";

const socket = io("192.168.0.12:9000")

class App extends React.Component {
  state = {
    sessionId: "",
    myTurn: false,
    canPlace: false,
    orientation: true
  }

  componentDidMount() {
    socket.on("new connection", (sessionId) => {
      if(this.state.sessionId === ""){
        this.setState({sessionId: sessionId})
      }

      if(sessionId !== this.state.sessionId){
        this.setState({myTurn: true});
      }
    });

    socket.on("explosion", (a) => {
      this.setState({myTurn: !this.state.myTurn});
    })
  }

  sendBomb = (e) => {
    socket.emit("bomb", e.target.id);
    e.target.style.backgroundColor = "red";
  }

  placeShip = (e) => {
    this.setState({canPlace: !this.state.canPlace});
  }

  render() {
    return (
      <div>
        <h2>Meu tabuleiro</h2>
        <Tabuleiro cols={10} lines={10} operation={this.placeShip} orientation={this.state.orientation} canPlace={this.state.canPlace} socket={socket} sessionId={this.state.sessionId}></Tabuleiro>
        <br/>
        <button onClick={(e) => {this.setState({orientation: !this.state.orientation})}}>Rotacionar</button>
        <br/>
        <h2 style={{visibility: this.state.myTurn ? "visible" : "hidden"}}>Tabuleiro adversário</h2>
        <Tabuleiro cols={10} lines={10} operation={this.sendBomb} visible={this.state.myTurn}></Tabuleiro>
      </div>
    );
  }
}

export default App;
