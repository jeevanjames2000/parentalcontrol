import React, { useState, useEffect } from "react";
import {
  View,
  VStack,
  Text,
  Button,
  Input,
  Icon,
  Pressable,
  Spinner,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setChildData, resetChildData } from "../../store/reducers/childSlice";
export default function ParentApp() {
  const [pairingCode, setPairingCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [ws, setWs] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isConnected } = useSelector((state) => state.child);
  useEffect(() => {
    const initializeParent = async () => {
      try {
        let codeToUse;
        const storedCode = await AsyncStorage.getItem("pairingCode");
        if (storedCode) {
          codeToUse = storedCode;
          setPairingCode(storedCode);
        } else {
          const newCode = Math.floor(
            100000 + Math.random() * 900000
          ).toString();
          codeToUse = newCode;
          await AsyncStorage.setItem("pairingCode", newCode);
          setPairingCode(newCode);
        }
        const websocket = new WebSocket("ws://172.17.58.151:5000");
        setWs(websocket);
        websocket.onopen = () => {
          websocket.send(
            JSON.stringify({
              type: "register",
              clientId: `parent-${codeToUse}`,
              clientType: "parent",
            })
          );
        };
        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "childUpdate" && data.data) {
            dispatch(
              setChildData({
                deviceId: data.clientId,
                location: data.data.location,
                deviceInfo: data.data.deviceInfo,
                contacts: data.data.contacts,
                callLogs: data.data.callLogs,
              })
            );
            if (data.data.location) {
              navigation.navigate("Home");
            }
          }
        };
        websocket.onclose = () => {
          dispatch(resetChildData());
        };
        return () => {
          if (websocket.readyState === WebSocket.OPEN) {
            websocket.close();
          }
        };
      } catch (error) {}
    };
    initializeParent();
  }, [navigation, dispatch]);
  const copyToClipboard = async () => {
    if (pairingCode) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const goBack = () => {
    navigation.navigate("InitialPage");
    AsyncStorage.clear();

    dispatch(resetChildData());
  };
  return (
    <View flex={1} bg="gray.100">
      <Pressable
        onPress={goBack}
        position="absolute"
        top={10}
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
        {isConnected ? (
          <VStack space={4} alignItems="center">
            <Text fontSize="md" color="green.600">
              Child Connected! Waiting for location...
            </Text>
            <Spinner size="lg" color="purple.500" />
          </VStack>
        ) : null}
      </VStack>
    </View>
  );
}
