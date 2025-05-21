import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const LoginScreen = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    console.log('Botão "Fazer Login" pressionado!');
    console.log('Valor de login:', login);
    console.log('Valor de senha:', senha);

    if (!login.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o login e a senha.');
      return;
    }

    const storedPacientes = await AsyncStorage.getItem('pacientes');
    const pacientes = storedPacientes ? JSON.parse(storedPacientes) : [];

    const adminLogin = 'Admin_@123';
    const adminSenha = 'TechTrio';

    const usuarioEncontrado = pacientes.find(
      (paciente) => paciente.login === login && paciente.senha === senha
    );

    if (usuarioEncontrado || (login === adminLogin && senha === adminSenha)) {
      if (login === adminLogin && senha === adminSenha) {
        router.push('/admin');
      } else {
        await AsyncStorage.setItem('nomePacienteLogado', usuarioEncontrado.nome);
        router.push('/dailycontrol');
      }
    } else {
      Alert.alert('Erro', 'Nome de usuário ou senha incorretos');
    }
  };

  const handleCadastro = () => {
    router.push('/cadastro');
  };

  const handleBiometricAuth = async () => {
    const isHardwareSupported = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isHardwareSupported || !isEnrolled) {
      Alert.alert('Biometria não disponível', 'Seu dispositivo não suporta ou não tem biometria cadastrada.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para continuar',
      fallbackLabel: 'Usar senha',
      disableDeviceFallback: true,
    });

    if (result.success) {
      Alert.alert('Sucesso', 'Autenticação biométrica realizada com sucesso!');
      router.push('/dailycontrol');
    } else {
      Alert.alert('Falha', 'Autenticação biométrica falhou ou foi cancelada.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldset}>
        <View style={styles.center}>
          <Image source={require('../../App_Monitoramento/assets/images/Nosso_Lar _remove.jpg')} style={styles.logo} />
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
            <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
              <Text style={styles.buttonText}>Entrar com Biometria</Text>
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
    backgroundColor: 'rgba(253, 253, 253, 0.49)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  fieldset: {
    width: '100%',
    maxWidth: 350,
    padding: 25,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  center: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: '#333',
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
    backgroundColor: '#007aff',
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
});

export default LoginScreen;