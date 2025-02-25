import React, { useState, useEffect } from "react";
import { VStack, Text, Input, Button, Toast, Icon, View } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function ChildApp() {
  const [pairingCode, setPairingCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const navigation = useNavigation();
  const connectToParent = async () => {
    try {
      const deviceId =
        (await AsyncStorage.getItem("deviceId")) || `child-${Date.now()}`;
      await AsyncStorage.setItem("deviceId", deviceId);
      const websocket = new WebSocket("ws://127.0.0.1:5000");
      setWs(websocket);
      websocket.onopen = () => {
        websocket.send(
          JSON.stringify({
            type: "register",
            clientId: deviceId,
            clientType: "child",
          })
        );
        setConnected(true);
        Toast.show({ description: "Connected to parent successfully!" });
      };
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === "registered") {
          console.log("Child registered:", data.clientId);
        }
      };
      websocket.onerror = (error) => {
        console.log("WebSocket error:", error);
        Toast.show({ description: "Connection failed. Try again." });
      };
      websocket.onclose = () => {
        console.log("WebSocket connection closed");
        setConnected(false);
      };
    } catch (error) {
      console.log("Error connecting to parent:", error);
      Toast.show({ description: "Connection failed. Try again." });
    }
  };
  useEffect(() => {
    if (connected && ws && ws.readyState === WebSocket.OPEN) {
      const interval = setInterval(() => {
        const childData = {
          type: "childData",
          clientId: `child-${Date.now()}`,
          payload: {
            location: { lat: 37.7749, lng: -122.4194 },
            appUsage: ["app1", "app2"],
          },
        };
        ws.send(JSON.stringify(childData));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [connected, ws]);
  const goBack = () => {
    navigation.navigate("InitialPage");
    AsyncStorage.clear();
    if (ws) ws.close();
  };
  if (connected) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="lg" color="green.600">
          Connected to Parent!
        </Text>
      </VStack>
    );
  }
  return (
    <View flex={1} position="relative" top={10}>
      <Pressable
        onPress={goBack}
        position="absolute"
        top={20}
        left={10}
        p={2}
        zIndex={1}
      >
        <Icon
          as={MaterialIcons}
          name="arrow-back"
          size="lg"
          color="purple.600"
        />
      </Pressable>
      <VStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        bg="gray.100"
        space={6}
        p={5}
      >
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          Child App
        </Text>
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Enter the pairing code from your parent.
        </Text>
        <Input
          placeholder="Enter 6-digit code"
          value={pairingCode}
          onChangeText={setPairingCode}
          variant="rounded"
          w="80%"
          maxW="300"
          p={4}
          fontSize="lg"
          textAlign="center"
          bg="white"
          shadow={2}
          keyboardType="numeric"
          maxLength={6}
        />
        <Button
          bg="blue.500"
          onPress={connectToParent}
          isDisabled={pairingCode.length < 6}
        >
          <Text fontSize="md" color="white">
            Connect to Parent
          </Text>
        </Button>
      </VStack>
    </View>
  );
}
