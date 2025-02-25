import React, { useState, useEffect } from "react";
import {
  View,
  VStack,
  Text,
  Button,
  Input,
  Icon,
  Pressable,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
export default function ParentApp() {
  const [pairingCode, setPairingCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [childData, setChildData] = useState(null);
  const navigation = useNavigation();
  const [ws, setWs] = useState(null);
  useEffect(() => {
    const initializeParent = async () => {
      try {
        const storedCode = await AsyncStorage.getItem("pairingCode");
        if (storedCode) {
          setPairingCode(storedCode);
        } else {
          const newCode = Math.floor(
            100000 + Math.random() * 900000
          ).toString();
          await AsyncStorage.setItem("pairingCode", newCode);
          setPairingCode(newCode);
        }
        const websocket = new WebSocket("ws://127.0.0.1:5000");
        setWs(websocket);
        websocket.onopen = () => {
          websocket.send(
            JSON.stringify({
              type: "register",
              clientId: `parent-${newCode || storedCode}`,
              clientType: "parent",
              childId: null,
            })
          );
        };
        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "childUpdate") {
            setChildData(data.data);
            console.log("Received child data:", data.data);
          }
        };
        websocket.onerror = (error) => {
          console.log("WebSocket error:", error);
        };
        websocket.onclose = () => {
          console.log("WebSocket connection closed");
        };
        return () => {
          websocket.close();
        };
      } catch (error) {
        console.log("Error initializing parent:", error);
      }
    };
    initializeParent();
  }, []);
  const copyToClipboard = () => {
    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      console.log("No pairing code to copy!");
    }
  };
  const goBack = () => {
    navigation.navigate("InitialPage");
    AsyncStorage.clear();
    if (ws) ws.close();
  };
  return (
    <View flex={1} bg="gray.100">
      <Pressable onPress={goBack} position="absolute" top={10} p={2} zIndex={1}>
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
        space={6}
        p={5}
      >
        <Text fontSize="2xl" fontWeight="bold" color="purple.600">
          Parent App
        </Text>
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Generate a pairing code to connect with your child’s device.
        </Text>
        <Input
          value={pairingCode}
          isReadOnly
          variant="rounded"
          w="80%"
          maxW="300"
          p={4}
          fontSize="lg"
          textAlign="center"
          bg="white"
          borderWidth={0}
          shadow={2}
        />
        <Button
          onPress={copyToClipboard}
          bg="purple.500"
          _pressed={{ bg: "purple.600" }}
          _hover={{ bg: "purple.400" }}
          startIcon={<Icon as={MaterialIcons} name="content-copy" size="sm" />}
        >
          <Text fontSize="md" color="white">
            {copied ? "Copied!" : "Copy Code"}
          </Text>
        </Button>
        <Text fontSize="sm" color="gray.400" textAlign="center">
          Share this code with the child device to establish a secure
          connection.
        </Text>
        {}
        {childData && (
          <VStack space={2} alignItems="center">
            <Text fontSize="md" color="purple.600">
              Child Location: {childData.location?.lat},{" "}
              {childData.location?.lng}
            </Text>
            <Text fontSize="md" color="purple.600">
              App Usage: {childData.appUsage?.join(", ")}
            </Text>
          </VStack>
        )}
      </VStack>
    </View>
  );
}
