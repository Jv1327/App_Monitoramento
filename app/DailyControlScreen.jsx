import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, ScrollView, FlatList, Alert } from 'react-native';
import { Modal, TextInput, Button } from 'react-native-paper';
import { Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const DailyControlScreen = () => {
  const [activeTab, setActiveTab] = useState('medicamentos');
  const [nomePaciente, setNomePaciente] = useState('');
  const router = useRouter();

  // Estados para controlar o modal de adicionar
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [novoItemNome, setNovoItemNome] = useState('');
  const [novoItemHorario, setNovoItemHorario] = useState('');

  // Estados para controlar o modal de editar
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [editarNome, setEditarNome] = useState('');
  const [editarHorario, setEditarHorario] = useState('')

  const [medicamentosData, setMedicamentosData] = useState([
    { id: '1', nome: 'Paracetamol', horario: '08:00' },
    // Adicione mais medicamentos aqui
  ]);

  const [refeicoesData, setRefeicoesData] = useState([
    { id: '1', nome: 'Café da Manhã', horario: '07:30' },
    // Adicione mais refeições aqui
  ]);

  const [atividadesData, setAtividadesData] = useState([
    { id: '1', nome: 'Exercício', horario: '10:00' },
    // Adicione mais atividades aqui
  ]);

  useEffect(() => {
    const getNomePaciente = async () => {
      console.log('AsyncStorage:', AsyncStorage);
      const nome = await AsyncStorage.getItem('nomePacienteLogado');
      if (nome) {
        setNomePaciente(nome);
      }
    };

    getNomePaciente();
  }, []);

  const getData = () => {
    if (activeTab === 'medicamentos') return medicamentosData;
    if (activeTab === 'refeicoes') return refeicoesData;
    if (activeTab === 'atividades') return atividadesData;
    return [];
  };

  const setData = (newData) => {
    if (activeTab === 'medicamentos') setMedicamentosData(newData);
    if (activeTab === 'refeicoes') setRefeicoesData(newData);
    if (activeTab === 'atividades') setAtividadesData(newData);
  };

  const openAddModal = () => {
    setIsAddModalVisible(true);
    setNovoItemNome('');
    setNovoItemHorario('');
  };

  const closeAddModal = () => {
    setIsAddModalVisible(false);
  };

  const adicionarItem = () => {
    if (novoItemNome.trim() && novoItemHorario.trim()) {
      const newItem = {
        id: String(Date.now()),
        nome: novoItemNome.trim(),
        horario: novoItemHorario.trim(),
      };
      setData([...getData(), newItem]);
      closeAddModal();

    } else {
      Alert.alert('Erro', 'Por favor, preencha o nome e o horário.');
    }
  };

  const openEditModal = (item) => {
    setItemParaEditar(item);
    setEditarNome(item.nome);
    setEditarHorario(item.horario);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setItemParaEditar(null);
  };

  const editarItem = () => {
    if (itemParaEditar && editarNome.trim() && editarHorario.trim()) {
      const newData = getData().map((item) =>
        item.id === itemParaEditar.id
          ? { ...item, nome: editarNome.trim(), horario: editarHorario.trim() }
          : item
      );
      setData(newData);
      closeEditModal();

    } else {
      Alert.alert('Erro', 'Por favor, preencha o nome e o horário.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.nome}</Text>
      <Text style={styles.tableCell}>{item.horario}</Text>
      <TouchableOpacity onPress={() => openEditModal(item)}>
        <Text style={{ color: 'white', borderRadius: '40%' }}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  const handleBack = async () => {
    try {
      await AsyncStorage.removeItem('nomePacienteLogado');
      console.log('Nome do paciente logado removido.');
      router.push('/'); // Redireciona para a tela de login
    } catch (error) {
      console.error('Erro ao remover nome do paciente logado:', error);
      Alert.alert('Erro', 'Houve um problema ao sair.');
    }
  };

  const handleNext = () => {
    router.push('/OrientacoesMedicas'); // Navega para a tela de OrientacoesMedicas.jsx
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {nomePaciente ? (
          <Text style={styles.saudacao}> Olá, {nomePaciente}!</Text>
        ) : (
          <Text style={styles.saudacao}> Seja Bem Vindo(a) ao controle diário! </Text>
        )}

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'medicamentos' && styles.activeTab]}
            onPress={() => setActiveTab('medicamentos')}
          >
            <Text style={styles.tabText}>Medicamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'refeicoes' && styles.activeTab]}
            onPress={() => setActiveTab('refeicoes')}
          >
            <Text style={styles.tabText}>Refeições</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'atividades' && styles.activeTab]}
            onPress={() => setActiveTab('atividades')}
          >
            <Text style={styles.tabText}>Atividades</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            {activeTab === 'medicamentos'
              ? 'Horários de Medicamentos'
              : activeTab === 'refeicoes'
                ? 'Horários de Refeições'
                : 'Horários de Atividades'}
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Nome</Text>
              <Text style={styles.tableHeaderCell}>Horário</Text>
              <Text style={styles.tableHeaderCell}>Ações</Text>
            </View>
            <FlatList
              data={getData()}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de Adicionar */}
        <Modal visible={isAddModalVisible} onDismiss={closeAddModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar {activeTab === 'medicamentos' ? 'Medicamento' : activeTab === 'refeicoes' ? 'Refeição' : 'Atividade'}</Text>
            <TextInput
              label="Nome"
              value={novoItemNome}
              onChangeText={setNovoItemNome}
              style={styles.modalInput}
            />
            <TextInput
              label="Horário"
              value={novoItemHorario}
              onChangeText={setNovoItemHorario}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <Button onPress={closeAddModal}>Cancelar</Button>
              <Button onPress={adicionarItem}>Salvar</Button>
            </View>
          </View>
        </Modal>

        {/* Modal de Editar */}
        <Modal visible={isEditModalVisible} onDismiss={closeEditModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar {activeTab === 'medicamentos' ? 'Medicamento' : activeTab === 'refeicoes' ? 'Refeição' : 'Atividade'}</Text>
            <TextInput
              label="Nome"
              value={editarNome}
              onChangeText={setEditarNome}
              style={styles.modalInput}
            />
            <TextInput
              label="Horário"
              value={editarHorario}
              onChangeText={setEditarHorario}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <Button onPress={closeEditModal}>Cancelar</Button>
              <Button onPress={editarItem}>Salvar</Button>
            </View>
          </View>
        </Modal>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.bottomButtonLeft} onPress={handleBack}>
            <Text style={styles.bottomButtonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButtonRight} onPress={handleNext}>
            <Text style={styles.bottomButtonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    borderRadius: 30,
    alingnConteiner: 'center',
    flex: 1,
    justifyContent: 'space-between', // Altera para space-between para empurrar os botões para o final
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(221, 184, 63, 0.93)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%', // Aumentei a largura para melhor visualização
    marginBottom: 20, // Adicionei margem inferior para separar do conteúdo
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent', // Cor padrão da borda inferior
  },
  activeTab: {
    borderBottomColor: 'rgba(209, 45, 45, 0.85)',
  },
  tabText: {
    color: 'rgba(10, 10, 4, 0.85)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 25,
    flexDirection: 'column',
    alingnConteiner: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%', // Aumentei a largura para melhor visualização
    marginBottom: 20, // Adicionei margem inferior para separar dos botões
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(238, 237, 232)',
    textAlign: 'center',
    marginBottom: 15,
  },
  table: {
    width: '100%',
    marginTop: 12,
    borderColor: '#b4a8a8',
    borderWidth: 4,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 15, // Adicionei margem inferior para separar do botão "Adicionar"
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgb(201, 183, 18)',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(19, 13, 13)',
    borderRightWidth: 2,
    borderColor: 'rgb(141, 139, 139)',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderColor: '#rgb(216, 206, 207)',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    color: 'rgb(250, 233, 233)',
    borderRightWidth: 2,
    borderColor: 'rgb(170, 165, 165)',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 15,
  },
  addButton: {
    backgroundColor: 'rgba(28, 209, 12, 0.87)',
    color: 'rgb(211, 18, 18)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
    marginBottom: 20, // Adicionei mais margem inferior para separar dos botões de navegação
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'rgb(0, 0, 0)',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInput: {
    marginBottom: 15,
    backgroundColor: 'rgb(231, 187, 187)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    backgroundColor: 'rgb(19, 20, 16)',
    color: 'rgb(241, 231, 231)',
  },
  safeArea: {
    flex: 1,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '100%',
  },
  bottomButtonLeft: {
    backgroundColor: 'gray',
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
    minWidth: '40%', // Garante uma largura mínima para os botões
    alignItems: 'center',
  },
  bottomButtonRight: {
    backgroundColor: 'rgb(73, 58, 7)',
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
    minWidth: '40%', // Garante uma largura mínima para os botões
    alignItems: 'center',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saudacao: {
    fontSize: 18,
    color: 'rgb(238, 237, 232)',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default DailyControlScreen;