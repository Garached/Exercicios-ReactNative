import React from 'react';
import { Text, TextInput, Button, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

/* ================= LOGIN ================= */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { usuario: '', senha: '' };
  }

  logar = async () => {
    const { usuario, senha } = this.state;
    if (!usuario || !senha) return alert('Preencha usuário e senha');
    try {
      const senhaSalva = await AsyncStorage.getItem(usuario);
      if (senhaSalva && senhaSalva === senha) {
        alert('Login realizado!');
        this.props.navigation.navigate('Menu', { usuario });
      } else {
        alert('Usuário ou senha incorretos!');
      }
    } catch (e) {
      console.log(e);
      alert('Erro ao acessar armazenamento');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={this.state.usuario}
          onChangeText={(t) => this.setState({ usuario: t })}
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          secureTextEntry
          value={this.state.senha}
          onChangeText={(t) => this.setState({ senha: t })}
        />
        <Button title="Entrar" onPress={this.logar} />
      </View>
    );
  }
}

/* ================= CADASTRO ================= */
class Cadastro extends React.Component {
  constructor(props) {
    super(props);
    this.state = { usuario: '', senha: '' };
  }

  cadastrar = async () => {
    const { usuario, senha } = this.state;
    if (!usuario || !senha) return alert('Preencha usuário e senha');
    try {
      const exists = await AsyncStorage.getItem(usuario);
      if (exists) return alert('Usuário já existe!');
      await AsyncStorage.setItem(usuario, senha);
      alert('Usuário cadastrado!');
      this.setState({ usuario: '', senha: '' });
    } catch (e) {
      console.log(e);
      alert('Erro ao salvar');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={this.state.usuario}
          onChangeText={(t) => this.setState({ usuario: t })}
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          secureTextEntry
          value={this.state.senha}
          onChangeText={(t) => this.setState({ senha: t })}
        />
        <Button title="Cadastrar" onPress={this.cadastrar} />
      </View>
    );
  }
}

/* ================= MENU ================= */
function Menu({ navigation, route }) {
  const usuario = route.params?.usuario ?? 'anônimo';
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {usuario}!</Text>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Adivinhacao', { usuario })}>
        <Text style={styles.menuText}>Jogo da Adivinhação</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('PedraPapelTesoura', { usuario })}>
        <Text style={styles.menuText}>Pedra, Papel ou Tesoura</Text>
      </TouchableOpacity>
      <Button title="Ver Scores" onPress={() => navigation.navigate('Scores', { usuario })} />
    </View>
  );
}

/* ================= JOGO ADIVINHAÇÃO ================= */
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

  verificarPalpite = async () => {
    const { palpite, numeroSecreto, tentativas } = this.state;
    const palpiteNum = parseInt(palpite);
    if (isNaN(palpiteNum)) return alert('Digite um número válido');

    const novasTentativas = tentativas + 1;
    let mensagem = '';
    if (palpiteNum === numeroSecreto) {
      mensagem = `Correto! Você acertou em ${novasTentativas} tentativas.`;
      await this.salvarScore(novasTentativas);
      this.resetar();
    } else if (palpiteNum < numeroSecreto) {
      mensagem = 'O número é maior';
    } else {
      mensagem = 'O número é menor';
    }
    this.setState({ resultado: mensagem, tentativas: novasTentativas, palpite: '' });
  };

  resetar = () => {
    this.setState({
      palpite: '',
      tentativas: 0,
      numeroSecreto: Math.floor(Math.random() * 100) + 1
    });
  };

  salvarScore = async (tentativas) => {
    const usuario = this.props.route.params?.usuario ?? 'anônimo';
    try {
      const key = `adivinhacao_${usuario}`;
      const antiga = await AsyncStorage.getItem(key);
      if (!antiga || tentativas < parseInt(antiga)) {
        await AsyncStorage.setItem(key, tentativas.toString());
      }
    } catch (e) {
      console.log('Erro ao salvar pontuação', e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Adivinhe o número</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite um número"
          keyboardType="numeric"
          value={this.state.palpite}
          onChangeText={(t) => this.setState({ palpite: t })}
        />
        <Button title="Chutar" onPress={this.verificarPalpite} />
        <Text style={styles.result}>{this.state.resultado}</Text>
        <Text style={styles.scoreText}>Tentativas: {this.state.tentativas}</Text>
      </View>
    );
  }
}

/* ================= JOGO PEDRA PAPEL TESOURA ================= */
class PedraPapelTesoura extends React.Component {
  constructor(props) {
    super(props);
    this.state = { usuarioVenceu: 0, botVenceu: 0, empates: 0, jogadas: 0, historico: [] };
  }

