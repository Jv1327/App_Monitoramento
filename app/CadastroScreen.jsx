import React, { useState } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, ScrollView, Alert, Image,} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CadastroScreen = () => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [identificacaoPaciente, setIdentificacaoPaciente] = useState('');
  const [numLeito, setNumLeito] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [contatoEmergencia, setContatoEmergencia] = useState('');
  const [nomeEmergencia, setNomeEmergencia] = useState('');
  const [grauParentesco, setGrauParentesco] = useState('');
  const [motivo, setMotivo] = useState('');
  const router = useRouter();

  const fazerCadastro = async () => {
    if (!nome || !idade || !cpf || !rg || !dataNascimento || !identificacaoPaciente || !numLeito || !login || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const novoPaciente = {
      nome,
      idade,
      cpf,
      rg,
      dataNascimento,
      identificacaoPaciente,
      numLeito,
      login,
      senha,
      contatoEmergencia,
      nomeEmergencia,
      grauParentesco,
      motivo,
    };

    try {
      const storedPacientes = await AsyncStorage.getItem('pacientes');
      const pacientes = storedPacientes ? JSON.parse(storedPacientes) : [];
      pacientes.push(novoPaciente);
      await AsyncStorage.setItem('pacientes', JSON.stringify(pacientes));
      await AsyncStorage.setItem('LoginCadastrado', login);
      await AsyncStorage.setItem('SenhaCadastrada', senha);
      Alert.alert('Sucesso', 'Cadastro realizado com Sucesso!');
      router.push('/'); // Redireciona para a tela de login (rota '/')
    } catch (error) {
      Alert.alert('Erro ao cadastrar', 'Houve um problema ao salvar os dados.');
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const voltar = () => {
    router.push('/'); // Redireciona para a tela de login (rota '/')
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.fieldset}>
            <Text style={styles.title}>Cadastro de Pacientes</Text>
            <View style={styles.form}>
              <Text style={styles.label}>Nome completo:</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} required />

              <Text style={styles.label}>Idade:</Text>
              <TextInput style={styles.input} value={idade} onChangeText={setIdade} keyboardType="number-pad" required />

              <Text style={styles.label}>CPF:</Text>
              <TextInput style={styles.input} value={cpf} onChangeText={setCpf} pattern="\d{11}" required />

              <Text style={styles.label}>RG:</Text>
              <TextInput style={styles.input} value={rg} onChangeText={setRg} pattern="\d{7,9}" required />

              <Text style={styles.label}>Data de Nascimento:</Text>
              <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} placeholder="AAAA-MM-DD" required />

              <Text style={styles.label}>Identificação do Paciente:</Text>
              <TextInput style={styles.input} value={identificacaoPaciente} onChangeText={setIdentificacaoPaciente} keyboardType="number-pad" required />

              <Text style={styles.label}>Nº do Leito:</Text>
              <TextInput style={styles.input} value={numLeito} onChangeText={setNumLeito} keyboardType="number-pad" required />

              <Text style={styles.label}>Login:</Text>
              <TextInput style={styles.input} value={login} onChangeText={setLogin} required />

              <Text style={styles.label}>Senha:</Text>
              <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry required />

              <Text style={styles.label}>Contato de Emergência:</Text>
              <TextInput style={styles.input} value={contatoEmergencia} onChangeText={setContatoEmergencia} keyboardType="phone-pad" pattern="\d{8,11}" />

              <Text style={styles.label}>Nome do Contato de Emergência:</Text>
              <TextInput style={styles.input} value={nomeEmergencia} onChangeText={setNomeEmergencia} />

              <Text style={styles.label}>Grau de Parentesco:</Text>
              <TextInput style={styles.input} value={grauParentesco} onChangeText={setGrauParentesco} />

              <Text style={styles.label}>Motivo Internação:</Text>
              <TextInput
                style={styles.textarea}
                multiline
                value={motivo}
                onChangeText={setMotivo}
              />

              <TouchableOpacity style={styles.buttonConcluir} onPress={fazerCadastro}>
                <Text style={styles.buttonText}>Concluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonVoltar} onPress={voltar}>
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20, // Adicione padding vertical para rolar
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    width: '200%', // Ajuste a largura conforme necessário
    maxWidth: 600, // Defina uma largura máxima
  },
  fieldset: {
    borderWidth: 3,
    borderColor: 'rgb(70, 16, 16)',
    padding: 20,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: 'rgb(0, 0, 0)',
    fontStyle: 'oblique',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'rgb(7, 5, 5)',
    fontStyle: 'oblique',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(185, 218, 218, 0.925)',
    textAlign: 'center',
    fontSize: 16,
  },
  textarea: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(185, 218, 218, 0.925)',
    textAlignVertical: 'top', // Para começar o texto do topo
    fontSize: 16,
  },
  buttonConcluir: {
    backgroundColor: 'rgb(99, 77, 5)',
    color: 'rgb(245, 255, 250)',
    fontSize: 16,
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonVoltar: {
    backgroundColor: 'gray',
    color: 'rgb(245, 255, 250)',
    fontSize: 16,
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default CadastroScreen;