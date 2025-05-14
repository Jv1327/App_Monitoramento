import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ptBR } from 'date-fns/locale';

LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const InfoFamiliarLembretesScreen = () => {
    const [nomeFamiliar, setNomeFamiliar] = useState('');
    const [telefoneFamiliar, setTelefoneFamiliar] = useState('');
    const [lembretes, setLembretes] = useState('');
    const [infoFamiliar, setInfoFamiliar] = useState(null);
    const [dataLembrete, setDataLembrete] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [lembretesList, setLembretesList] = useState({});
    const [selectedDate, setSelectedDate] = useState('');

    const router = useRouter();

    useEffect(() => {
        carregarInfoFamiliar();
        carregarLembretes();
    }, []);

    const salvarInfoFamiliar = async () => {
        if (!nomeFamiliar.trim() || !telefoneFamiliar.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos de informações do familiar.');
            return;
        }

        const novaInfo = { nome: nomeFamiliar, telefone: telefoneFamiliar };
        try {
            await AsyncStorage.setItem('infoFamiliar', JSON.stringify(novaInfo));
            Alert.alert('Sucesso', 'Informações do familiar salvas com sucesso!');
            setInfoFamiliar(novaInfo);
            limparFormularioFamiliar();
        } catch (error) {
            Alert.alert('Erro', 'Houve um problema ao salvar as informações do familiar.');
            console.error('Erro ao salvar informações do familiar:', error);
        }
    };

    const salvarLembrete = async () => {
        if (!dataLembrete) {
            Alert.alert('Erro', 'Por favor, selecione a data do lembrete.');
            return;
        }
        if (!lembretes.trim()) {
            Alert.alert('Erro', 'Por favor, insira o lembrete.');
            return;
        }

        const key = format(parseISO(dataLembrete, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');
        const novoLembrete = {
            data: dataLembrete,
            texto: lembretes,
        };

        try {
            const storedLembretes = await AsyncStorage.getItem('lembretes');
            const lembretesAtuais = storedLembretes ? JSON.parse(storedLembretes) : {};

            lembretesAtuais[key] = novoLembrete;

            await AsyncStorage.setItem('lembretes', JSON.stringify(lembretesAtuais));
            Alert.alert('Sucesso', 'Lembrete salvo com sucesso!');
            setLembretesList(lembretesAtuais)
            limparFormularioLembrete();
            carregarLembretes();
        } catch (error) {
            Alert.alert('Erro', 'Houve um problema ao salvar o lembrete.');
            console.error('Erro ao salvar lembrete:', error);
        }
    };

    const carregarInfoFamiliar = async () => {
        try {
            const storedInfo = await AsyncStorage.getItem('infoFamiliar');
            if (storedInfo) {
                setInfoFamiliar(JSON.parse(storedInfo));
                setNomeFamiliar(JSON.parse(storedInfo).nome);
                setTelefoneFamiliar(JSON.parse(storedInfo).telefone);
            }
        } catch (error) {
            Alert.alert('Erro ao carregar', 'Houve um problema ao carregar as informações do familiar.');
            console.error('Erro ao carregar informações do familiar:', error);
        }
    };

    const carregarLembretes = async () => {
        try {
            const storedLembretes = await AsyncStorage.getItem('lembretes');
            if (storedLembretes) {
                setLembretesList(JSON.parse(storedLembretes));
            }
        } catch (error) {
            Alert.alert('Erro ao carregar', 'Houve um problema ao carregar os lembretes.');
            console.error('Erro ao carregar lembretes:', error);
        }
    };

    const limparFormularioFamiliar = () => {
        setNomeFamiliar('');
        setTelefoneFamiliar('');
    };
    const limparFormularioLembrete = () => {
        setDataLembrete('');
        setLembretes('');
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleDateSelect = (date) => {
        const formattedDate = format(parseISO(date.dateString), 'dd/MM/yyyy');
        setDataLembrete(formattedDate);
        setSelectedDate(date.dateString);
        setShowCalendar(false);
    };

    const getMarkedDates = () => {
        const marked = {};
        for (const key in lembretesList) {
            marked[key] = {
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

    const handleBack = () => {
        router.push('/ResumoPaciente');
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('nomePacienteLogado');
            console.log('Nome do paciente logado removido.');
            router.push('/'); // Redireciona para a tela de login
        } catch (error) {
            console.error('Erro ao remover nome do paciente logado:', error);
            Alert.alert('Erro', 'Houve um problema ao sair.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Informações Familiares e Lembretes</Text>

                        <Text style={styles.sectionTitle}>Informações do Familiar</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do Familiar"
                            value={nomeFamiliar}
                            onChangeText={setNomeFamiliar}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Telefone do Familiar"
                            value={telefoneFamiliar}
                            onChangeText={setTelefoneFamiliar}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={salvarInfoFamiliar}>
                            <Text style={styles.buttonText}>Salvar Informações do Familiar</Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Lembretes</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Data do Lembrete:</Text>
                            <TouchableOpacity style={styles.dateInput} onPress={toggleCalendar}>
                                <Text style={styles.dateText}>{dataLembrete || 'Selecionar Data'}</Text>
                            </TouchableOpacity>
                            {showCalendar && (
                                <View style={styles.calendarContainer}>
                                    <Calendar
                                        onDayPress={handleDateSelect}
                                        markedDates={getMarkedDates()}
                                        current={selectedDate}
                                        locale={'pt-br'}
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
                        <TextInput
                            style={styles.observacoesInput}
                            placeholder="Digite seu lembrete"
                            value={lembretes}
                            onChangeText={setLembretes}
                            multiline
                            numberOfLines={4}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={salvarLembrete}>
                            <Text style={styles.buttonText}>Salvar Lembrete</Text>
                        </TouchableOpacity>

                        <View style={styles.medicoesContainer}>
                            <Text style={styles.medicoesTitle}>Histórico de Lembretes</Text>
                            {Object.keys(lembretesList).length === 0 ? (
                                <Text style={styles.noMedicoesText}>Nenhum lembrete registrado ainda.</Text>
                            ) : (
                                <View style={styles.table}>
                                    <View style={styles.headerRow}>
                                        <Text style={styles.headerCell}>Data</Text>
                                        <Text style={styles.headerCell}>Lembrete</Text>
                                    </View>
                                    {Object.entries(lembretesList)
                                        .sort(([aKey], [bKey]) => {
                                            const dateA = parseISO(aKey);
                                            const dateB = parseISO(bKey);
                                            return dateB - dateA;
                                        })
                                        .map(([key, lembrete]) => (
                                            <View key={key} style={styles.dataRow}>
                                                <Text style={styles.dataCell}>{lembrete.data}</Text>
                                                <Text style={styles.dataCell}>{lembrete.texto}</Text>
                                            </View>
                                        ))}
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.bottomButtonsContainer}>
                    <TouchableOpacity style={styles.bottomButtonLeft} onPress={handleBack}>
                        <Text style={styles.bottomButtonText}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomButtonRight} onPress={handleLogout}>
                        <Text style={styles.bottomButtonText}>Sair</Text>
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
        color: 'rgb(88, 88, 88)',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
        color: 'rgb(7, 5, 5)',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    observacoesInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: 'white',
        textAlignVertical: 'top',
        minHeight: 80,
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
        color: 'rgb(17, 15, 15)',
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
        backgroundColor: 'rgba(115, 117, 115, 0.69)',
        paddingVertical: 10,
    },
    headerCell: {
        flex: 1,
        color: 'rgb(179, 56, 138)',
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
    noMedicoesText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 10,
        fontStyle: 'italic',
    },
    bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  
});

export default InfoFamiliarLembretesScreen;
