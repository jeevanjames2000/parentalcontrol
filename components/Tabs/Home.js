import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [childLocation, setChildLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [childContacts, setChildContacts] = useState([]);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const childData = useSelector((state) => state.child);
  useEffect(() => {
    const initializeMapAndSocket = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let parentLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: parentLocation.coords.latitude,
        longitude: parentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      if (childData && childData.location) {
        setChildLocation(childData.location);
        setChildContacts(childData.contacts || []);
        setRegion({
          latitude: childData.location.lat,
          longitude: childData.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    };
    initializeMapAndSocket();
  }, [childData]);
  const goToChildLocation = () => {
    if (childLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: childLocation.lat,
        longitude: childLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };
  const goBack = () => {
    navigation.navigate("InitialPage");
    AsyncStorage.clear();
  };
  const FeatureBox = ({ title, children }) => (
    <Box bg="white" p={4} borderRadius={8} m={2} shadow={2}>
      <Text fontSize="md" fontWeight="bold">
        {title}
      </Text>
      <HStack justifyContent="space-around" alignItems="center" mt={2}>
        {children}
      </HStack>
    </Box>
  );
  const FeatureButton = ({ iconName, label, onPress }) => (
    <Pressable
      onPress={onPress}
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
    >
      <Icon as={MaterialIcons} name={iconName} size={8} color="purple.500" />
      <Text fontSize="xs" color="gray.500">
        {label}
      </Text>
    </Pressable>
  );
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
                {childData?.deviceInfo?.deviceName.split(" ")[0][0] +
                  childData?.deviceInfo?.deviceName.split(" ")[1][0]}
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
                <Text>{childData?.deviceInfo?.deviceName}</Text>
              </Button>
            </HStack>
            <IconButton
              icon={
                <Icon
                  as={MaterialIcons}
                  name="logout"
                  size="lg"
                  color="blue.500"
                />
              }
              onPress={goBack}
            />
          </HStack>
        </View>
        <Pressable>
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
              region={region}
              showsUserLocation={true}
              showsMyLocationButton={false}
            >
              {childLocation && (
                <Marker
                  coordinate={{
                    latitude: childLocation.lat,
                    longitude: childLocation.lng,
                  }}
                  title="Child Location"
                />
              )}
            </MapView>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={goToChildLocation}
            >
              <Ionicons name="locate" size={18} color="white" />
            </TouchableOpacity>
          </View>
          {childLocation ? (
            <HStack justifyContent="space-between" alignItems="center" mt={2}>
              <Text fontSize="xs" color="gray.500">
                Lat: {childLocation.lat.toFixed(4)}, Lng:{" "}
                {childLocation.lng.toFixed(4)}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Updated: Just now
              </Text>
            </HStack>
          ) : (
            <Text fontSize="xs" color="gray.500" mt={2}>
              Waiting for child's location...
            </Text>
          )}
        </Box>
        <FeatureBox title="Snapshot">
          <FeatureButton
            iconName="photo-camera"
            label="Camera Snapshot"
            onPress={() => console.log("Camera Snapshot")}
          />
          <FeatureButton
            iconName="screenshot-monitor"
            label="Screen Snapshot"
            onPress={() => console.log("Screen Snapshot")}
          />
        </FeatureBox>
        <FeatureBox title="Live Monitoring">
          <FeatureButton
            iconName="videocam"
            label="Remote Camera"
            onPress={() => console.log("Remote Camera")}
          />
          <FeatureButton
            iconName="screen-share"
            label="Screen Mirroring"
            onPress={() => console.log("Screen Mirroring")}
          />
          <FeatureButton
            iconName="mic"
            label="Live Audio"
            onPress={() => console.log("Live Audio")}
          />
        </FeatureBox>
        <FeatureBox title="Device Activity">
          <FeatureButton
            iconName="timer"
            label="Usage Limits"
            onPress={() => console.log("Usage Limits")}
          />
          <FeatureButton
            iconName="contacts"
            label="Contacts"
            onPress={() =>
              navigation.navigate("Contacts", { contacts: childContacts })
            }
          />
          <FeatureButton
            iconName="apps"
            label="Apps List"
            onPress={() => navigation.navigate("AppsList")}
          />
        </FeatureBox>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Actionsheet.Item
              onPress={() => {
                setSelectedDevice("Google Pixel 6a");
                onClose();
              }}
            >
              {childData?.deviceInfo?.deviceName}
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
