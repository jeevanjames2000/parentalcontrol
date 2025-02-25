import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Image,
  FlatList,
} from "react-native";
import { Button, Text } from "native-base";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { Ionicons } from "@expo/vector-icons";
export default function QrCamera() {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("back");
  const device = useCameraDevice(cameraFacing);
  const camera = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [animationValue] = useState(new Animated.Value(0));
  const [showImagePopup, setShowImagePopup] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [hasPermission]);

  if (!device) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.text}>Camera device not found!</Text>
      </View>
    );
  }

  const toggleFlash = () => {
    setIsFlashOn((prev) => !prev);
  };
  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const closeImages = () => {
    setSelectedImages([]);
    setShowImagePopup(false);
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        flash={isFlashOn ? "on" : "off"}
      />

      <Modal visible={showImagePopup} transparent={true} animationType="slide">
        <View style={styles.popupContainer}>
          <FlatList
            data={selectedImages}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.imagePreview} />
            )}
          />
          <Button
            variant={"outline"}
            colorScheme={"red"}
            style={{ bottom: 20 }}
            onPress={closeImages}
          >
            Clear all selected images
          </Button>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowImagePopup(false)}
          >
            <Ionicons name="close-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  qrFrame: {
    width: 300,
    height: 300,
    borderWidth: 5,
    borderColor: "#007367",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: "white",
  },
  flashButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 2,
  },
  galleryButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#fff",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  flipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
  barcodeButton: {
    position: "absolute",
    top: 90,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  imagePreview: {
    width: 300,
    height: "100%",
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 10,
    zIndex: 1,
  },
});
