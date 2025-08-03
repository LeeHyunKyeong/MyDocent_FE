import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { CameraView, Camera, CameraCapturedPicture } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import Entypo from "@expo/vector-icons/Entypo";

// OCR 로직 (더미 함수, 실제로는 서버 호출이나 Tesseract.js 등 사용)
const runOcr = async (imageUri: string): Promise<string> => {
  console.log("Running OCR on:", imageUri);
  // 여기서 OCR 처리
  return "OCR_RESULT_EXAMPLE";
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Ocr">;

export default function OcrCamera() {
  const navigation = useNavigation<NavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  // ocr 넣은 버전으로 수정
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // 카메라 권한 거부 시 바로 메인으로(확인 필요)
  useEffect(() => {
    if (hasPermission === false) {
      navigation.navigate("Main");
    }
  }, [hasPermission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo: CameraCapturedPicture =
        await cameraRef.current.takePictureAsync({
          skipProcessing: true,
        });

      if (photo?.uri) {
        const cropped = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX: photo.width * 0.1,
                originY: photo.height * 0.3,
                width: photo.width * 0.8,
                height: photo.height * 0.4,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        console.log("Cropped Image URI:", cropped.uri);
      }
    }
  };

  if (hasPermission === null) return <View />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />

      <View style={styles.overlay}>
        <View style={styles.maskTop} />
        <View style={styles.maskCenter}>
          <View style={styles.maskLeft} />

          <View style={styles.guideArea}>
            <View style={styles.guideBox} />
            <View style={styles.guideTextContainer}>
              <Text style={styles.guideText}>
                작품명과 작가명을 사각형 안에 맞춘 후{"\n"}촬영 버튼을
                눌러주세요
              </Text>
            </View>
          </View>

          <View style={styles.maskRight} />
        </View>
        <View style={styles.maskBottom} />
      </View>

      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Entypo name="camera" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const BOX_HEIGHT = 200;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  maskTop: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  maskCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  maskLeft: {
    flex: 1,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  maskRight: {
    flex: 1,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  maskBottom: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  guideArea: {
    alignItems: "center",
    width: "90%",
  },
  guideBox: {
    width: "100%",
    height: BOX_HEIGHT,
    borderColor: "#00ff00",
    borderWidth: 3,
  },
  guideTextContainer: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
  },
  guideText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "WantedSansSemiBold",
  },
  captureButton: {
    position: "absolute",
    bottom: "15%",
    alignSelf: "center",
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 15,
  },
});
