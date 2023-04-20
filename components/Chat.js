import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

export default function Chat({ route, navigation, db, isConnected, storage }) {
  //State for storing chat messages
  const [messages, setMessages] = useState([]);
  const { name, userID } = route.params;

  useEffect(() => {
    let name = route.params.name;
    let color = route.params.color;

    navigation.setOptions({ title: name });

    navigation.setOptions({
      headerStyle: {
        backgroundColor: color,
      },
    });

    // Fetching messages from Firebase if connected, otherwise from local storage
    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const fetchedMessages = [];
        querySnapshot.forEach((doc) => {
          const fetchedMessage = doc.data();
          fetchedMessage.createdAt = new Date(
            fetchedMessage.createdAt.seconds * 1000
          );
          fetchedMessages.push(fetchedMessage);
        });

        try {
          await AsyncStorage.setItem(
            "messages",
            JSON.stringify(fetchedMessages)
          );
        } catch (error) {
          console.log(error);
        }

        setMessages(fetchedMessages);
      });

      // Unsubscribe from Firebase listener
      return () => {
        unsubscribe();
      };
    } else {
      // Get cached messages from local storage
      AsyncStorage.getItem("messages").then((cachedMessages) => {
        if (cachedMessages !== null) {
          setMessages(JSON.parse(cachedMessages));
        }
      });
    }
  }, [navigation, route.params.name, route.params.color, db, isConnected]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <View style={{ margin: 5, borderRadius: 13, overflow: "hidden" }}>
          <MapView
            style={{
              width: 150,
              height: 100,
            }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      );
    }
    return null;
  };

  //Customize the chat bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#51A3DF",
          },
          left: {
            backgroundColor: "#E1E5E6",
          },
        }}
      />
    );
  };

  const renderInputToolbar = (isConnected) => (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: route.params.color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar(isConnected)}
        onSend={(messages) => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      <Button title="Leave Chat" onPress={() => navigation.navigate("Start")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
