import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Animated } from 'react-native';
import AudioControl from "../components/player/AudioControl";
import AudioHeader from "../components/player/AudioHeader";
import ThreeButtons from "../components/player/ThreeButtons";
import FirstModal from '../components/player/FirstModal';
import artworkData from '../artworkdata.json';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DataContext, ArtworkData } from '../DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type LoadingRouteProp = RouteProp<RootStackParamList, 'Player'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Player'>;

const PlayerPage: React.FC = () => {
  const [author, setAuthor] = useState<string | null>(null);
  const [workTitle, setWorkTitle] = useState<string | null>(null);
  const [workIntro, setWorkIntro] = useState<string | null>();
  const [authorIntro, setAuthorIntro] = useState<string | null>();
  const [workBackground, setWorkBackground] = useState<string | null>();
  const [appreciationPoint, setAppreciationPoint] = useState<string | null>();
  const [history, setHistory] = useState<string | null>();
  const [segments, setSegments] = useState<[string, string][]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [segmentHeights, setSegmentHeights] = useState<number[]>([]); // 각 문단의 높이를 저장할 배열
  const [isPlaying, setIsPlaying] = useState(false);
  const [rateIndex, setRateIndex] = useState(0);
  const playbackRates = [0.95, 1.05, 1.15, 1.25, 1.35];
  const displayRates = [1, 1.25, 1.5, 1.75, 2]; //화면에 표시할 값
  const currentRate = playbackRates[rateIndex]; 
  const [highlighted, setHighlighted] = useState(true);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [lastBoundaryEvent, setLastBoundaryEvent] = useState({ charIndex: 0 });
  const [slicedText, setSlicedText] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false); //최초 모달 1회 확인 여부
  
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LoadingRouteProp>();
  const { selectedCategories } = route.params;

  // 매핑 객체
  const categoryMap: Record<string, keyof ArtworkData> = {
    "작품 소개": "artworkDescription",
    "작가 소개": "artistDescription",
    "작품 배경": "artworkBackground",
    "관람 포인트": "appreciationPoint",
    "미술사": "artHistory",
  };

  const context = useContext(DataContext);
  if (!context) return <Text>데이터 없음</Text>;
  const { artworkData } = context;

  // const clearModalStatus = async () => {
  //   try {
  //     await AsyncStorage.removeItem('hasSeenModal');
  //     console.log('Modal status cleared.');
  //     setHasSeenModal(false); //상태도 초기화
  //   } catch (error) {
  //     console.error('Error clearing modal status:', error);
  //   }
  // };

  useEffect(() => {
    const checkModalStatus = async () => {
      try {
        const seenModal = await AsyncStorage.getItem('hasSeenModal');
        if (seenModal === null) {
          setHasSeenModal(false); //최초 실행
        } else {
          setHasSeenModal(true); //이미 본 적 있음
        }
      } catch (error) {
        console.error('Error checking modal status:', error);
      }
    };

    checkModalStatus();
  }, []);

  useEffect(() => {
    if (!artworkData) return;
    setAuthor(artworkData.artistName);
    setWorkTitle(artworkData.artworkTitle);

    const segments: [string, string][] = [
      ["작품 소개", artworkData.artworkDescription],
      ["작가 소개", artworkData.artistDescription],
      ["작품 배경", artworkData.artworkBackground],
      ["관람 포인트", artworkData.appreciationPoint],
      ["미술사", artworkData.artHistory],
    ];

    console.log("받은 selectedCategories:", selectedCategories);
    console.log("segments 라벨:", segments.map(([label]) => label));

    // 선택된 카테고리만 필터링
    const filteredSegments = segments.filter(([label]) => {
      const match = selectedCategories.includes(label);
      console.log(`라벨: "${label}" → 매칭 여부: ${match}`);
      return match;
    });

    console.log("필터링 결과:", filteredSegments.map(([label]) => label));

    setSegments(filteredSegments);
  }, [artworkData, selectedCategories]);

  useEffect(() => {
    //console.log("인덱스 바뀜",currentSegmentIndex)
    setLastBoundaryEvent({
      charIndex: 0,
    });
    Speech.stop();

    if (scrollViewRef.current && segmentHeights[currentSegmentIndex] !== undefined) {
      const yOffset = segmentHeights.slice(0, currentSegmentIndex).reduce((acc, height) => acc + height, 0);
      scrollViewRef.current.scrollTo({ y: yOffset - 80, animated: true });
    }
  }, [currentSegmentIndex, segmentHeights]);

  // 각 문단의 레이아웃을 측정해서 높이를 저장하는 함수
  const onLayout = (event: any, index: number) => {
    const { height } = event.nativeEvent.layout; //높이를 추출
    setSegmentHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = height; // 해당 인덱스에 높이 값을 저장
      return newHeights;
    });
  };

  //마지막 문단 뒤에 빈 View의 높이를 계산하기 위한 onLayout 핸들러
  const onLastViewLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setSegmentHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights.push(height); // 마지막 View 높이 추가
      return newHeights;
    });
  };

  const scrolling = useRef(new Animated.Value(0)).current;
  const [position, setPosition] = useState(0);
  
  const onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const position = e.nativeEvent.contentOffset.y;
    setPosition(position);
    //console.log('Scroll Position:', position);
  };

  const handlePlayPause  = async () => {
    if (!hasSeenModal) {
      setIsModalOpen(true);
      await AsyncStorage.setItem('hasSeenModal', 'true'); // 모달 본 적 있음 저장
      setHasSeenModal(true);
      return;
    }

    if (isPlaying) {
      Speech.stop(); 
      setIsPlaying(false);
    } else {
      setIsPlaying(true);

      let currentText = segments[currentSegmentIndex][1]; // 현재 세그먼트의 텍스트를 가져옴
      setSlicedText(currentText);
      const startIndex = lastBoundaryEvent.charIndex; // 현재 slicedText에서 멈춘 위치 이후로 자르기
      const nextText = currentText.slice(lastBoundaryEvent.charIndex);

      Speech.speak(nextText, {
        rate: currentRate,
        onBoundary: (boundaryEvent: any) => {
          setLastBoundaryEvent({
            charIndex: startIndex + boundaryEvent.charIndex,
          });
        },
        onDone: () => {
          setIsPlaying(false);
        },
      });
    }
  };
  
  const togglePlaybackRate = () => {
    const nextIndex = (rateIndex + 1) % playbackRates.length;
    setRateIndex(nextIndex);
  
    if (isPlaying) {
      Speech.stop();
      handlePlayPause();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AudioHeader />
      {position > 0 && (
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={['#0C0D0F', 'rgba(12, 13, 15, 0)']} // 위는 불투명, 아래는 투명
            style={styles.gradient}
            pointerEvents="none" // 상호작용 방지
          />
        </View>
      )}
      <Animated.ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={400}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrolling } } }],
          { useNativeDriver: false, listener: onScroll }
        )}
      >
      {segments.map(([title, content], index) => (
          <Text
            key={index}
            onLayout={(event) => onLayout(event, index)}
            onPress={() => setCurrentSegmentIndex(index)} // 클릭 시 해당 문단으로 이동
            style={[
              styles.segment,
              highlighted
                ? index === currentSegmentIndex
                  ? styles.highlightedText // 하이라이트 활성화 상태에서 현재 문단
                  : styles.nonHighlightedText // 하이라이트 활성화 상태에서 나머지 문단
                : styles.highlightedText, // 하이라이트 비활성화 시 모든 문단 흰색
            ]}
          >
            <Text>{title}</Text>
            {"\n"}
            <Text>{content?.split('.')
                .filter(sentence => sentence.trim().length > 0) // 빈 문자열 제거
                .map((sentence, i) => (
                  <Text key={i}>
                    {sentence.trim() + '.'}
                    {"\n"}
                  </Text>
                ))}</Text>
            {"\n"}
          </Text>
        ))}
        <View onLayout={onLastViewLayout} style={{ height: 150 }} />
      </Animated.ScrollView>

      <View style={styles.fixedButtonsContainer}>
        <ThreeButtons
          highlighted={highlighted}
          toggleHighlight={() => setHighlighted(!highlighted)}
          togglePlaybackRate={togglePlaybackRate}
          rateIndex={rateIndex}
          displayRates={displayRates}
          position={scrolling}
        />
      </View>
      <AudioControl
        workTitle={workTitle}
        author={author}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
        handleSearchNewWork={() => navigation.navigate('Main')}
      />
      {isModalOpen && (
        <FirstModal
          onClose={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </SafeAreaView>
  );
};
export default PlayerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D0F',
  },
  gradientContainer: {
    position: 'absolute',
    top: getStatusBarHeight()+64,
    left: 0,
    right: 0,
    height: 150, //흐려지는 영역의 높이
    zIndex: 1,
  },
  gradient: {
    flex: 1,
  },
  segment: {
    fontSize: 19,
    fontFamily: 'wantedSansRegular',
    paddingHorizontal: 20,
    lineHeight: 30,
  },
  highlightedText: {
    color: '#FFFFFF',
  },
  nonHighlightedText: {
    color: '#495057',
  },
  fixedButtonsContainer: {
    position: 'absolute',
    bottom: 180, // AudioControl 바로 위에 고정
    right: 0,
    zIndex: 10,
  },
});