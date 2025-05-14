import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

export default function ControleDiario() {
  const [activeTab, setActiveTab] = useState('medicamentos');
  const [medicamentos, setMedicamentos] = useState([{ nome: 'Paracetamol', horario: '08:00' }]);
  const [refeicoes, setRefeicoes] = useState([{ nome: 'Café da Manhã', horario: '07:30' }]);
  const [atividades, setAtividades] = useState([{ nome: 'Exercício', horario: '10:00' }]);

  const [novoItem, setNovoItem] = useState({ nome: '', horario: '' });

  // Função para adicionar um novo item (Medicamento, Refeição ou Atividade)
  const adicionarItem = () => {
    if (!novoItem.nome || !novoItem.horario) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    if (activeTab === 'medicamentos') {
      setMedicamentos([...medicamentos, novoItem]);
    } else if (activeTab === 'refeicoes') {
      setRefeicoes([...refeicoes, novoItem]);
    } else if (activeTab === 'atividades') {
      setAtividades([...atividades, novoItem]);
    }

    setNovoItem({ nome: '', horario: '' });
  };

  // Função para alternar entre as abas
  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  // Função para renderizar a lista de itens de acordo com a aba ativa
  const renderTabContent = () => {
    let data = [];
    let title = '';
    if (activeTab === 'medicamentos') {
      data = medicamentos;
      title = 'Horários de Medicamentos';
    } else if (activeTab === 'refeicoes') {
      data = refeicoes;
      title = 'Horários de Refeições';
    } else if (activeTab === 'atividades') {
      data = atividades;
      title = 'Horários de Atividades';
    }

    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.nome}</Text>
              <Text style={styles.tableCell}>{item.horario}</Text>
            </View>
          )}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={novoItem.nome}
          onChangeText={(text) => setNovoItem({ ...novoItem, nome: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Horário"
          value={novoItem.horario}
          onChangeText={(text) => setNovoItem({ ...novoItem, horario: text })}
        />
        <Button title="Adicionar" onPress={adicionarItem} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => changeTab('medicamentos')}>
          <Text style={styles.tabText}>Medicamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => changeTab('refeicoes')}>
          <Text style={styles.tabText}>Refeições</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => changeTab('atividades')}>
          <Text style={styles.tabText}>Atividades</Text>
        </TouchableOpacity>
      </View>
      {renderTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0b22e',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#111',
    fontWeight: 'bold',
  },
  tabContent: {
    backgroundColor: '#d4d6d6',
    borderRadius: 10,
    padding: 20,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
