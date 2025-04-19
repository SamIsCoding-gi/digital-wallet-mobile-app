import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { useState } from "react";
import { useForm, Controller, set } from "react-hook-form";

export default function Signin() {
  const [onfocusePassword, setOnfocusePassword] = useState(false);
  const [onfocuseEmail, setOnfocuseEmail] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Email: "",
      Password: "",
    },
  });
  const onSubmit = (data: any) => console.log(data);

  const formValues = watch();

  // Activate button when all fields are filled and valid
  const submitButtonDisabled =
    !formValues.Email ||
    !formValues.Password ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.Email) ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      formValues.Password
    )

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

      <View style={{ marginHorizontal: 20 }}>
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
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format.",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder="Email"
                onBlur={() => setOnfocuseEmail(false)}
                onFocus={() => setOnfocuseEmail(true)}
                onChangeText={onChange}
                value={value}
                maxLength={150}
                style={{
                  ...styles.textInput,
                  borderWidth: onfocuseEmail ? 2 : 1,
                  borderColor: error ? "red" : onfocuseEmail ? "black" : "grey",
                  marginBottom: 20,
                }}
              />
              {error && <Text style={{ color: "red" }}>{error.message}</Text>}
            </>
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: onfocusePassword ? 2 : 1,
            borderColor: onfocusePassword ? "black" : "grey",
            borderRadius: 12,
            marginBottom: 20,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <Controller
            control={control}
            rules={{
              maxLength: 150,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Password"
                onBlur={() => setOnfocusePassword(false)}
                onFocus={() => setOnfocusePassword(true)}
                onChangeText={onChange}
                secureTextEntry={hidePassword}
                value={value}
                style={{
                  flex: 1,
                  padding: 15,
                  fontSize: 18,
                  color: "black",
                }}
              />
            )}
            name="Password"
          />
          <Pressable onPress={() => setHidePassword(!hidePassword)}>
            <Image
              source={
                hidePassword
                  ? require("../../assets/images/hidden.png")
                  : require("../../assets/images/shown.png")
              }
              style={{
                width: 30,
                height: 30,
                right: 10,
              }}
            />
          </Pressable>
        </View>
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
            ...styles.submitButton,
            backgroundColor: submitButtonDisabled ? "#C3C3C3" : "#a2c5c9",
          }}
          disabled={submitButtonDisabled}
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
  },
  textInput: {
    padding: 15,
    height: 60,
    marginTop: 5,
    borderRadius: 12,
    backgroundColor: "white",
    color: "black",
    fontSize: 18,
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    marginBottom: 50,
  },
});
