import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

// Background Color options for Chat screen
const backgroundColors = {
  black: { backgroundColor: "#090C08" },
  purple: { backgroundColor: "#474056" },
  grey: { backgroundColor: "#d8d1d8" },
  green: { backgroundColor: "#94ae89" },
};

const SelectedColorOverlay = () => <View style={styles.selectedColorOverlay} />;

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  // Function to handle anonymous sign-in with Firebase Auth
  const handleSignIn = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;

        navigation.navigate("Chat", {
          name,
          color: color || "#FFFFFF",
          userID: user.uid,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to add. Please try later");
      });
  };

  const windowHeight = Dimensions.get("window").height;
  const boxHeight = windowHeight * 0.44;
  const defaultColor = "#FFFFFF";

  const colorOptions = Object.entries(backgroundColors).map(([key, value]) => (
    <TouchableOpacity
      key={key}
      style={[
        styles.color,
        value,
        color === value.backgroundColor && styles.colorSelected,
      ]}
      onPress={() => setColor(value.backgroundColor)}
    >
      {color === value.backgroundColor && <SelectedColorOverlay />}
    </TouchableOpacity>
  ));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/Background-image.png")}
          style={styles.image}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chat App</Text>
          </View>
          <View style={[styles.box, { height: boxHeight }]}>
            <View style={styles.inputContainer}>
              <Image
                source={require("../assets/icon.png")}
                style={styles.inputImage}
              />
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Your Name"
                placeholderTextColor="#ADADAD"
                returnKeyType="done"
              />
            </View>
            <View style={styles.colorContainer}>
              <Text style={styles.colorLabel}>
                Choose your Background Color:
              </Text>
              <View style={styles.colorOptions}>{colorOptions}</View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  titleContainer: {
    flex: 2,
    justifyContent: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: "45%",
  },
  box: {
    backgroundColor: "#FFFFFF",
    width: "88%",
    alignItems: "center",
    marginBottom: "6%",
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  inputContainer: {
    width: "88%",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DBDBDB",
    borderWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    height: 50,
    flex: 1,
  },
  inputImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 10,
    opacity: 0.6,
  },
  colorContainer: {
    width: "88%",
    flex: 1,
  },
  colorLabel: {
    fontSize: 18,
    fontWeight: "300",
    color: "#757083",
    marginBottom: 10,
    marginTop: "10%",
  },
  colorOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColorOverlay: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "transparent",
    top: -4,
    left: -4,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#757083",
    width: "88%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default Start;
