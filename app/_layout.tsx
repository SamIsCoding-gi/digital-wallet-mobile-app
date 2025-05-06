import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Signin from "./signin-login/signin";
import CreateAccount from "./signin-login/create-account";
import Home from "./home/home";
import Transfer from "./transfer/transfer";
import Index from "./index";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [loggedin, setLoggedIn] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

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
