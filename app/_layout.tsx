import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Signin from "./signin-login/signin";
import CreateAccount from "./signin-login/create-account";
import Home from "./home/home";
import Transfer from "./transfer/transfer";
import Index from "./index";
import * as SplashScreen from "expo-splash-screen";
import { Text, View, Image } from "react-native";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [loggedin, setLoggedIn] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    prepareApp();
  }, []);

  const prepareApp = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      // Customize the splash screen delay or add additional logic here
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Example: 3-second delay
      await getUser();
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  // checks if user is logged in
  const getUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      setLoggedIn(true);
      console.log("User found: ", user);
    } else {
      setLoggedIn(false);
      console.log("No user found");
    }
  };

  if (!appIsReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#278727",
            marginBottom: 20,
          }}
        >
          Your Digital Wallet Patner!
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "black",
            marginBottom: 20,
          }}
        >
          © Samuel Kibunda 2025
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={loggedin ? "Home" : "Signin"}
    >
      <Stack.Screen name="Index" component={Index} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Transfer" component={Transfer} />
    </Stack.Navigator>
  );
}
