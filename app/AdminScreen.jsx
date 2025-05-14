import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = () => {
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const ADMIN_LOGIN = 'Admin_@123';
  const ADMIN_SENHA = 'TechTrio';

  // Estados para controlar o modal de autenticação
  const [modalVisible, setModalVisible] = useState(false);
  const [adminLoginInput, setAdminLoginInput] = useState('');
  const [adminSenhaInput, setAdminSenhaInput] = useState('');
  const [actionIndex, setActionIndex] = useState(null);
  const [actionType, setActionType] = useState(null); // 'excluir' ou 'editar'
  const [pacienteParaEditar, setPacienteParaEditar] = useState(null);

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      const storedPacientes = await AsyncStorage.getItem('pacientes');
      if (storedPacientes) {
        setPacientes(JSON.parse(storedPacientes));
      } else {
        setPacientes([]);
      }
    } catch (error) {
      Alert.alert('Erro ao carregar pacientes', 'Houve um problema ao ler os dados.');
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const buscarPaciente = () => {
    if (searchTerm) {
      const results = pacientes.filter(
        (paciente) =>
          paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paciente.login.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]); // Limpa os resultados se o termo de busca estiver vazio
    }
  };

  const openAuthModal = (index, type) => {
    setActionIndex(index);
    setActionType(type);
    setModalVisible(true);
    setAdminLoginInput('');
    setAdminSenhaInput('');
  };

  const closeAuthModal = () => {
    setModalVisible(false);
    setActionIndex(null);
    setActionType(null);
    setPacienteParaEditar(null);
  };

  const handleAdminAuth = () => {
    if (adminLoginInput === ADMIN_LOGIN) {
      if (adminSenhaInput === ADMIN_SENHA) {
        closeAuthModal();
        if (actionType === 'excluir') {
          confirmarExclusao(actionIndex, searchTerm ? searchResults : pacientes);
        } else if (actionType === 'editar') {
          abrirModalEditar(actionIndex);
        }
      } else {
        Alert.alert('Acesso Negado', 'Senha do Administrador incorreta.');
      }
    } else {
      Alert.alert('Acesso Negado', 'Login do Administrador incorreto.');
    }
  };

  const excluirCadastro = async (index, listaPacientes) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este cadastro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmarExclusao(index, listaPacientes),
        },
      ]
    );
  };

  const confirmarExclusao = async (index, listaPacientes) => {
    try {
      const storedPacientes = await AsyncStorage.getItem('pacientes');
      const pacientesAtuais = storedPacientes ? JSON.parse(storedPacientes) : [];
      const pacienteParaExcluir = listaPacientes[index];
      const novaListaPacientes = pacientesAtuais.filter(
        (paciente) => paciente.login !== pacienteParaExcluir.login
      );
      await AsyncStorage.setItem('pacientes', JSON.stringify(novaListaPacientes));
      Alert.alert('Sucesso', 'Cadastro excluído com sucesso!');
      carregarPacientes();
      setSearchResults([]); // Limpa os resultados da busca após exclusão
      setSearchTerm('');
    } catch (error) {
      Alert.alert('Erro ao excluir', 'Houve um problema ao remover o paciente.');
      console.error('Erro ao excluir paciente:', error);
    }
  };

  // Estados para controlar o modal de edição
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [nomeEditar, setNomeEditar] = useState('');
  const [loginEditar, setLoginEditar] = useState('');
  const [senhaEditar, setSenhaEditar] = useState('');

  const abrirModalEditar = (index) => {
    const paciente = searchTerm ? searchResults[index] : pacientes[index];
    if (paciente) {
      setPacienteParaEditar(paciente);
      setNomeEditar(paciente.nome);
      setLoginEditar(paciente.login);
      setSenhaEditar(''); // Limpar a senha para edição
      setModalEditarVisible(true);
    }
  };

  const fecharModalEditar = () => {
    setModalEditarVisible(false);
    setPacienteParaEditar(null);
    setNomeEditar('');
    setLoginEditar('');
    setSenhaEditar('');
  };

  const handleAtualizarPaciente = async () => {
    if (!pacienteParaEditar) return;

    try {
      const storedPacientes = await AsyncStorage.getItem('pacientes');
      const pacientesAtuais = storedPacientes ? JSON.parse(storedPacientes) : [];
      const novaListaPacientes = pacientesAtuais.map((paciente) => {
        if (paciente.login === pacienteParaEditar.login) {
          return {
            ...paciente,
            nome: nomeEditar,
            login: loginEditar,
            ...(senhaEditar ? { senha: btoa(senhaEditar) } : {}),
          };
        }
        return paciente;
      });
      await AsyncStorage.setItem('pacientes', JSON.stringify(novaListaPacientes));
      Alert.alert('Sucesso', 'Cadastro atualizado com sucesso!');
      carregarPacientes();
      setSearchResults([]);
      setSearchTerm('');
      fecharModalEditar();
    } catch (error) {
      Alert.alert('Erro ao atualizar', 'Houve um problema ao salvar as alterações.');
      console.error('Erro ao atualizar paciente:', error);
    }
  };

  const listaExibida = searchTerm ? searchResults : pacientes;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle do Administrador</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou login"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={buscarPaciente}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Nome</Text>
            <Text style={styles.headerCell}>Login</Text>
            <Text style={styles.headerCell}>Senha</Text>
            <Text style={styles.headerCell}>Ações</Text>
          </View>
          {listaExibida.map((paciente, index) => (
            <View key={index} style={styles.dataRow}>
              <Text style={styles.dataCell}>{paciente.nome}</Text>
              <Text style={styles.dataCell}>{paciente.login}</Text>
              <Text style={styles.dataCell}>*******</Text>
              <View style={styles.actionsCell}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openAuthModal(index, 'editar')}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => openAuthModal(index, 'excluir')}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {searchTerm && searchResults.length === 0 && (
            <Text style={styles.noResults}>Nenhum paciente encontrado.</Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.refreshButton} onPress={carregarPacientes}>
        <Text style={styles.buttonText}>Atualizar Lista</Text>
      </TouchableOpacity>

      {/* Modal de Autenticação do Administrador */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeAuthModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Autenticação de Administrador</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Login do Administrador"
              value={adminLoginInput}
              onChangeText={setAdminLoginInput}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Senha do Administrador"
              secureTextEntry
              value={adminSenhaInput}
              onChangeText={setAdminSenhaInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={closeAuthModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitButton} onPress={handleAdminAuth}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Edição de Paciente */}
      <Modal
        visible={modalEditarVisible}
        transparent
        animationType="slide"
        onRequestClose={fecharModalEditar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Paciente</Text>
            <Text style={styles.modalLabel}>Nome:</Text>
            <TextInput
              style={styles.modalInput}
              value={nomeEditar}
              onChangeText={setNomeEditar}
            />
            <Text style={styles.modalLabel}>Login:</Text>
            <TextInput
              style={styles.modalInput}
              value={loginEditar}
              onChangeText={setLoginEditar}
            />
            <Text style={styles.modalLabel}>Nova Senha (opcional):</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry
              value={senhaEditar}
              onChangeText={setSenhaEditar}
              placeholder="Deixe em branco para manter a senha atual"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={fecharModalEditar}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitButton} onPress={handleAtualizarPaciente}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'rgb(115, 117, 115)',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: 'rgb(73, 58, 7)',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  table: {
    width: '100%',
    marginBottom: 20,
    borderColor: 'rgb(253, 253, 253)',
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgb(115, 117, 115)',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    color: 'rgb(236, 227, 233)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgb(253, 253, 253)',
  },
  dataCell: {
    flex: 1,
    textAlign: 'center',
    color: 'rgb(7, 5, 5)',
  },
  actionsCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'rgb(143, 150, 145)',
    color: 'rgb(231, 240, 235)',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: 'rgb(220, 53, 69)',
    color: 'rgb(231, 240, 235)',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  refreshButton: {
    backgroundColor: 'gray',
    color: 'rgb(231, 240, 235)',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 10,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalCancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  modalSubmitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
});

export default AdminScreen;