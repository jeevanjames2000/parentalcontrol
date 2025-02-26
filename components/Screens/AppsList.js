import React from "react";
import { View, Text, FlatList, Icon, Pressable, HStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const apps = [
  { name: "Call Logs", icon: "call" },
  { name: "Gallery", icon: "image" },
  { name: "Messages", icon: "chat-bubble" },
  { name: "Camera", icon: "camera" },
  { name: "Contacts", icon: "person" },
  { name: "Settings", icon: "settings" },
  { name: "Clock", icon: "alarm" },
  { name: "Maps", icon: "map" },
  { name: "Music", icon: "music-note" },
  { name: "Videos", icon: "videocam" },
];
export default function AppsList() {
  const navigation = useNavigation();
  const handleRoute = () => {
    navigation.navigate(item.name);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <HStack alignItems="center" p={4}>
        <Pressable onPress={() => navigation.goBack()} p={2}>
          <Icon as={MaterialIcons} name="arrow-back" size="lg" color="black" />
        </Pressable>
        <Text fontSize="lg" fontWeight="bold" ml={4}>
          Apps
        </Text>
      </HStack>
      <FlatList
        data={apps}
        numColumns={3}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{
          padding: 10,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: 15,
              width: 100,
            }}
          >
            <Pressable
              onPress={handleRoute}
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <Icon
                as={MaterialIcons}
                name={item.icon}
                size={10}
                color="purple.500"
              />
            </Pressable>
            <Text mt={2} fontSize="md" color="gray.700">
              {item.name}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
