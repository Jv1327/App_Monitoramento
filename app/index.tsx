import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    console.log('Botão "Fazer Login" pressionado!');
    console.log('Valor de login:', login);
    console.log('Valor de senha:', senha);

    if (!login.trim() || !senha.trim()) {
      console.log('Campos de login ou senha vazios!');
      Alert.alert('Erro', 'Por favor, preencha o login e a senha.');
      return; // Impede a execução do restante da função
    }

    const storedPacientes = await AsyncStorage.getItem('pacientes');
    const pacientes = storedPacientes ? JSON.parse(storedPacientes) : [];
    console.log('Pacientes do AsyncStorage:', pacientes);

    const adminLogin = 'Admin_@123';
    const adminSenha = 'TechTrio';

    const usuarioEncontrado = pacientes.find(
      (paciente) => paciente.login === login && paciente.senha === senha
    );
    console.log('Usuário encontrado:', usuarioEncontrado);

    if (usuarioEncontrado || (login === adminLogin && senha === adminSenha)) {
      console.log('Login realizado com sucesso!');

      if (login === adminLogin && senha === adminSenha) {
        console.log('Redirecionando para a página de Administrador...');
        router.push('/admin');
      } else if (usuarioEncontrado) {
        await AsyncStorage.setItem('nomePacienteLogado', usuarioEncontrado.nome);
        router.push('/dailycontrol');
      }
    } else {
      Alert.alert('Erro', 'Nome de usuário ou senha incorretos');
    }
  };

  const handleCadastro = () => {
    console.log('Botão "Cadastrar" pressionado!');
    router.push('/cadastro');
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldset}>
        <View style={styles.center}>
          <Image source={require('../../App-Final/assets/images/Nosso_Lar _remove.jpg')} style={styles.logo} />
          <Text style={styles.title}>Plataforma Online CEPIM</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Login:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setLogin}
              value={login}
              required
            />
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setSenha}
              value={senha}
              secureTextEntry
              required
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Fazer Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>

  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'rgba(253, 253, 253, 0.49)', // Um fundo cinza claro comum em interfaces iOS
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10, // Aumentar um pouco o padding horizontal

  },
  fieldset: {
    width: '100%', // Ocupar a largura disponível no container
    maxWidth: 350, // Largura máxima para telas maiores
    padding: 25,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fundo branco quase opaco
  },
  center: {
    alignItems: 'center',
  },
  logo: {
    width: 120, // Ajustar tamanho do logo
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28, // Ajustar tamanho do título
    textAlign: 'center',
    color: '#333', // Cor de texto mais escura
    marginBottom: 35,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    alignSelf: 'flex-start',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007aff', // Azul característico de botões iOS
    color: 'white',
    fontSize: 18,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cadastroButton: { // Estilo específico para o botão de cadastro
    backgroundColor: '#f0f0f0', // Um cinza claro para o botão secundário
    borderColor: '#ccc',
    borderWidth: 1,
  },
  cadastroButtonText: {
    color: '#333',
    fontWeight: 'normal',
  },
  buttonContainer: { // Container para organizar os botões (se necessário lado a lado)
    flexDirection: 'column', 
    width: '100%',
    marginTop: 15,
  },
  phoneWrapper: {
    width: 400,
    maxWidth: '100%',
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
});

export default LoginScreen;