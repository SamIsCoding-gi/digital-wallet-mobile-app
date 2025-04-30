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
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DefaultValues {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  Password: string;
  confirmPassword: string;
}

import { useForm, Controller, set } from "react-hook-form";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

export default function CreateAccount() {
  const navigation = useNavigation();
  const [onfocusePassword, setOnfocusePassword] = useState(false);
  const [onfocuseEmail, setOnfocuseEmail] = useState(false);
  const [onfocuseFirstName, setOnfocuseFirstName] = useState(false);
  const [onfocuseLastName, setOnfocuseLastName] = useState(false);
  const [onfocusePhoneNumber, setOnfocusePhoneNumber] = useState(false);
  const [onfocuseConfirmPassword, setOnfocuseConfirmPassword] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [errorCreatingAccount, setErrorCreatingAccount] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: any) => {
    setErrorCreatingAccount(false);
    setLoading(true);
    createAccount(data);
  };

  // creates user account
  const createAccount = async (data: DefaultValues) => {
    const userId = uuid.v4();
    const dataWithId = { ...data, Id: userId };
    console.log("Data to be sent:", dataWithId);
    try {
      const response = await axios.post(
        "http://10.0.2.2:5001/api/users/create-account",
        dataWithId,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const responseData = response.data;
        console.log("Response data:", responseData);
        await AsyncStorage.setItem("user", JSON.stringify(dataWithId));
        console.log("Created user: ", dataWithId);
        setLoading(false);
        navigation.goBack();
      } else {
        const errorText = response.data;
        console.error("Failed to create account:", errorText);
        setErrorMessages([errorText]);
        setErrorCreatingAccount(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to create account:", error);
      setLoading(false);
      setErrorMessages([
        error instanceof Error ? error.message : String(error),
      ]);
      setErrorCreatingAccount(true);
    }
  };

  const formValues = watch();

  // Activate button when all fields are filled and valid
  const submitButtonDisabled =
    !formValues.firstName ||
    !formValues.lastName ||
    !formValues.phoneNumber ||
    !formValues.email ||
    !formValues.password ||
    !formValues.confirmPassword ||
    formValues.password !== formValues.confirmPassword ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email) ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      formValues.password
    ) ||
    formValues.phoneNumber.length !== 9 ||
    !/^\d+$/.test(formValues.phoneNumber);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexDirection: "row",
            marginHorizontal: 20,
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/images/back.png")}
              style={{
                width: 25,
                height: 25,
                tintColor: "black",
              }}
            />
          </Pressable>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            Setup your account
          </Text>
          <View></View>
        </View>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={[null]}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                flex: 1,
                alignItems: "flex-start",
                marginHorizontal: 30,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  marginBottom: 10,
                  fontWeight: "bold",
                  marginTop: 30,
                }}
              >
                Name
              </Text>

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Name"
                    onBlur={() => setOnfocuseFirstName(false)}
                    onFocus={() => setOnfocuseFirstName(true)}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      ...styles.textInput,
                      borderWidth: onfocuseFirstName ? 2 : 1,
                      borderColor: onfocuseFirstName ? "black" : "grey",
                      marginBottom: 20,
                    }}
                  />
                )}
                name="firstName"
              />
              {errors.firstName && <Text>This is required.</Text>}

              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                Surname
              </Text>

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Surname"
                    onBlur={() => setOnfocuseLastName(false)}
                    onFocus={() => setOnfocuseLastName(true)}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      ...styles.textInput,
                      borderWidth: onfocuseLastName ? 2 : 1,
                      borderColor: onfocuseLastName ? "black" : "grey",
                      marginBottom: 20,
                    }}
                  />
                )}
                name="lastName"
              />

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
                      style={{
                        ...styles.textInput,
                        borderWidth: onfocuseEmail ? 2 : 1,
                        borderColor: error
                          ? "red"
                          : onfocuseEmail
                          ? "black"
                          : "grey",
                        marginBottom: 20,
                      }}
                    />
                    {error && (
                      <Text style={{ color: "red" }}>{error.message}</Text>
                    )}
                  </>
                )}
                name="email"
              />

              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                Phone Number
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: onfocusePhoneNumber ? 2 : 1,
                    borderColor: onfocusePhoneNumber ? "black" : "grey",
                    borderRadius: 12,
                    marginBottom: errors.phoneNumber ? 5 : 20,
                    backgroundColor: "white",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "black",
                      paddingHorizontal: 5,
                    }}
                  >
                    +260
                  </Text>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                      validate: (value) =>
                        /^\d{9}$/.test(value) ||
                        "Phone number must be 9 digits long.",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Phone number"
                        keyboardType="numeric"
                        maxLength={9}
                        onBlur={() => setOnfocusePhoneNumber(false)}
                        onFocus={() => setOnfocusePhoneNumber(true)}
                        onChangeText={(text) =>
                          onChange(text.replace(/[^0-9]/g, ""))
                        }
                        value={value}
                        style={{
                          flex: 1,
                          padding: 15,
                          fontSize: 18,
                          color: "black",
                        }}
                      />
                    )}
                    name="phoneNumber"
                  />
                </View>
              </View>
              {errors.phoneNumber && (
                <Text style={{ color: "red", marginBottom: 20 }}>
                  {errors.phoneNumber.message}
                </Text>
              )}
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

              <Text
                style={{
                  color: "#727272",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                Note: password must be atleast 8 characters long, must contain
                an uppercase and lowerchase character, must contain a numerich
                character and must contain a symbol/special character!
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
                      secureTextEntry={hideConfirmPassword}
                      value={value}
                      style={{
                        flex: 1,
                        padding: 15,
                        fontSize: 18,
                        color: "black",
                      }}
                    />
                  )}
                  name="password"
                />
                <Pressable
                  onPress={() => setHideConfirmPassword(!hidePassword)}
                >
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

              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                Re-type Password
              </Text>
              <Text
                style={{
                  color: "#727272",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                Note: Make sure password's match!
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: onfocuseConfirmPassword ? 2 : 1,
                  borderColor: onfocuseConfirmPassword ? "black" : "grey",
                  borderRadius: 12,
                  marginBottom: 20,
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Re-type Password"
                      onBlur={() => setOnfocuseConfirmPassword(false)}
                      onFocus={() => setOnfocuseConfirmPassword(true)}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={hidePassword}
                      style={{
                        flex: 1,
                        padding: 15,
                        fontSize: 18,
                        color: "black",
                      }}
                    />
                  )}
                  name="confirmPassword"
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
              {errors.confirmPassword && (
                <Text>
                  {errors.confirmPassword.type === "required" &&
                    "This is required."}
                  {errors.confirmPassword.type === "minLength" &&
                    "Password must be at least 8 characters."}
                  {errors.confirmPassword.type === "validate" &&
                    "Passwords do not match."}
                  {errors.confirmPassword.type === "pattern" &&
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."}
                </Text>
              )}

              {!loading ? (
                <Pressable
                  style={{
                    ...styles.submitButton,
                    backgroundColor: submitButtonDisabled
                      ? "#C3C3C3"
                      : "#a2c5c9",
                    marginBottom: errorCreatingAccount ? 0 : 50,
                  }}
                  disabled={submitButtonDisabled}
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
              ) : (
                <View
                  style={{
                    marginTop: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: errorCreatingAccount ? 0 : 100,
                    width: "100%",
                  }}
                >
                  <View style={{ alignItems: "center", marginLeft: 10 }}>
                    <ActivityIndicator size="large" color="black" />
                  </View>
                </View>
              )}

              {errorCreatingAccount && (
                <Text style={{ color: "red", marginTop: 5, marginBottom: 100 }}>
                  {errorMessages.join(", ")}
                </Text>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
  },
  header: {
    marginTop: 5,
    borderBottomColor: "#959595",
    borderBottomWidth: 1,
    paddingBottom: 20,
    width: "100%",
  },
  textInput: {
    padding: 15,
    width: "100%",
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
    width: "100%",
  },
});
