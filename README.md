# Chat App

## Objective

A Chat App for mobile devices using React Native. The app will provide users with a chat interface and options to share images and their location.

### Built with

- JavaScript
- React Native
- Expo

### My Role

Full-stack Web developer

### User Stories

- As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family
- As a user, I want to be able to send messages to my friends and family members to exchange
  the latest news.
- As a user, I want to send images to my friends to show them what I’m currently doing.
- As a user, I want to share my location with my friends to show them where I am.
- As a user, I want to be able to read my messages offline so I can reread conversations at any time.
- As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.

### Key Features

-A page where users can enter their name and choose a background color for the chat screen
before joining the chat.

- A page displaying the conversation, as well as an input field and submit button.
- The chat must provide users with two additional communication features: sending images
  and location data.
- Data gets stored online and offline.

### Built with
-React Native
-React Native Gifted Chat
-Expo
-Firebase including Firestore

### Setting up development environment
-Install Expo CLI: npm install expo-cli -g and login with your Expo account using expo login
-Install necessary procet dependencies: npm i
-Install the Expo Go App from Apple Store or Google Play Store to test the project on your mobile device
-Install Android Studio for Android Emulator or Xcode for ios Simulator to test the app

### Setting up your database
-Sign in at Google Firebase
-Create a new project in test mode
-In there create a Firestore Database
-At 'Settings' -> 'General' -> 'Your apps' -> 'Firestore for Web' generate your configuration object.
-In the App.js file replace the firebaseConfig variable with the configuration info from your own Firestore database:
-firebase.initializeApp({
  -apiKey: "your-api-key",
  -authDomain: "your-authdomain",
  -projectId: "your-project-id",
  -storageBucket: "your-storage-bucket",
  -messagingSenderId: "your-messaging-sender-id",
  -appId: "your-app-id",
-});

### Run the project
-Start the app by running npx expo start or expo start
-Using the Expo Go app start inTouch by scanning the QR code in your terminal
-Using the Emulator/Simulator press a for Android or i for ios
