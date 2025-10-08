//Fazer o aplicativo vibrar quando as bolinhas colidem, usando https://snack.expo.dev/

import React from "react";
import { StyleSheet, Text, View, Button, Vibration } from 'react-native';
import { Accelerometer } from "expo-sensors";
import {Dimensions} from 'react-native';


const { width, height } = Dimensions.get("window");
const BALL_SIZE = 60;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.size = BALL_SIZE;
    this.padrao = [200, 100, 200];

    this.state = {
      ballX: width / 2,
      ballY: height / 2,
      ballX2: width / 4,
      ballY2: height / 4,
      x: 0,
      y: 0,
      z: 0,
      
    };

    Accelerometer.setUpdateInterval(16);
    this.listener1 = Accelerometer.addListener((data) => {
      this.mover1(data.x * 10, data.y * -8);
    });
    this.listener2 = Accelerometer.addListener((data) => {
      this.mover2(data.x * -8, data.y * 10);
    });
  }

  componentWillUnmount() {
    this.listener1 && this.listener1.remove();
    this.listener2 && this.listener2.remove();
  }

   vibrarPadrao(padrao, repetir = false) { 
    Vibration.vibrate(padrao, repetir);
  }

  checarColisao() { 
    const dx = this.state.ballX - this.state.ballX2;
    const dy = this.state.ballY - this.state.ballY2;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < this.size) {
      this.vibrarPadrao(this.padrao);
    }
  }

  mover1(xDelta, yDelta) {
    let newX = this.state.ballX + xDelta;
    let newY = this.state.ballY + yDelta;

    // Limites da tela
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > width - this.size) newX = width - this.size;
    if (newY > height - this.size) newY = height - this.size;

    this.setState({ ballX: newX, ballY: newY });

    this.setState({ ballX: newX, ballY: newY }, () => this.checarColisao());
    }

  mover2(xDelta, yDelta) {
    let newX = this.state.ballX2 + xDelta;
    let newY = this.state.ballY2 + yDelta;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > width - this.size) newX = width - this.size;
    if (newY > height - this.size) newY = height - this.size;

    this.setState({ ballX2: newX, ballY2: newY });

    this.setState({ ballX2: newX, ballY2: newY }, () => this.checarColisao());
  }
  

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Bola rosa */}
        <View
          style={{
            position: "absolute",
            left: this.state.ballX,
            top: this.state.ballY,
            width: this.size,
            height: this.size,
            borderRadius: this.size / 2,
            backgroundColor: "pink",
          }}
        />

        {/* Bola roxa */}
        <View
          style={{
            position: "absolute",
            left: this.state.ballX2,
            top: this.state.ballY2,
            width: this.size,
            height: this.size,
            borderRadius: this.size / 2,
            backgroundColor: "purple",
          }}
        />
      </View>
    );
  }
}

export default App;
