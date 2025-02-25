import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Box,
  Image,
  Pressable,
  Center,
  Spinner,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Animated, Easing } from "react-native";
import uuid from "react-native-uuid";
export default function InitialPage() {
  const navigation = useNavigation();
  const [selectedApp, setSelectedApp] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadAppType = async () => {
      setTimeout(async () => {
        try {
          const appType = await AsyncStorage.getItem("appType");
          if (appType) {
            setSelectedApp(appType);
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start(() => {
              navigation.replace(
                appType === "Parents" ? "HomeTabs" : "ChildsApp"
              );
            });
          } else {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }).start();
          }
        } catch (error) {
          console.log("Error loading app type:", error);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
      }, 500);
    };
    loadAppType();
    return () => {
      fadeAnim.stopAnimation();
    };
  }, [navigation, fadeAnim]);
  const handleAppSelection = async (appType) => {
    try {
      const deviceId = (await AsyncStorage.getItem("deviceId")) || uuid.v4();
      await AsyncStorage.setItem("deviceId", deviceId);
      await AsyncStorage.setItem("appType", appType);
      setSelectedApp(appType);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace(appType === "Parents" ? "Parents" : "ChildsApp");
      });
    } catch (error) {
      console.log("Error saving app type:", error);
    }
  };
  if (selectedApp) {
    return (
      <Center flex={1}>
        <Spinner size="lg" color="purple.500" />
      </Center>
    );
  }

  // useEffect(() => {
  //   AsyncStorage.clear();
  // }, []);
  return (
    <VStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg="gray.100"
      p={5}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Box
          p={6}
          bg="white"
          borderRadius={20}
          shadow={5}
          mb={8}
          alignItems="center"
        >
          <Text fontSize="2xl" fontWeight="bold" color="purple.600" mt={4}>
            Welcome to Family Guard
          </Text>
          <Text fontSize="md" color="gray.500" textAlign="center" mt={2}>
            Select the app type for your device:
          </Text>
        </Box>
        <VStack
          space={4}
          w="100%"
          p={5}
          flexDirection={"row"}
          display={"flex"}
          justifyContent={"space-between"}
        >
          <Pressable
            onPress={() => handleAppSelection("Parents")}
            bg="purple.500"
            p={4}
            borderRadius={12}
            shadow={3}
            _pressed={{ bg: "purple.600" }}
            _hover={{ bg: "purple.400" }}
          >
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              Parents App
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleAppSelection("Childs")}
            bg="blue.500"
            p={4}
            borderRadius={12}
            shadow={3}
            _pressed={{ bg: "blue.600" }}
            _hover={{ bg: "blue.400" }}
          >
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              Childs App
            </Text>
          </Pressable>
        </VStack>
      </Animated.View>
    </VStack>
  );
}
