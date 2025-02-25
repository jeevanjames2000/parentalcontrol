import React, { useState } from "react";
import { VStack, Text, Input, Button, Toast } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ChildApp() {
  const [pairingCode, setPairingCode] = useState("");
  const [connected, setConnected] = useState(false);

  const connectToParent = async () => {
    try {
      const deviceId = (await AsyncStorage.getItem("deviceId")) || uuid.v4();
      await AsyncStorage.setItem("deviceId", deviceId);

      const response = await axios.post(
        "https://your-api.com/api/verify-pairing",
        {
          pairingCode,
          childDeviceId: deviceId,
        }
      );

      if (response.data.success) {
        setConnected(true);
        Toast.show({ description: "Connected to parent successfully!" });
        await AsyncStorage.setItem(
          "connectedParentId",
          response.data.parentDeviceId
        );
      } else {
        Toast.show({ description: "Invalid pairing code!" });
      }
    } catch (error) {
      console.log("Error connecting to parent:", error);
      Toast.show({ description: "Connection failed. Try again." });
    }
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
  );
}
