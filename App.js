import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./BottomTabs"; // Assume this includes ParentApp
import Map from "./components/Screens/Map";
import { StatusBar } from "expo-status-bar";
import InitialPage from "./components/AppType/InitialPage";
import ChildApp from "./components/AppType/ChildApp";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("InitialPage");

  useEffect(() => {
    const loadAppType = async () => {
      try {
        const appType = await AsyncStorage.getItem("appType");
        if (appType) {
          setInitialRoute(appType === "Parents" ? "HomeTabs" : "ChildsApp");
        }
      } catch (error) {
        console.log("Error loading app type in App:", error);
      }
    };
    loadAppType();
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="InitialPage" component={InitialPage} />
          <Stack.Screen name="ChildsApp" component={ChildApp} />
          <Stack.Screen name="HomeTabs" component={BottomTabs} />
          <Stack.Screen name="Map" component={Map} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
