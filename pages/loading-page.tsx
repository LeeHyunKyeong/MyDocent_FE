import React, { useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { DataContext } from '../DataContext';
import { Image } from 'expo-image';
//import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
type LoadingRouteProp = RouteProp<RootStackParamList, 'Loading'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Loading'>;

const LoadingPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LoadingRouteProp>();
  const { requestData } = route.params;

  const context = useContext(DataContext);
  if (!context) return null;
  const { setArtworkData } = context;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://6076dbb672ae.ngrok-free.app/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) throw new Error('API 요청 실패');
        const data = await response.json();

        // Context에 저장
        setArtworkData(data);

        // 문자열을 배열로 가공 ["작품 소개", "작가 소개", "작품 배경"]
        const selectedCategories = requestData.category
          .split(',')
          .map(item => item.trim()); 

        navigation.navigate('Player', {
          selectedCategories,
        });
      } catch (error) {
        console.error('API 호출 에러:', error);
        //navigation.navigate('Main'); // 실패 시 에러페이지
      }
    };

    fetchData();
  }, [requestData]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity> */}

      <Text style={styles.waitText}>잠시만 기다려주세요</Text>

      <View style={styles.mainTextContainer}>
        <Text style={styles.mainTitle}>AI 도슨트가</Text>
        <Text style={styles.mainTitle}>곧 설명을 시작합니다!</Text>
      </View>

      <Image
        source={require('../assets/motion.gif')}
        style={styles.loadingGif}
        contentFit="contain"
        autoplay // expo-image에서 GIF 자동 재생 옵션
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>마이 도슨트는 검색 기반으로 정보를 제공하며</Text>
        <Text style={styles.footerText}>일부 정보가 불분명할 수 있습니다</Text>
      </View>
    </SafeAreaView>
  );
}
export default LoadingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D0F'
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  waitText: {
    marginTop: '25%',
    fontSize: 16,
    textAlign: 'center',
    color: '#8EBBFF',
    fontFamily: 'WantedSansSemiBold',
  },
  mainTextContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 26,
    fontFamily: 'WantedSansSemiBold',
    color: '#fff',
  },
  loadingGif: {
    position: 'absolute',
    top: height / 2 - 110,
    left: width / 2 - 110,
    width: 220,
    height: 220,
  },
  footer: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#787B83',
    fontFamily: 'WantedSansRegular',
  },
});
