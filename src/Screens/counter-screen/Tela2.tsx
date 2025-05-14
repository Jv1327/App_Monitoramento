import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function App() {
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
  const [motivoInternacao, setMotivoInternacao] = useState('');

  const maxCadastro = 1;

  const fazerCadastro = () => {
    if (!nome || !idade || !cpf || !rg || !dataNascimento || !identificacaoPaciente || !numLeito || !login || !senha) {
      Alert.alert("Preencha todos os campos obrigatórios.");
      return;
    }

    let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

    pacientes.push({
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
      motivoInternacao,
    });

    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    Alert.alert("Cadastro realizado com Sucesso!");

    localStorage.setItem("LoginCadastrado", login);
    localStorage.setItem("SenhaCadastrada", senha);

    setTimeout(() => {
      // Redirecionamento após cadastro (implementação de navegação)
      Alert.alert("Redirecionando para o login...");
    }, 2000); // 2000ms = 2 segundos
  };

  const limparCampos = () => {
    setNome('');
    setIdade('');
    setCpf('');
    setRg('');
    setDataNascimento('');
    setIdentificacaoPaciente('');
    setNumLeito('');
    setLogin('');
    setSenha('');
    setContatoEmergencia('');
    setNomeEmergencia('');
    setGrauParentesco('');
    setMotivoInternacao('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Pacientes</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome completo:</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Idade:</Text>
        <TextInput style={styles.input} value={idade} onChangeText={setIdade} keyboardType="numeric" />

        <Text style={styles.label}>CPF:</Text>
        <TextInput style={styles.input} value={cpf} onChangeText={setCpf} keyboardType="numeric" />

        <Text style={styles.label}>RG:</Text>
        <TextInput style={styles.input} value={rg} onChangeText={setRg} />

        <Text style={styles.label}>Data de Nascimento:</Text>
        <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} keyboardType="numeric" />

        <Text style={styles.label}>Identificação do Paciente:</Text>
        <TextInput style={styles.input} value={identificacaoPaciente} onChangeText={setIdentificacaoPaciente} keyboardType="numeric" />

        <Text style={styles.label}>Nº do Leito:</Text>
        <TextInput style={styles.input} value={numLeito} onChangeText={setNumLeito} keyboardType="numeric" />

        <Text style={styles.label}>Login:</Text>
        <TextInput style={styles.input} value={login} onChangeText={setLogin} />

        <Text style={styles.label}>Senha:</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

        <Text style={styles.label}>Contato de Emergência:</Text>
        <TextInput style={styles.input} value={contatoEmergencia} onChangeText={setContatoEmergencia} keyboardType="numeric" />

        <Text style={styles.label}>Nome do Contato de Emergência:</Text>
        <TextInput style={styles.input} value={nomeEmergencia} onChangeText={setNomeEmergencia} />

        <Text style={styles.label}>Grau de Parentesco:</Text>
        <TextInput style={styles.input} value={grauParentesco} onChangeText={setGrauParentesco} />

        <Text style={styles.label}>Motivo Internação:</Text>
        <TextInput
          style={styles.textarea}
          value={motivoInternacao}
          onChangeText={setMotivoInternacao}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={fazerCadastro}>
          <Text style={styles.buttonText}>Concluir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={limparCampos}>
          <Text style={styles.buttonText}>Limpar Campos</Text>
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
  title: {
    fontSize: 30,
    color: 'rgb(0, 0, 0)',
    marginBottom: 40,
    fontStyle: 'italic',
  },
  form: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: 'rgb(119, 93, 93)',
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: 'rgb(7, 5, 5)',
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
  textarea: {
    width: '80%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'rgb(73, 58, 7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'rgb(245, 255, 250)',
    fontSize: 16,
  },
});
