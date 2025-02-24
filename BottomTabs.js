import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Home from "./components/Tabs/Home";
import Profile from "./components/Tabs/Profile";
import Notifications from "./components/Tabs/Notifications";
import Map from "./components/Screens/Map";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
}
export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          left: 10,
          right: 10,
          elevation: 5,
          shadowOpacity: 0.1,
          //   flexDirection: "row",
          //   justifyContent: "center",
          //   alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="notifications" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: "orange",
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Icon name="phone-portrait" color="#fff" size={35} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="person" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
