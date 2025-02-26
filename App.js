import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./BottomTabs";
import Map from "./components/Screens/Map";
import { StatusBar } from "expo-status-bar";
import InitialPage from "./components/AppType/InitialPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QrCamera from "./components/Streaming/Camera";
import ChildApp from "./components/AppType/ChildApp";
import ParentApp from "./components/AppType/ParentApp";
import Home from "./components/Tabs/Home";
import Contacts from "./components/Screens/Contacts";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import AppsList from "./components/Screens/AppsList";
import CallLogsComponent from "./components/Screens/CallLogs";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("InitialPage");

  useEffect(() => {
    // AsyncStorage.clear();
    const loadAppType = async () => {
      try {
        const appType = await AsyncStorage.getItem("appType");
        if (appType) {
          setInitialRoute(appType === "Parents" ? "Parents" : "ChildsApp");
        }
      } catch (error) {
        console.log("Error loading app type in App:", error);
      }
    };
    loadAppType();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName={initialRoute}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="InitialPage" component={InitialPage} />
              <Stack.Screen name="ChildsApp" component={ChildApp} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AppsList" component={AppsList} />
              <Stack.Screen name="Parents" component={ParentApp} />
              <Stack.Screen name="Contacts" component={Contacts} />
              <Stack.Screen name="Call Logs" component={CallLogsComponent} />
              <Stack.Screen name="Camera" component={QrCamera} />
              <Stack.Screen name="HomeTabs" component={BottomTabs} />
              <Stack.Screen name="Map" component={Map} />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
}
