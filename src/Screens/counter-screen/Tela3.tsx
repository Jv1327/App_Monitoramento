import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';

// Função para criptografar a senha (substitui o btoa do navegador)
const encryptPassword = (password) => {
  return Buffer.from(password).toString('base64');
};

export default function AdminArea() {
  const [pacientes, setPacientes] = useState([]);
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const ADMIN_LOGIN = "Admin_@123";
  const ADMIN_SENHA = "TechTrio";

  useEffect(() => {
    carregarPacientes();
  }, []);

  // Função para carregar os pacientes da AsyncStorage
  const carregarPacientes = () => {
    const pacientesList = JSON.parse(localStorage.getItem('pacientes')) || [];
    setPacientes(pacientesList);
  };

  // Função para cadastrar um novo paciente
  const cadastrarPaciente = () => {
    if (!nome || !login || !senha) {
      Alert.alert('Por favor, preencha todos os campos');
      return;
    }

    const novosPacientes = [...pacientes, { nome, login, senha: encryptPassword(senha) }];
    localStorage.setItem('pacientes', JSON.stringify(novosPacientes));
    Alert.alert('Paciente cadastrado com sucesso!');
    setNome('');
    setLogin('');
    setSenha('');
    carregarPacientes();
  };

  // Função para editar um cadastro de paciente
  const editarCadastro = (index) => {
    const paciente = pacientes[index];
    setNome(paciente.nome);
    setLogin(paciente.login);
    setSenha(paciente.senha);
    setEditingIndex(index);
  };

  // Função para excluir um cadastro de paciente
  const excluirCadastro = (index) => {
    const loginAdm = prompt('Login do Adm: ');
    const senhaAdm = prompt('Senha do Adm: ');

    if (loginAdm === ADMIN_LOGIN && senhaAdm === ADMIN_SENHA) {
      const novosPacientes = pacientes.filter((_, i) => i !== index);
      localStorage.setItem('pacientes', JSON.stringify(novosPacientes));
      Alert.alert('Cadastro excluído com sucesso!');
      carregarPacientes();
    } else {
      Alert.alert('Acesso negado. Somente administrador pode excluir.');
    }
  };

  // Função para salvar a edição de um paciente
  const salvarEdicao = () => {
    if (!nome || !login || !senha) {
      Alert.alert('Por favor, preencha todos os campos');
      return;
    }

    const novosPacientes = [...pacientes];
    novosPacientes[editingIndex] = {
      nome,
      login,
      senha: encryptPassword(senha),
    };
    localStorage.setItem('pacientes', JSON.stringify(novosPacientes));
    Alert.alert('Cadastro atualizado com sucesso!');
    setNome('');
    setLogin('');
    setSenha('');
    setEditingIndex(null);
    carregarPacientes();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle do Administrador</Text>
      <FlatList
        data={pacientes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.pacienteRow}>
            <Text style={styles.pacienteText}>{item.nome}</Text>
            <Text style={styles.pacienteText}>{item.login}</Text>
            <Text style={styles.pacienteText}>******</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.button} onPress={() => editarCadastro(index)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => excluirCadastro(index)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Login"
          value={login}
          onChangeText={setLogin}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          secureTextEntry
          onChangeText={setSenha}
        />
        {editingIndex !== null ? (
          <Button title="Salvar Edição" onPress={salvarEdicao} />
        ) : (
          <Button title="Cadastrar Paciente" onPress={cadastrarPaciente} />
        )}
      </View>

      <Button title="Atualizar Lista" onPress={carregarPacientes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  pacienteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  pacienteText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#8F9691',
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#E7F0EB',
    fontSize: 14,
  },
  form: {
    marginTop: 20,
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
