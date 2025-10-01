import React from 'react';
import { Text, TextInput, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

/* ================= JOGO DA ADIVINHAÇÃO ================= */
class Adivinhacao extends React.Component {
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
    const { palpite, numeroSecreto, tentativas } = this.state;
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
        <Text style={estilos.titulo}>Jogo da Adivinhação</Text>
        <TextInput
          style={estilos.input}
          keyboardType="numeric"
          onChangeText={(text) => this.setState({ palpite: text })}
          value={this.state.palpite}
          placeholder="Digite um número"
        />
        <Button title="Chutar" onPress={() => this.verificarPalpite()} />
        <Text style={estilos.resultado}>{this.state.resultado}</Text>
        <Text style={estilos.tentativas}>Tentativas: {this.state.tentativas}</Text>
      </View>
    );
  }
}

/* ================= JOGO PEDRA, PAPEL OU TESOURA ================= */
class PedraPapelTesoura extends React.Component {
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
            final = 'Placar final: Você venceu!';
          } else if (this.state.usuarioVenceu < this.state.appVenceu) {
            final = 'Placar final: O Bot venceu!';
          } else {
            final = 'Placar final: Empate!';
          }

          this.setState({
            historico: [final],
            usuarioVenceu: 0,
            appVenceu: 0,
            empates: 0,
            jogadas: 0
          });
        }, 4000);
      }
    });
  }

  render() {
    return (
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Pedra, Papel ou Tesoura</Text>
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

/* ================= TAB NAVIGATOR ================= */
export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Adivinhacao"
            component={Adivinhacao}
            options={{
              tabBarLabel: 'Adivinhação',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="help-circle-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="PedraPapelTesoura"
            component={PedraPapelTesoura}
            options={{
              tabBarLabel: 'Pedra/Papel/Tesoura',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="hand-rock-outline" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

/* ================= ESTILOS ================= */
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EEE'
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'blue',
    textAlign: 'center'
  },
  input: {
    borderWidth: 2,
    borderColor: 'red',
    fontSize: 30,
    width: '90%',
    padding: 5,
    marginBottom: 10,
    textAlign: 'center'
  },
  resultado: {
    color: 'green',
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center'
  },
  tentativas: {
    fontSize: 18,
    marginTop: 10
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
  placar: {
    fontSize: 18,
    marginTop: 5
  }
});
