import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';


const TelaResumoPaciente = () => {
    const [paciente, setPaciente] = useState(null);
    const [medicoes, setMedicoes] = useState({});
    const [lembretes, setLembretes] = useState({});
    const router = useRouter();

    useEffect(() => {
        carregarDadosPaciente();
        carregarMedicoes();
        carregarLembretes();
    }, []);

    const carregarDadosPaciente = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setPaciente(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Erro ao carregar dados do paciente:', error);
        }
    };

    const carregarMedicoes = async () => {
        try {
            const storedMedicoes = await AsyncStorage.getItem('medicoes');
            if (storedMedicoes) {
                setMedicoes(JSON.parse(storedMedicoes));
            }
        } catch (error) {
            console.error('Erro ao carregar medições:', error);
        }
    };

    const carregarLembretes = async () => {
        try {
            const storedLembretes = await AsyncStorage.getItem('lembretes');
            if (storedLembretes) {
                setLembretes(JSON.parse(storedLembretes));
            }
        } catch (error) {
            console.error('Erro ao carregar lembretes:', error);
        }
    };

    // Função para obter a última medição de pressão
    const getUltimaMedicao = () => {
        if (Object.keys(medicoes).length === 0) {
            return 'Nenhuma medição registrada';
        }
        // Ordena as medições por data, do mais recente para o mais antigo
        const medicoesOrdenadas = Object.entries(medicoes).sort(([aKey], [bKey]) => {
            const dateA = parseISO(aKey);
            const dateB = parseISO(bKey);
            return dateB - dateA;
        });
        const ultimaMedicao = medicoesOrdenadas[0][1]; // Pega a primeira medição (mais recente)
        return `${ultimaMedicao.sistolica} / ${ultimaMedicao.diastolica} mmHg em ${ultimaMedicao.data}`;
    };

    // Função para obter o próximo lembrete
    const getProximoLembrete = () => {
        if (Object.keys(lembretes).length === 0) {
            return 'Nenhum lembrete registrado';
        }

        const lembretesOrdenados = Object.entries(lembretes).sort(([aKey]) => parseISO(aKey));

        const agora = new Date();
        for (const [key, lembrete] of lembretesOrdenados) {
            const dataLembrete = parseISO(key);
            if (dataLembrete >= agora) {
                return `${lembrete.texto} em ${lembrete.data}`;
            }
        }
        return 'Nenhum lembrete futuro';
    };

    const goToControlePressao = () => {
        router.push('/controlepresao');
    };

    const goToInfoFamiliar = () => {
        router.push('/InfoFamilia');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Resumo do Paciente</Text>

                    {paciente && (
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Nome do Paciente:</Text>
                            <Text style={styles.infoText}>{paciente.nome}</Text>

                            <Text style={styles.label}>Login:</Text>
                            <Text style={styles.infoText}>{paciente.login}</Text>
                        </View>
                    )}

                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Última Medição de Pressão:</Text>
                        <Text style={styles.infoText}>{getUltimaMedicao()}</Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Próximo Lembrete:</Text>
                        <Text style={styles.infoText}>{getProximoLembrete()}</Text>
                    </View>

                    {/* Adicione mais informações conforme necessário */}
                </View>
            </ScrollView>
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity style={styles.bottomButtonLeft} onPress={goToControlePressao}>
                    <Text style={styles.bottomButtonText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButtonRight} onPress={goToInfoFamiliar}>
                    <Text style={styles.bottomButtonText}>Próximo</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    scrollContainer: {
        flex: 1,
        padding: 20,
    },
    formContainer: {
        flex: 1,
        alignItems: 'stretch',
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'rgb(115, 117, 115)',
    },
    infoContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'rgb(7, 5, 5)',
    },
    infoText: {
        fontSize: 16,
        color: 'rgb(7, 5, 5)',
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    bottomButtonLeft: {
        backgroundColor: 'gray',
        color: 'white',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-start',
        minWidth: '40%',
        alignItems: 'center',
    },
    bottomButtonRight: {
        backgroundColor: 'rgb(73, 58, 7)',
        color: 'white',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
        minWidth: '40%',
        alignItems: 'center',
    },
    bottomButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TelaResumoPaciente;