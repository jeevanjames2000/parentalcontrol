import React, { useState, useEffect } from "react";
import {
  View,
  VStack,
  Text,
  Button,
  Input,
  Center,
  Icon,
  Clipboard,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ParentApp() {
  const [pairingCode, setPairingCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [childDeviceId, setChildDeviceId] = useState(null);

  useEffect(() => {
    const generatePairingCode = async () => {
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
      } catch (error) {
        console.log("Error generating pairing code:", error);
      }
    };
    generatePairingCode();
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View flex={1} justifyContent="center" alignItems="center" bg="gray.100">
      <VStack space={6} alignItems="center" p={5}>
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
      </VStack>
    </View>
  );
}
