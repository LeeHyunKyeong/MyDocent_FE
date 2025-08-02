import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FirstModalProps {
  onClose: () => void;
  onCancel: () => void;
}

const FirstModal: React.FC<FirstModalProps> = ({ onClose, onCancel }) => {

  return (
    <Modal
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>이어폰이 연결되어 있나요?</Text>
          <Text style={styles.firstMessage}>음성이 핸드폰 스피커로 재생될 수 있어요.</Text>
          <Text style={styles.secondMessage}>이어폰 사용을 권장드려요.</Text>
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity onPress={onCancel} style={[styles.Button, { marginRight: 10 }]}>
              <Text style={[styles.ButtonText, { color:'#787B83' }]}>취소</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onClose} style={styles.Button}>
              <Text style={styles.ButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //반투명 배경
  },
  modalContainer: {
    width: '85%',
    padding: 25,
    borderRadius: 20,
    backgroundColor: '#151718',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'wantedSansBold',
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  firstMessage: {
    fontSize: 15,
    fontFamily: 'wantedSansRegular',
    color: '#787B83',
    textAlign: 'center',
    marginBottom: 3,
  },
  secondMessage: {
    fontSize: 15,
    fontFamily: 'wantedSansRegular',
    color: '#787B83',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Button: {
    flex: 1,
    height: 52,
    borderRadius: 30,
    backgroundColor: '#1B1E1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    fontFamily: 'wantedSansRegular',
    fontWeight: 'semibold',
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default FirstModal;