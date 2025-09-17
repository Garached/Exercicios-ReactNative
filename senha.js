import React from "react";
import { Text, TextInput, Button, View, StyleSheet, Alert } from 'react-native';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      senha1: '',
      senha2: '',
      resultado: ''
    };
  }

  verificarSenhas() {
    if (this.state.senha1 === this.state.senha2 && this.state.senha1 !== '') {
      this.setState({resultado: "Senhas conferem"});
    } else {
      this.setState({resultado: "Senhas não conferem"});
    }
  }

  render() {
    return (
      <View style={estilos.container}>
        <Text style={estilos.texto}>Senha 1:</Text>
        <TextInput
          style={estilos.caixa}
          secureTextEntry={true}  
          onChangeText={(text)=>this.setState({senha1: text})}
        />

        <Text style={estilos.texto}>Senha 2:</Text>
        <TextInput
          style={estilos.caixa}
          secureTextEntry={true}  
          onChangeText={(text)=>this.setState({senha2: text})}
        />

        <View style={estilos.botoes}>
          <Button title="Verificar" onPress={()=>this.verificarSenhas()} />
        </View>

        <Text style={estilos.resultado}>{this.state.resultado}</Text>
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
  caixa: {
    borderWidth: 2,
    borderColor: 'red',
    fontSize: 30,
    width: '50%',
    padding: 5,
    marginBottom: 10
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center'
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
    marginBottom: 20
  },
  resultado: {
    color: 'green',
    fontSize: 30,
    marginTop: 20
  }
});

export default App;
