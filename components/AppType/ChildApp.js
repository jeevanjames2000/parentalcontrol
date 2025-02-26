import React, { useState, useEffect, useRef } from "react";
import { VStack, Text, Input, Button, Toast, Icon, View } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, PermissionsAndroid, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as Device from "expo-device";
import * as Contacts from "expo-contacts";
import { InstalledApps } from "react-native-launcher-kit";

export default function ChildApp() {
  const [pairingCode, setPairingCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const navigation = useNavigation();
  const wsRef = useRef(null);

  useEffect(() => {
    const initializeWebSocket = async () => {
      const result = await InstalledApps.getApps({
        includeVersion: true,
        includeAccentColor: true,
      });
      console.log("result: ", result);
      try {
        const deviceId =
          (await AsyncStorage.getItem("deviceId")) || `child-${Date.now()}`;
        await AsyncStorage.setItem("deviceId", deviceId);
        const websocket = new WebSocket("ws://172.17.58.151:5000");
        wsRef.current = websocket;
        setWs(websocket);

        websocket.onopen = () => {
          websocket.send(
            JSON.stringify({
              type: "register",
              clientId: deviceId,
              clientType: "child",
              pairingCode,
            })
          );
        };

        websocket.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          if (data.status === "registered") {
            setConnected(true);
            Toast.show({ description: "Connected to parent successfully!" });

            const locationStatus =
              await Location.requestForegroundPermissionsAsync();
            const contactsStatus = await Contacts.requestPermissionsAsync();

            if (locationStatus.status !== "granted") {
              Toast.show({ description: "Location permission denied" });
              return;
            }
            if (contactsStatus.status !== "granted") {
              Toast.show({ description: "Contacts permission denied" });
              return;
            }

            try {
              const location = await Location.getCurrentPositionAsync({});
              const deviceInfo = {
                deviceName: Device.deviceName || "Unknown Device",
                modelName: Device.modelName || "Unknown Model",
                osName: Device.osName || "Unknown OS",
                osVersion: Device.osVersion || "Unknown Version",
              };
              const { data: contacts } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
              });
              const formattedContacts = contacts.map((contact) => ({
                name: contact.name || "Unknown Contact",
                phoneNumbers: contact.phoneNumbers
                  ? contact.phoneNumbers.map((pn) => pn.number || "No Number")
                  : [],
              }));

              const childData = {
                type: "childUpdate",
                clientId: deviceId,
                data: {
                  location: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                  },
                  deviceInfo,
                  contacts: formattedContacts,
                },
              };

              if (websocket.readyState === WebSocket.OPEN) {
                websocket.send(JSON.stringify(childData));
              }
            } catch (error) {
              console.error("Error sending data:", error);
            }
          } else if (data.status === "error") {
            Toast.show({ description: data.message });
            websocket.close();
          }
        };

        websocket.onerror = (error) => {
          Toast.show({ description: "Connection failed. Try again." });
        };

        websocket.onclose = () => {
          setConnected(false);
        };
      } catch (error) {
        Toast.show({ description: "Connection failed. Try again." });
      }
    };

    if (!ws && pairingCode.length === 6) {
      initializeWebSocket();
    }
  }, [pairingCode, ws]);

  useEffect(() => {
    let interval;
    if (connected && ws && ws.readyState === WebSocket.OPEN) {
      interval = setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const deviceInfo = {
            deviceName: Device.deviceName || "Unknown Device",
            modelName: Device.modelName || "Unknown Model",
            osName: Device.osName || "Unknown OS",
            osVersion: Device.osVersion || "Unknown Version",
          };
          const { data: contacts } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
          });
          const formattedContacts = contacts.map((contact) => ({
            name: contact.name || "Unknown Contact",
            phoneNumbers: contact.phoneNumbers
              ? contact.phoneNumbers.map((pn) => pn.number || "No Number")
              : [],
          }));

          const childData = {
            type: "childUpdate",
            clientId: await AsyncStorage.getItem("deviceId"),
            data: {
              location: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              },
              deviceInfo,
              contacts: formattedContacts,
            },
          };

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(childData));
          }
        } catch (error) {
          console.log("Error sending periodic data:", error);
        }
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connected, ws]);

  const connectToParent = () => {
    if (!ws) {
      setPairingCode(pairingCode);
    }
  };

  const goBack = () => {
    navigation.navigate("InitialPage");
    AsyncStorage.clear();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  };

  if (connected) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="lg" color="green.600">
          Connected to Parent! Sending data...
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
