import React from "react";
import { Text, Button, View, StyleSheet } from 'react-native';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historico: [],       
      usuarioVenceu: 0,
      appVenceu: 0,
      empates: 0,
      jogadas: 0
    };
  }

  jogar(Voce) {
    if (this.state.jogadas >= 5) return; 

    const opcoes = ['Pedra', 'Papel', 'Tesoura'];
    const Bot = opcoes[Math.floor(Math.random() * 3)];
    let resultadoRodada = '';

    if (Voce === Bot) {
      resultadoRodada = 'Empate!';
      this.setState({ empates: this.state.empates + 1 });
    } else if (
      (Voce === 'Pedra' && Bot === 'Tesoura') ||
      (Voce === 'Papel' && Bot === 'Pedra') ||
      (Voce === 'Tesoura' && Bot === 'Papel')
    ) {
      resultadoRodada = 'Você ganhou';
      this.setState({ usuarioVenceu: this.state.usuarioVenceu + 1 });
    } else {
      resultadoRodada = 'Você perdeu';
      this.setState({ appVenceu: this.state.appVenceu + 1 });
    }

    this.setState(prev => ({
      historico: [
        ...prev.historico,
        `Você: ${Voce} | Bot: ${Bot} → ${resultadoRodada}`
      ],
      jogadas: prev.jogadas + 1
    }), () => {
      if (this.state.jogadas === 5) {
        setTimeout(() => {
          let final = '';
          if (this.state.usuarioVenceu > this.state.appVenceu) {
            final = 'Placar final: Você venceu ';
          } else if (this.state.usuarioVenceu < this.state.appVenceu) {
            final = 'Placar final: O Bot venceu';
          } else {
            final = 'Placar final: Empate ';
          }

          this.setState({
            historico: [final],
            usuarioVenceu: 0,
            appVenceu: 0,
            empates: 0,
            jogadas: 0
          });
        }, 4000); //fica 4s antes de reiniciar
      }
    });
  }

  render() {
    return (
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Pedra, Papel ou Tesoura </Text>

        <View style={estilos.botoes}>
          <Button title="Pedra" onPress={() => this.jogar('Pedra')} />
          <Button title="Papel" onPress={() => this.jogar('Papel')} />
          <Button title="Tesoura" onPress={() => this.jogar('Tesoura')} />
        </View>

        <View style={estilos.historico}>
          {this.state.historico.map((linha, index) => (
            <Text key={index} style={estilos.resultado}>{linha}</Text>
          ))}
        </View>

        <Text style={estilos.placar}>
          Você: {this.state.usuarioVenceu} | Bot: {this.state.appVenceu} | Empates: {this.state.empates}
        </Text>
        <Text style={estilos.placar}>
          Rodadas: {this.state.jogadas}/5
        </Text>
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
    padding: 20
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'blue'
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20
  },
  historico: {
    marginVertical: 15,
    alignItems: 'center'
  },
  resultado: {
    fontSize: 20,
    marginVertical: 5,
    textAlign: 'center'
  },
  placar: {
    fontSize: 20,
    marginTop: 10
  }
});

export default App;
