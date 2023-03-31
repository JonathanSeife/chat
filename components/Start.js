import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const backgroundColors = {
  black: { backgroundColor: "#090C08" },
  purple: { backgroundColor: "#474056" },
  grey: { backgroundColor: "#8A95A5" },
  green: { backgroundColor: "#B9C6AE" },
};
export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "" };
  }
  render() {
    const { black, purple, grey, green } = backgroundColors;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("../assets/Background-image.png")}
          style={[styles.image]}
        >
          <Text style={styles.title}>Chat App</Text>
          <View style={styles.box}>
            <TextInput
              style={styles.textInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Enter your name"
            />
            <View>
              <Text style={styles.textBackground}>
                Choose your background color
              </Text>
              <View style={[styles.colors, styles.colorWrapper]}>
                <TouchableOpacity
                  style={[
                    styles.color,
                    black,
                    this.state.color === black.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    this.setState({ color: black.backgroundColor })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    purple,
                    this.state.color === purple.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    this.setState({ color: purple.backgroundColor })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    grey,
                    this.state.color === grey.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() => this.setState({ color: grey.backgroundColor })}
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    green,
                    this.state.color === green.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    this.setState({ color: green.backgroundColor })
                  }
                />
              </View>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonText]}
              title="Start Chatting"
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    resizeMode: "cover",
  },

  title: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "600",
  },
  colors: {
    flexDirection: "row",
  },
  box: {
    width: "88%",
    height: "44%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  color: {
    borderRadius: 25,
    width: 50,
    height: 50,
    marginRight: 25,
  },
  colorSelected: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#000",
  },
  textInput: {
    width: "88%",
    height: 50,
    color: "#757083",
    opacity: 50,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
  },
  textBackground: {
    color: "#757083",
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    opacity: 100,
  },
  text: {
    color: "#757083",
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
  },
  button: {
    height: 50,
    width: "88%",
    backgroundColor: "#757083",
    alighnItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
  },
  colorWrapper: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
