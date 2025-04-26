import { Text, View } from "react-native";
import Signin from "./signin-login/signin";
import CreateAccount from "./signin-login/create-account";
import Home from "./home/home";
import Transfer from "./transfer/transfer";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* <Home /> */}
      {/* <Transfer /> */}
      <Signin />
      {/* <CreateAccount /> */}
    </View>
  );
}
