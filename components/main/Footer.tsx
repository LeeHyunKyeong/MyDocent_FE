import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const Footer: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.footerContainer}>
      {!isOpen ? (
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={handleToggle}
        >
          <Image 
            source={require('../../assets/docent_logo.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.openContainer}>
          <TouchableOpacity 
            style={styles.menuButton}
          >
            <Text style={styles.buttonText}>내 정보</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuButton}
          >
            <Text style={styles.buttonText}>감상한 작품</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleToggle} // 닫기 버튼
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: height * 0.05, // 화면 높이의 5% 위치
    right: width * 0.05, // 화면 너비의 5% 위치
  },
  infoButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1B1E1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 32,
    height: 32,
  },
  openContainer: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 40,
    padding: 6,
    backgroundColor: '#1B1E1F',
    alignItems: 'center',
  },
  menuButton: {
    height: 44,
    borderRadius: 30,
    backgroundColor: '#2C3032',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginRight: 6
  },  
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'WantedSansRegular',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C3032',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
