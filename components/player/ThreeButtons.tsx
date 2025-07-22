import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ControlPanelProps {
  togglePlaybackRate: () => void;
  highlighted: boolean;
  toggleHighlight: () => void;
  rateIndex: number;
  displayRates: number[];
  position: Animated.Value;
}

const ThreeButtons: React.FC<ControlPanelProps> = ({
  togglePlaybackRate,
  highlighted,
  toggleHighlight,
  rateIndex,
  displayRates,
  position,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current; // 애니메이션 값
  const translateAnim = useRef(new Animated.Value(0)).current; // 이동 애니메이션 값
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
  };

  const triggerHideAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100, // 사라지는 애니메이션 시간
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 50, // 아래로 이동
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const triggerShowAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100, // 나타나는 애니메이션 시간
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0, // 원래 위치
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  useEffect(() => {
    const listenerId = position.addListener(() => {
      triggerHideAnimation();

      // 이전 타이머 초기화
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 다시 나타남
      timeoutRef.current = setTimeout(() => {
        triggerShowAnimation();
      }, 1000);
    });

    return () => {
      position.removeListener(listenerId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [position]);

  return (
    <View style={styles.buttonContainer}>
      <Animated.View
        style={[
          styles.button,
          { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
        ]}
      >
        <TouchableOpacity onPress={toggleHighlight}>
          <FontAwesome5 name="pen" size={18} color={highlighted ? '#FFFFFF' : '#484C52'} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.button,
          { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
        ]}
      >
        <TouchableOpacity onPress={togglePlaybackRate}>
          <Text style={styles.buttonText}>
            {Number.isInteger(displayRates[rateIndex]) || displayRates[rateIndex] % 1 === 0.5
              ? displayRates[rateIndex].toFixed(1)
              : displayRates[rateIndex].toFixed(2)}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View
        style={styles.button}>
        <TouchableOpacity onPress={handleLikeClick}>
          <FontAwesome name="heart" size={21} color={isLiked ? '#FFFFFF' : '#484C52'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#151718',
    borderWidth: 0.5,
    borderColor: '#2c3032',
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF',
  },
});

export default ThreeButtons;