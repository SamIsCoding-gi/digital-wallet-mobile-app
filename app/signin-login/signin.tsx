import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { useForm, Controller, set } from "react-hook-form";

export default function Signin() {
  const [onfocusePassword, setOnfocusePassword] = useState(false);
  const [onfocuseEmail, setOnfocuseEmail] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Email: "",
      Password: "",
    },
  });
  const onSubmit = (data: any) => console.log(data);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 30,
        }}
      >
        Log in to your account
      </Text>

      <View>
        <Text
          style={{
            color: "black",
            fontSize: 16,
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          Email
        </Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email"
              onBlur={() => setOnfocuseEmail(false)}
              onFocus={() => setOnfocuseEmail(true)}
              onChangeText={onChange}
              value={value}
              style={{
                ...styles.textInput,
                borderWidth: onfocuseEmail ? 2 : 1,
                borderColor: onfocuseEmail ? "black" : "grey",
                marginBottom: 20,
              }}
            />
          )}
          name="Email"
        />
        {errors.Email && <Text>This is required.</Text>}

        <Text
          style={{
            color: "black",
            fontSize: 16,
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          Password
        </Text>
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Password"
              onBlur={() => setOnfocusePassword(false)}
              onFocus={() => setOnfocusePassword(true)}
              onChangeText={onChange}
              value={value}
              style={{
                ...styles.textInput,
                borderWidth: onfocusePassword ? 2 : 1,
                borderColor: onfocusePassword ? "black" : "grey",
                marginBottom: 20,
              }}
            />
          )}
          name="Password"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 16 }}>
            Dont have an account?{" "}
          </Text>
          <Pressable
            onPress={() => Alert.alert("Sign up")}
            style={{
              backgroundColor: "white",
              padding: 5,
            }}
          >
            <Text
              style={{
                color: "blue",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Sign up
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={{
            alignItems: "center",
            borderRadius: 20,
            backgroundColor: "#a2c5c9",
            padding: 15,
            marginTop: 20,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "black",
            }}
          >
            Login
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
  },
  textInput: {
    padding: 15,
    width: 300,
    height: 60,
    marginTop: 5,
    borderRadius: 12,
    backgroundColor: "white",
    color: "black",
    fontSize: 18,
  },
});
