import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';

export default function App() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const FazerLogin = () => {
    const usuarioSalvo = localStorage.getItem("LoginCadastrado");
    const senhaSalva = localStorage.getItem("SenhaCadastrada");
    const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");

    const adminLogin = "Admin_@123";
    const adminSenha = "TechTrio";

    console.log("Login Digitado: ", login);
    console.log("Senha Digitada: ", senha);

    let usuarioEncontrado = pacientes.find(paciente => paciente.login === login && paciente.senha === senha);
    
    if (usuarioEncontrado || (login === adminLogin && senha === adminSenha)) {
      Alert.alert("Login realizado com Sucesso!");

      if (login === adminLogin && senha === adminSenha) {
        console.log("Redirecionando para a página de Administrador...");
        // Redirecionamento para página de Admin
      } else {
        // Redirecionamento para Controle Diário
      }
    } else {
      Alert.alert("Nome de usuário ou senha incorretos");
    }
  };

  const FazerCadastro = () => {
    // Redirecionamento para a página de Cadastro
  };

  return (
    <View style={styles.container}>
      <Image source={require('./path/to/NossoLarLogo.png')} style={styles.logo} />
      <Text style={styles.title}>Plataforma Online CEPIM</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Login:</Text>
        <TextInput
          style={styles.input}
          value={login}
          onChangeText={setLogin}
          placeholder="Digite seu Login"
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Digite sua Senha"
        />

        <TouchableOpacity style={styles.button} onPress={FazerLogin}>
          <Text style={styles.buttonText}>Fazer Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={FazerCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(240, 240, 240)',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: 'rgb(19, 3, 107)',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: 'black',
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: 'rgb(2, 2, 1)',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'rgb(139, 144, 155)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});
