import { Text, TouchableOpacity, StyleSheet, SafeAreaView, View, TextInput, Image, TouchableWithoutFeedback,
  Keyboard, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
//import Footer from "../components/main/Footer";

interface ButtonData {
  label: string;
  isClicked: boolean;
}

const Button: React.FC<{ button: ButtonData; onPress: () => void }> = ({ button, onPress }) => (
  <TouchableOpacity
    style={[
      styles.button,
      button.isClicked && styles.buttonClicked
    ]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, button.isClicked && styles.buttonTextClicked]}>{button.label}</Text>
  </TouchableOpacity>
);

const { height } = Dimensions.get('window');

const MainPage: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isSendClicked, setIsSendClicked] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [isTextAreaFocused, setIsTextAreaFocused] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [buttonData, setButtonData] = useState<ButtonData[]>([
    { label: '작품 소개', isClicked: true },
    { label: '작가 소개', isClicked: true },
    { label: '작품 배경', isClicked: false },
    { label: '관람 포인트', isClicked: false },
    { label: '미술사', isClicked: false },
  ]);

  // Fetching nickname from AsyncStorage
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const nickname = await AsyncStorage.getItem('nickname');
  //       if (!nickname) {
  //         navigation.navigate('Login'); // Redirect if no nickname
  //       } else {
  //         setNickname(nickname);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       navigation.navigate('Login');
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  // ocr
  // const handleImageUpload = async () => {
  //   const result = await ImagePicker.launchImageLibrary({
  //     mediaType: 'photo',
  //     includeBase64: true,
  //   });
  //   if (result.assets && result.assets.length > 0) {
  //     setImageData(result.assets[0].uri); // Store image URI
  //     navigation.navigate('OcrPage', { image: result.assets[0].uri });
  //   }
  // };

  // "ㅇ", "아", "안" 모두 호출됨(수정)
  const handleTextChange = (value: string) => {
    setText(value);
    setIsSendClicked(value.length > 0);
  };

  const handleClick = (index: number) => {
    setButtonData((prevButtonData) =>
      prevButtonData.map((button, i) => ({
        ...button,
        isClicked: i === index ? !button.isClicked : button.isClicked,
      }))
    );
  };

  const handleSendClick = async () => {
    if (buttonData.every((button) => !button.isClicked)) {
      setWarningMessage('키워드를 한 개 이상 선택해주세요!');
  
      // 2초 후에 경고 메시지를 자동으로 지우기
      setTimeout(() => {
        setWarningMessage('');
      }, 2000);
  
      return;
    }
  
    setWarningMessage(''); // 선택된 키워드가 있을 때 경고 메시지 초기화

    const selectedKeywords = buttonData
      .filter((button) => button.isClicked)
      .map((button) => button.label);

    const requestData = {
      keyword: selectedKeywords,
      text: text,
    };
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.contentContainer}>
              {warningMessage && (
                <View style={styles.warningContainer}>
                  <AntDesign name="exclamationcircle" size={14} color="#ffd2e5" />
                  <Text style={styles.warningText}>{warningMessage}</Text>
                </View>
              )}
              <Text style={styles.title}>{nickname}궁금한 작품이 있나요?</Text>
              <Text style={styles.subtitle}>지금 질문해 보세요</Text>
              <Text style={styles.instructions}>원하는 설명 키워드를 모두 골라주세요</Text>
              <View style={styles.buttonContainer}>
                {buttonData.map((button, index) => (
                  <Button key={index} button={button} onPress={() => handleClick(index)} />
                ))}
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="작품 이름과 작가 이름을 알려주세요!  예) 해바라기, 고흐"
                  placeholderTextColor="#484C52"
                  value={text}
                  onChangeText={handleTextChange}
                  onFocus={() => setIsTextAreaFocused(true)}
                  onBlur={() => setIsTextAreaFocused(false)}
                  multiline
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.iconButton}>
                    <MaterialCommunityIcons name="line-scan" size={22} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, isSendClicked && styles.sendButtonActive]}
                    onPress={handleSendClick}
                    disabled={!isSendClicked}
                  >
                    <Image source={require('../assets/send.png')} style={styles.iconImage} />
                  </TouchableOpacity>
                </View>
              </View>
            {isTextAreaFocused && <Text style={styles.focusedText}>작품과 작가 정보를 모두 입력해주세요!</Text>}
          </View>
        </KeyboardAvoidingView>

        {/* <Footer/> */}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default MainPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C0D0F' },
  contentContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 25 },
  title: { fontSize: 26, fontFamily: 'WantedSansSemiBold', color: '#8EBBFF', marginBottom: 3 },
  subtitle: { fontSize: 26, fontFamily: 'WantedSansSemiBold', color: '#8D99FF', marginBottom: 10 },
  instructions: { fontSize: 15, fontFamily: 'WantedSansRegular', color: '#787B83', marginVertical: 10 },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  button: { backgroundColor: '#151718', padding: 8, margin: 4, borderRadius: 20, borderColor: '#1b1e1f', borderWidth: 1,paddingHorizontal: 16, paddingVertical: 10 },
  buttonClicked: { borderColor: '#8EBBFF', borderWidth: 1, },
  buttonText: { color: '#FFFFFF' },
  buttonTextClicked: { color: '#8D99FF' },
  textInputContainer: { backgroundColor: '#151718', borderRadius: 20, padding: 16, marginTop: 20 },
  textInput: { height: 100, color: '#FFFFFF', textAlignVertical: 'top', fontSize: 16, fontFamily: 'WantedSansRegular', },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  iconButton: { width: 44, height: 44, backgroundColor: '#1B1E1F', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonActive: { backgroundColor: '#8EBBFF' },
  iconImage: { width: 25, height: 25 },
  focusedText: { color: '#787B83', fontSize: 15, fontFamily: 'WantedSansRegular', marginTop: 8 },
  warningContainer: {
    position: 'absolute',
    top: height * 0.05,
    left: '15%', // 화면 중간에 위치
    right: '15%', // 좌우 여백으로 폭 설정
    backgroundColor: '#32191e',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: '#522e35',
    borderWidth: 1,
    zIndex: 10,
  },  
  warningText: { color: '#ffd2e5', marginLeft: 7 },
});