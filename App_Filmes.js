import React from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: '',
      senha: ''
    };
  }

  fazerLogin = () => {
    const { usuario, senha } = this.state;

    const usuarioValido = 'gabi';
    const senhaValida = '1234';

    if (usuario === usuarioValido && senha === senhaValida) {
      this.props.navigation.navigate("Filmes");
    } else {
      alert("Usuário ou senha inválidos!");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={this.state.usuario}
          onChangeText={(texto) => this.setState({ usuario: texto })}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={this.state.senha}
          onChangeText={(texto) => this.setState({ senha: texto })}
        />
        <Button title="Entrar" onPress={this.fazerLogin} />
      </View>
    );
  }
}


class Filmes extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Página de Filmes</Text>
        <Text>{" "}</Text>
        <Button title="Senhor dos Anéis" onPress={() => this.goToPage("Senhor_dos_aneis")} />
        <Text>{" "}</Text>
        <Button title="Vingadores" onPress={() => this.goToPage("Vingadores")} />
      </View>
    );
  }

  // Função genérica para navegar para qualquer página
  goToPage = (pageName) => {
    this.props.navigation.navigate(pageName);
  };
}

class Senhor_dos_aneis extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Senhor dos Anéis</Text>
        <Text>{"O Senhor dos Anéis é uma épica história de fantasia criada por J.R.R. Tolkien. A trama acompanha Frodo Bolseiro, um jovem hobbit que herda o Um Anel, um artefato de imenso poder criado pelo maligno Sauron para dominar toda a Terra-média. Com a ajuda da Sociedade do Anel — formada por hobbits, humanos, um elfo, um anão e um mago — Frodo embarca em uma perigosa jornada para destruir o anel nas chamas da Montanha da Perdição, única forma de impedir que Sauron conquiste o mundo. A história é marcada por batalhas épicas, amizade, coragem e a eterna luta entre o bem e o mal. "}</Text>
        <Text>{" "} </Text>
        <Button title="Voltar" onPress={() => this.props.navigation.goBack()} />
      </View>
    );
  }
}

class Vingadores extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Vingadores</Text>
        <Text>{"Vingadores é um filme da Marvel que reúne diversos super-heróis icônicos, como Homem de Ferro, Capitão América, Thor, Hulk, Viúva Negra e Gavião Arqueiro, para enfrentar uma ameaça global. O vilão Loki tenta conquistar a Terra usando o poder de um artefato místico chamado Cetro, que contém a Joia da Mente. Para detê-lo, os heróis precisam superar suas diferenças e unir forças, formando a equipe conhecida como Os Vingadores. O filme mistura ação, aventura e humor, mostrando como a colaboração e a coragem podem salvar o mundo de um perigo iminente. "}</Text>
        <Text>{" "} </Text>
        <Button title="Voltar" onPress={() => this.props.navigation.goBack()} />
      </View>
    );
  }
}


class NavStack extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Filmes" component={Filmes} />
        <Stack.Screen name="Senhor_dos_aneis" component={Senhor_dos_aneis} />
        <Stack.Screen name="Vingadores" component={Vingadores} />
        <Stack.Screen name="Sinopses" component={Sinopses} />
      </Stack.Navigator>
    );
  }
}

class Sinopses extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Sinopses de Filmes</Text>
        <Text>{" VINGADORES "}</Text>
        <Text>{"Vingadores é um filme da Marvel que reúne diversos super-heróis icônicos, como Homem de Ferro, Capitão América, Thor, Hulk, Viúva Negra e Gavião Arqueiro, para enfrentar uma ameaça global. O vilão Loki tenta conquistar a Terra usando o poder de um artefato místico chamado Cetro, que contém a Joia da Mente. Para detê-lo, os heróis precisam superar suas diferenças e unir forças, formando a equipe conhecida como Os Vingadores. O filme mistura ação, aventura e humor, mostrando como a colaboração e a coragem podem salvar o mundo de um perigo iminente. "}</Text>
        <Text>{" "} </Text>
        <Text>{" SENHOR DOS ANÉIS "} </Text>
        <Text>{"O Senhor dos Anéis é uma épica história de fantasia criada por J.R.R. Tolkien. A trama acompanha Frodo Bolseiro, um jovem hobbit que herda o Um Anel, um artefato de imenso poder criado pelo maligno Sauron para dominar toda a Terra-média. Com a ajuda da Sociedade do Anel — formada por hobbits, humanos, um elfo, um anão e um mago — Frodo embarca em uma perigosa jornada para destruir o anel nas chamas da Montanha da Perdição, única forma de impedir que Sauron conquiste o mundo. A história é marcada por batalhas épicas, amizade, coragem e a eterna luta entre o bem e o mal. "}</Text>
      </View>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="LoginStack"
            component={NavStack}
            options={{
              tabBarLabel: "Login",
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="login" color={color} size={size} />
              )
            }}
          />
          <Tab.Screen
            name="SinopsesTab"
            component={Sinopses}
            options={{
              tabBarLabel: "Sinópses",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="movie-open" color={color} size={size} />
    )
  }}
/>
          
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  titulo: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold"
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  }
});