  jogar = async (escolha) => {
    if (this.state.jogadas >= 5) return;
    const opcoes = ['Pedra', 'Papel', 'Tesoura'];
    const bot = opcoes[Math.floor(Math.random() * 3)];
    let resultado = '';

    if (escolha === bot) resultado = 'Empate!';
    else if (
      (escolha === 'Pedra' && bot === 'Tesoura') ||
      (escolha === 'Papel' && bot === 'Pedra') ||
      (escolha === 'Tesoura' && bot === 'Papel')
    ) resultado = 'Você ganhou';
    else resultado = 'Você perdeu';

    this.setState(prev => ({
      historico: [...prev.historico, `Você: ${escolha} | Bot: ${bot} → ${resultado}`],
      usuarioVenceu: prev.usuarioVenceu + (resultado === 'Você ganhou' ? 1 : 0),
      botVenceu: prev.botVenceu + (resultado === 'Você perdeu' ? 1 : 0),
      empates: prev.empates + (resultado === 'Empate!' ? 1 : 0),
      jogadas: prev.jogadas + 1
    }), () => {
      if (this.state.jogadas === 5) this.finalizarJogo();
    });
  };

  finalizarJogo = async () => {
    let final = '';
    if (this.state.usuarioVenceu > this.state.botVenceu) final = 'Você venceu o jogo!';
    else if (this.state.usuarioVenceu < this.state.botVenceu) final = 'O Bot venceu o jogo!';
    else final = 'Empate no jogo!';
    alert(final);

    // salvar score
    const usuario = this.props.route.params?.usuario ?? 'anônimo';
    const scoreValue = this.state.usuarioVenceu;
    const key = `ppt_${usuario}`;
    try {
      const antiga = await AsyncStorage.getItem(key);
      if (!antiga || scoreValue > parseInt(antiga)) {
        await AsyncStorage.setItem(key, scoreValue.toString());
      }
    } catch (e) { console.log(e); }

    this.setState({ usuarioVenceu: 0, botVenceu: 0, empates: 0, jogadas: 0, historico: [] });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pedra, Papel ou Tesoura</Text>
        <View style={styles.row}>
          <Button title="Pedra" onPress={() => this.jogar('Pedra')} />
          <Button title="Papel" onPress={() => this.jogar('Papel')} />
          <Button title="Tesoura" onPress={() => this.jogar('Tesoura')} />
        </View>
        <ScrollView style={{ marginTop: 10, width: '90%' }}>
          {this.state.historico.map((l, i) => <Text key={i}>{l}</Text>)}
        </ScrollView>
        <Text>Você: {this.state.usuarioVenceu} | Bot: {this.state.botVenceu} | Empates: {this.state.empates}</Text>
      </View>
    );
  }
}

/* ================= SCORES ================= */
class Scores extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dados: [] };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.loadScores();
    });
  }

  componentWillUnmount() {
    if (this.focusListener) this.focusListener();
  }

  loadScores = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const pares = await AsyncStorage.multiGet(keys);
      const pontuacoes = pares
        .filter(([k]) => k.startsWith('adivinhacao_') || k.startsWith('ppt_'))
        .map(([k, v]) => ({
          usuario: k.split('_')[1],
          jogo: k.includes('adivinhacao_') ? 'Adivinhação' : 'PedraPapelTesoura',
          score: v
        }));
      this.setState({ dados: pontuacoes });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🏆 Scores</Text>
        {this.state.dados.length === 0 && <Text>Nenhum score salvo</Text>}
        {this.state.dados.map((s, i) => (
          <View key={i} style={styles.scoreCard}>
            <Text>{s.usuario}</Text>
            <Text>Jogo: {s.jogo}</Text>
            <Text>Pontuação: {s.score}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }
}

/* ================= TAB NAVIGATOR ================= */
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen name="Login" component={Login} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-account" color={color} size={size} /> }} />
        <Tab.Screen name="Cadastro" component={Cadastro} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-plus" color={color} size={size} /> }} />
        <Tab.Screen name="Menu" component={Menu} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="gamepad-variant" color={color} size={size} /> }} />
        <Tab.Screen name="Adivinhacao" component={Adivinhacao} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="help-circle-outline" color={color} size={size} /> }} />
        <Tab.Screen name="PedraPapelTesoura" component={PedraPapelTesoura} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="hand-rock-outline" color={color} size={size} /> }} />
        <Tab.Screen name="Scores" component={Scores} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="trophy" color={color} size={size} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/* ================= ESTILOS ================= */
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 2, borderColor: 'red', fontSize: 18, width: '80%', padding: 5, marginBottom: 10, borderRadius: 8, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  menuButton: { borderWidth: 2, borderColor: 'black', borderRadius: 8, marginBottom: 12, width: '80%', padding: 10, alignItems: 'center' },
  menuText: { fontSize: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 10 },
  result: { marginTop: 10, fontSize: 16, color: 'green' },
  scoreText: { marginTop: 8 },
  scoreCard: { borderWidth: 1, borderColor: '#888', borderRadius: 8, padding: 10, marginBottom: 10, width: '90%' }
});
