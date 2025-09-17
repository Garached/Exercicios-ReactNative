import React from "react";
import { Text, TextInput, Button, View, StyleSheet, Alert } from 'react-native';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      palpite: '',
      resultado: '',
      tentativas: 0,
      numeroSecreto: Math.floor(Math.random() * 100) + 1 
    };
  }

  verificarPalpite() {
    const {palpite, numeroSecreto, tentativas} = this.state;
    const palpiteNum = parseInt(palpite);

    if (isNaN(palpiteNum)) {
      this.setState({ resultado: 'Digite um número válido' });
      return;
    }

    if (palpiteNum === numeroSecreto) {
      this.setState({ resultado: `Correto! Você acertou em ${tentativas + 1} tentativas.` });
      this.resetarJogo();
    } else if (palpiteNum < numeroSecreto) {
      this.setState({ resultado: 'O número é maior', tentativas: tentativas + 1 });
    } else {
      this.setState({ resultado: 'O número é menor', tentativas: tentativas + 1 });
    }
  }

  resetarJogo() {
    this.setState({
      palpite: '',
      tentativas: 0,
      numeroSecreto: Math.floor(Math.random() * 100) + 1
    });
  }

  render() {
    return (
      <View style={estilos.container}>
        <Text style={estilos.texto}>Digite um número</Text>
        <TextInput
          style={estilos.chute}
          keyboardType="numeric"
          onChangeText={(text)=>this.setState({palpite: text})}
          value={this.state.palpite}
        />

        <View style={estilos.botaochute}>
          <Button title="Chutar" onPress={()=>this.verificarPalpite()} />
        </View>

        <Text style={estilos.resultado}>{this.state.resultado}</Text>
        <Text style={estilos.texto}>Tentativas: {this.state.tentativas}</Text>
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  
  texto: {
    color: 'blue',
    fontSize: 30,
    marginTop: 10
  },
  chute: {
    borderWidth: 2,
    borderColor: 'red',
    fontSize: 30,
    width: '90%',
    padding: 5,
    marginBottom: 10,
    textAlign: 'center'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center'
    /* backgroundColor: 'grey', */
  },
  botaochute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '20%',
    marginTop: 10,
    marginBottom: 20
  },
  resultado: {
    color: 'green',
    fontSize: 25,
    marginTop: 20,
    textAlign: 'center'
  }
});

export default App;
