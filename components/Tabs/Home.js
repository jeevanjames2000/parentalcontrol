import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  VStack,
  HStack,
  Avatar,
  IconButton,
  Icon,
  Text,
  Actionsheet,
  useDisclose,
  Button,
  Box,
  Pressable,
  ScrollView,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Home() {
  const [selectedDevice, setSelectedDevice] = useState("Google Pixel 6a");
  const { isOpen, onOpen, onClose } = useDisclose();
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);
  const goToCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };
  const navigation = useNavigation();
  const goBack = () => {
    navigation.navigate("InitialPage");
    AsyncStorage.clear();
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 50,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <HStack justifyContent="space-between" alignItems="center" p={2}>
            <HStack alignItems="center" justifyContent="left" p={2} space={2}>
              <Avatar bg="blue.500" size="md">
                {selectedDevice.split(" ")[0][0] +
                  selectedDevice.split(" ")[1][0]}
              </Avatar>
              <Button
                variant="outline"
                onPress={onOpen}
                size="sm"
                height={10}
                width={200}
                rightIcon={
                  <Icon
                    as={MaterialIcons}
                    name="keyboard-arrow-down"
                    size="sm"
                    color="blue.500"
                  />
                }
              >
                <Text>{selectedDevice}</Text>
              </Button>
            </HStack>
            <IconButton
              icon={
                <Icon
                  as={MaterialIcons}
                  name="add"
                  size="lg"
                  color="blue.500"
                />
              }
              onPress={goBack}
            />
          </HStack>
        </View>
        <Pressable onPress={() => console.log("View Detailed Data")}>
          <Box bg="white" p={4} borderRadius={8} m={2} shadow={2}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="md" fontWeight="bold">
                Usage Report
              </Text>
              <Icon
                as={MaterialIcons}
                name="bar-chart"
                size="sm"
                color="purple.500"
              />
            </HStack>
            <Text fontSize="xs" color="gray.500">
              View Detailed Data
            </Text>
          </Box>
        </Pressable>
        <Box bg="white" p={4} borderRadius={8} m={2} shadow={2}>
          <TouchableOpacity onPress={() => navigation.navigate("Map")}>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              display="flex"
              flexDirection="row"
              p={2}
            >
              <Text fontSize="md" fontWeight="bold">
                Live Location
              </Text>
              <Ionicons name="chevron-forward" size={18} color="black" />
            </HStack>
          </TouchableOpacity>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={region}
              region={region}
              showsUserLocation={true}
              showsMyLocationButton={false}
            >
              {region && (
                <Marker
                  coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                  title="You are here"
                />
              )}
            </MapView>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={goToCurrentLocation}
            >
              <Ionicons name="locate" size={18} color="white" />
            </TouchableOpacity>
          </View>
          {location && (
            <HStack justifyContent="space-between" alignItems="center" mt={2}>
              <Text fontSize="xs" color="gray.500">
                Geofence: Outside
              </Text>
              <Text fontSize="xs" color="gray.500">
                Update:{" "}
                {Math.floor(
                  (Date.now() - (new Date().getTime() - 29 * 60 * 1000)) / 60000
                )}{" "}
                minutes ago
              </Text>
            </HStack>
          )}
        </Box>
        <Box bg="white" p={4} borderRadius={8} m={2} shadow={2}>
          <Text fontSize="md" fontWeight="bold">
            Snapshot
          </Text>
          <HStack justifyContent="space-around" alignItems="center" mt={2}>
            <Pressable
              onPress={() => console.log("Camera Snapshot")}
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <Icon
                as={MaterialIcons}
                name="photo-camera"
                size="lg"
                color="purple.500"
              />
              <Text fontSize="xs" color="gray.500">
                Camera Snapshot
              </Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("Screen Snapshot")}
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <Icon
                as={MaterialIcons}
                name="screenshot-monitor"
                size="lg"
                color="purple.500"
              />
              <Text fontSize="xs" color="gray.500">
                Screen Snapshot
              </Text>
            </Pressable>
          </HStack>
        </Box>
        <Box bg="white" p={4} borderRadius={8} m={2} shadow={2}>
          <Text fontSize="md" fontWeight="bold">
            Live Monitoring
          </Text>
          <HStack justifyContent="space-around" alignItems="center" mt={2}>
            <Pressable
              onPress={() => console.log("Camera Snapshot")}
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <Icon
                as={MaterialIcons}
                name="videocam"
                size="lg"
                color="purple.500"
              />
              <Text fontSize="xs" color="gray.500">
                Remote Camera
              </Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("Screen Snapshot")}
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <Icon
                as={MaterialIcons}
                name="screen-share"
                size="lg"
                color="purple.500"
              />
              <Text fontSize="xs" color="gray.500">
                Screen Mirroring
              </Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("Screen Snapshot")}
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <Icon
                as={MaterialIcons}
                name="mic"
                size="lg"
                color="purple.500"
              />
              <Text fontSize="xs" color="gray.500">
                Live Audio
              </Text>
            </Pressable>
          </HStack>
        </Box>
        <Box bg="white" p={4} borderRadius={8} m={2} shadow={2}>
          <Text fontSize="md" fontWeight="bold">
            Device Activity
          </Text>
          <HStack justifyContent="space-around" alignItems="center" mt={2}>
            <Pressable
              onPress={() => console.log("Camera Snapshot")}
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <Icon
                as={MaterialIcons}
                name="timer"
                size="lg"
                color="purple.500"
              />
              <Text fontSize="xs" color="gray.500">
                Usage Limits
              </Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("Screen Snapshot")}
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
            >
              <Icon
                as={MaterialIcons}
                name="apps"
                size="lg"
                color="purple.500"
              />
              <Text fontSize="xs" color="gray.500">
                Apps List
              </Text>
            </Pressable>
          </HStack>
        </Box>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Actionsheet.Item
              onPress={() => {
                setSelectedDevice("Google Pixel 6a");
                onClose();
              }}
            >
              Google Pixel 6a
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={() => {
                setSelectedDevice("Device 2");
                onClose();
              }}
            >
              Device 2
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#e8e8e8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  mapContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },
  map: {
    height: 200,
  },
  locationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
