import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";

import { useEffect } from "react";
import { LogBox, Alert } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { getStorage } from "firebase/storage";

import Start from "./components/Start";
import Chat from "./components/Chat";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from",
  "Cannot connect to Metro",
]);

const Stack = createStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAPhmtiB3eJNueAZ46vEXihQn5uZqMW4Ro",
    authDomain: "chat-c71a1.firebaseapp.com",
    projectId: "chat-c71a1",
    storageBucket: "chat-c71a1.appspot.com",
    messagingSenderId: "865233048274",
    appId: "1:865233048274:web:b971eb3e2387c14ae9d30b",
  };

  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const connectionStatus = useNetInfo();

  // Monitor changes in the network connection status
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Render the app with NavigationContainer
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
