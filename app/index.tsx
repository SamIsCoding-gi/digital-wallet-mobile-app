import { Text, View } from "react-native";
import Signin from "./signin-login/signin";
import CreateAccount from "./signin-login/create-account";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* <Signin /> */}
      <CreateAccount />
    </View>
  );
}
