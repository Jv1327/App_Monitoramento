import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrientacoesMedicasScreen = () => {
  const router = useRouter();

  const goToControlePressao = () => {
    router.push('.../../controlepresao');
  };

  const goBackToDailyControl = () => {
    router.push('/DailyControlScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Orientações Médicas</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medição da Pressão Arterial</Text>
            <Text style={styles.sectionText}>
              Para uma medição precisa da pressão arterial, siga estas orientações:
            </Text>
            <Text style={styles.listItem}>1. Repouse por pelo menos 5 minutos antes da medição.</Text>
            <Text style={styles.listItem}>2. Sente-se em uma cadeira com as costas apoiadas e os pés no chão.</Text>
            <Text style={styles.listItem}>3. Coloque o braço na altura do coração, apoiado em uma mesa ou superfície.</Text>
            <Text style={styles.listItem}>4. Utilize um manguito de tamanho adequado para o seu braço.</Text>
            <Text style={styles.listItem}>5. Realize duas ou três medições com intervalos de 1-2 minutos e registre os valores.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interpretação dos Resultados</Text>
            <Text style={styles.sectionText}>
              Os valores de pressão arterial são expressos em milímetros de mercúrio (mmHg) como sistólica (o número mais alto) sobre diastólica (o número mais baixo). Consulte seu médico para entender seus valores específicos, mas geralmente considera-se:
            </Text>
            <Text style={styles.listItem}>- Normal: Menor que 120/80 mmHg</Text>
            <Text style={styles.listItem}>- Pré-hipertensão: 120-139/80-89 mmHg</Text>
            <Text style={styles.listItem}>- Hipertensão Estágio 1: 140-159/90-99 mmHg</Text>
            <Text style={styles.listItem}>- Hipertensão Estágio 2: 160 ou mais/100 ou mais mmHg</Text>
            <Text style={styles.sectionText}>
              Valores ocasionais fora da faixa normal nem sempre indicam um problema, mas medições consistentemente elevadas devem ser avaliadas por um profissional de saúde.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Importância do Monitoramento</Text>
            <Text style={styles.sectionText}>
              O monitoramento regular da pressão arterial ajuda a identificar tendências e a controlar a eficácia do tratamento, caso seja necessário. Compartilhe sempre suas medições com seu médico durante as consultas.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.bottomButtonLeft} onPress={goBackToDailyControl}>
          <Text style={styles.bottomButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButtonRight} onPress={goToControlePressao}>
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
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'rgb(115, 117, 115)',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'rgb(7, 5, 5)',
  },
  sectionText: {
    fontSize: 16,
    color: 'rgb(7, 5, 5)',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    color: 'rgb(7, 5, 5)',
    marginLeft: 15,
    marginBottom: 5,
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

export default OrientacoesMedicasScreen;