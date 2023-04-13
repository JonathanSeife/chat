import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase";
import firestore from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAPhmtiB3eJNueAZ46vEXihQn5uZqMW4Ro",
  authDomain: "chat-c71a1.firebaseapp.com",
  projectId: "chat-c71a1",
  storageBucket: "chat-c71a1.appspot.com",
  messagingSenderId: "865233048274",
  appId: "1:865233048274:web:b971eb3e2387c14ae9d30b",
};

// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {},
    };
  }
  componentDidMount() {
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.unsubscribe = this.referenceChatMessages.onSnapshot(
      this.onCollectionUpdate
    );

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: this.props.route.params.name,
        },
        loggedInText: "",
      });

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    if (this.referenceChatMessages) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });

    this.setState({ messages });
  };

  // add message to firestore
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      image: message.image || null,
      location: message.location || null,
      text: message.text || "",
      uid: this.state.uid,
      user: message.user,
    });
  };

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage(messages);
      }
    );
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
