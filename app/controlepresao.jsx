import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'react-native-calendars';

const ControlePressaoScreen = () => {
    const [dataMedicao, setDataMedicao] = useState('');
    const [pressaoArterial, setPressaoArterial] = useState('');
    const [saturacao, setSaturacao] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [medicoes, setMedicoes] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const router = useRouter();

    useEffect(() => {
        carregarMedicoes();
    }, []);

    const salvarMedicao = async () => {
        if (!dataMedicao) {
            Alert.alert('Erro', 'Por favor, selecione a data da medição.');
            return;
        }
        if (!pressaoArterial.trim() || !saturacao.trim()) {
            Alert.alert('Erro', 'Por favor, insira os valores de pressão arterial e saturação.');
            return;
        }

        const key = dataMedicao;

        const novaMedicao = {
            data: dataMedicao,
            pressaoArterial: pressaoArterial,
            saturacao: saturacao,
            observacoes: observacoes,
        };

        try {
            const storedMedicoes = await AsyncStorage.getItem('medicoes');
            const medicoesAtuais = storedMedicoes ? JSON.parse(storedMedicoes) : {};

            medicoesAtuais[key] = novaMedicao;

            await AsyncStorage.setItem('medicoes', JSON.stringify(medicoesAtuais));
            Alert.alert('Sucesso', 'Medição de pressão arterial salva com sucesso!');
            setMedicoes(medicoesAtuais);
            limparFormulario();
            carregarMedicoes();
        } catch (error) {
            Alert.alert('Erro', 'Houve um problema ao salvar a medição.');
            console.error('Erro ao salvar medição:', error);
        }
    };

    const carregarMedicoes = async () => {
        try {
            const storedMedicoes = await AsyncStorage.getItem('medicoes');
            if (storedMedicoes) {
                setMedicoes(JSON.parse(storedMedicoes));
            } else {
                setMedicoes({});
            }
        } catch (error) {
            Alert.alert('Erro ao carregar', 'Houve um problema ao carregar as medições de pressão.');
            console.error('Erro ao carregar medições:', error);
        }
    };

    const limparFormulario = () => {
        setDataMedicao('');
        setPressaoArterial('');
        setSaturacao('');
        setObservacoes('');
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleDateSelect = (date) => {
        const formattedDate = format(parseISO(date.dateString), 'dd/MM/yyyy', { locale: ptBR });
        setDataMedicao(formattedDate);
        setSelectedDate(date.dateString);
        setShowCalendar(false);
    };

    const getMarkedDates = () => {
        const marked = {};
        for (const key in medicoes) {
            const dateObj = parseISO(key);
            const formattedDate = format(dateObj, 'yyyy-MM-dd');
            marked[formattedDate] = {
                selected: true,
                selectedColor: 'rgb(73, 58, 7)',
                textColor: '#fff'
            };
        }
        if (selectedDate) {
            marked[selectedDate] = {
                selected: true,
                selectedColor: 'rgb(115, 117, 115)',
                textColor: '#fff'
            };
        }
        return marked;
    };

    const goToOrientacoes = () => {
        router.push('/OrientacoesMedicas');
    };

    const goToResumoPaciente = () => {
        router.push('/ResumoPaciente');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Controle de Pressão</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Data da Medição:</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={toggleCalendar}>
                            <Text style={styles.dateText}>{dataMedicao || 'Selecionar Data'}</Text>
                        </TouchableOpacity>
                        {showCalendar && (
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    onDayPress={handleDateSelect}
                                    markedDates={getMarkedDates()}
                                    current={selectedDate}
                                    locale={'pt-BR'}
                                    theme={{
                                        backgroundColor: '#ffffff',
                                        calendarBackground: '#ffffff',
                                        textSectionTitleColor: '#b6c1cd',
                                        selectedDayBackgroundColor: 'rgb(73, 58, 7)',
                                        selectedDayTextColor: '#ffffff',
                                        todayTextColor: '#00adf5',
                                        dayTextColor: '#2d4150',
                                        textDisabledColor: '#d9e1e8',
                                        dotColor: '#00adf5',
                                        selectedDotColor: '#ffffff',
                                        arrowColor: 'rgb(73, 58, 7)',
                                        monthTextColor: 'rgb(73, 58, 7)',
                                        indicatorColor: 'rgb(73, 58, 7)',
                                        textDayFontFamily: 'monospace',
                                        textMonthFontFamily: 'monospace',
                                        textDayHeaderFontFamily: 'monospace',
                                        textDayFontSize: 16,
                                        textMonthFontSize: 16,
                                        textDayHeaderFontSize: 16,
                                    }}
                                />
                                <TouchableOpacity style={styles.calendarCloseButton} onPress={toggleCalendar}>
                                    <Text style={styles.buttonText}>Fechar Calendário</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Pressão Arterial (mmHg):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={pressaoArterial}
                            onChangeText={setPressaoArterial}
                            placeholder="Ex: 120"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Saturação (%):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={saturacao}
                            onChangeText={setSaturacao}
                            placeholder="Ex: 98"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Observações:</Text>
                        <TextInput
                            style={styles.observacoesInput}
                            multiline
                            numberOfLines={4}
                            value={observacoes}
                            onChangeText={setObservacoes}
                            placeholder="Descreva como você está se sentindo..."
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={salvarMedicao}>
                        <Text style={styles.buttonText}>Salvar Medição</Text>
                    </TouchableOpacity>

                    <View style={styles.medicoesContainer}>
                        <Text style={styles.medicoesTitle}>Histórico de Medições</Text>
                        {Object.keys(medicoes).length === 0 ? (
                            <Text style={styles.noMedicoesText}>Nenhuma medição registrada ainda.</Text>
                        ) : (
                            <View style={styles.table}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerCell}>Data</Text>
                                    <Text style={styles.headerCell}>Pressão Arterial</Text>
                                    <Text style={styles.headerCell}>Saturação</Text>
                                    <Text style={styles.headerCell}>Observações</Text>
                                </View>
                                {Object.entries(medicoes)
                                    .sort(([aKey], [bKey]) => {
                                        const dateA = parseISO(aKey);
                                        const dateB = parseISO(bKey);
                                        return dateB - dateA;
                                    })
                                    .map(([key, medicao]) => (
                                        <View key={key} style={styles.dataRow}>
                                            <Text style={styles.dataCell}>{medicao.data}</Text>
                                            <Text style={styles.dataCell}>{medicao.pressaoArterial}</Text>
                                            <Text style={styles.dataCell}>{medicao.saturacao}</Text>
                                            <Text style={styles.dataCell}>{medicao.observacoes}</Text>
                                        </View>
                                    ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity style={styles.bottomButtonLeft} onPress={goToOrientacoes}>
                    <Text style={styles.bottomButtonText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButtonRight} onPress={goToResumoPaciente}>
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
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'rgb(7, 5, 5)',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    dateInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    dateText: {
        fontSize: 16,
        color: 'rgb(7, 5, 5)',
    },
    observacoesInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: 'rgb(73, 58, 7)',
        color: 'white',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    medicoesContainer: {
        marginTop: 30,
        alignItems: 'stretch',
    },
    medicoesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: 'rgb(115, 117, 115)',
    },
    table: {
        width: '100%',
        borderColor: 'rgb(253, 253, 253)',
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
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
        paddingHorizontal: 5,
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
        paddingHorizontal: 5,
    },
    calendarContainer: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginHorizontal: 20,
    },
    calendarCloseButton: {
        backgroundColor: 'gray',
        color: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    noMedicoesText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 10,
        fontStyle: 'italic',
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

export default ControlePressaoScreen;
