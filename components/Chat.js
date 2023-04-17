import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const firebase = require("firebase");
require("firebase/firestore");
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
      },
    };
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAPhmtiB3eJNueAZ46vEXihQn5uZqMW4Ro",
        authDomain: "chat-c71a1.firebaseapp.com",
        projectId: "chat-c71a1",
        storageBucket: "chat-c71a1.appspot.com",
        messagingSenderId: "865233048274",
        appId: "1:865233048274:web:b971eb3e2387c14ae9d30b",
      });
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.getMessages();

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
      } else {
        this.setState({ isConnected: false });
      }
    });

    this.referenceChatMessages = firebase.firestore().collection("messages");

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // update user state with current user data
      this.setState({
        uid: user?.uid,
        messages: [],
      });
      // listen for collection changes for current user
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  // save message to Firestore
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  };
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || "",
        },
      });
    });
    this.setState({ messages });
  };

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  }

  render() {
    let { name } = this.props.route.params;
    let { color } = this.props.route.params;
    let loadTextColor =
      color === "#090C08" || color === "#474056" ? "#FFFFFF" : "#090C08";
    return (
      <View style={[styles.mainBox, { backgroundColor: color }]}>
        {this.state.loggedInText !== "" && (
          <Text style={[styles.loadText, { color: loadTextColor }]}>
            {this.state.loggedInText}
          </Text>
        )}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderSystemMessage={this.renderSystemMessage}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: name,
          }}
          style={[styles.mainBox, { backgroundColor: color }]}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainBox: {
    flex: 1,
  },

  loadText: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 30,
  },
});
