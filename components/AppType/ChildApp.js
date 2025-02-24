import React, { useState, useEffect } from "react";
import { View, VStack, Text, Input, Button, Center, Toast } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import uuid from "react-native-uuid";
export default function ChildApp() {
  const [pairingCode, setPairingCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [parentDeviceId, setParentDeviceId] = useState(null);
  useEffect(() => {
    const loadDeviceId = async () => {
      try {
        const deviceId = await AsyncStorage.getItem("deviceId");
        if (!deviceId) {
          const newDeviceId = uuid.v4();
          await AsyncStorage.setItem("deviceId", newDeviceId);
        }
      } catch (error) {
        console.log("Error loading device ID:", error);
      }
    };
    loadDeviceId();
  }, []);
  const handlePairing = async () => {
    try {
      const parentCode = await AsyncStorage.getItem("pairingCode");
      if (pairingCode === parentCode) {
        const childDeviceId = await AsyncStorage.getItem("deviceId");
        await AsyncStorage.setItem("pairedWith", childDeviceId);
        establishSecureConnection(childDeviceId);
        setConnected(true);
        Toast.show({
          title: "Connected Successfully",
          status: "success",
          duration: 3000,
        });
      } else {
        setError("Invalid pairing code. Please try again.");
        Toast.show({
          title: "Invalid Code",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log("Pairing Error:", error);
      setError("Failed to connect. Please try again.");
      Toast.show({
        title: "Connection Failed",
        status: "error",
        duration: 3000,
      });
    }
  };
  const establishSecureConnection = async (childDeviceId) => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await sendSignalToParent({ type: "offer", offer, childDeviceId });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalToParent({
          type: "candidate",
          candidate: event.candidate,
          childDeviceId,
        });
      }
    };
    pc.ontrack = (event) => {
      console.log("Track received from parent:", event.streams[0]);
    };
    pc.setRemoteDescription(
      new RTCSessionDescription(await getAnswerFromParent(childDeviceId))
    );
  };
  const sendSignalToParent = async (signal) => {
    console.log("Sending signal to parent:", signal);
  };
  const getAnswerFromParent = async (childDeviceId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ type: "answer", sdp: "dummy-answer" }), 2000);
    });
  };
  if (connected) {
    return (
      <Center flex={1} bg="gray.100">
        <Text fontSize="xl" color="green.500">
          Connected to Parent Securely
        </Text>
      </Center>
    );
  }
  return (
    <Center flex={1} bg="gray.100">
      <VStack space={6} alignItems="center" w="80%" maxW="300" p={5}>
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          Childs App
        </Text>
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Enter the pairing code provided by your parent to connect.
        </Text>
        <Input
          value={pairingCode}
          onChangeText={setPairingCode}
          placeholder="Enter 6-digit code"
          variant="rounded"
          w="100%"
          p={4}
          fontSize="lg"
          textAlign="center"
          bg="white"
          borderWidth={0}
          shadow={2}
          keyboardType="numeric"
          maxLength={6}
        />
        <Button
          onPress={handlePairing}
          bg="blue.500"
          _pressed={{ bg: "blue.600" }}
          _hover={{ bg: "blue.400" }}
          isDisabled={pairingCode.length < 6}
        >
          <Text fontSize="md" color="white">
            Connect to Parent
          </Text>
        </Button>
        {error && (
          <Text fontSize="sm" color="red.500" textAlign="center">
            {error}
          </Text>
        )}
      </VStack>
    </Center>
  );
}
