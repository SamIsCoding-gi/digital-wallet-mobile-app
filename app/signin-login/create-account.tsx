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
} from "react-native";
import { useState } from "react";
import { useForm, Controller, set } from "react-hook-form";

export default function CreateAccount() {
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
      Email: "",
      Password: "",
      confirmationPassword: "",
    },
  });
  const onSubmit = (data: any) => console.log(data);

  const formValues = watch();

  // Activate button when all fields are filled and valid
  const submitButtonDisabled =
    !formValues.firstName ||
    !formValues.lastName ||
    !formValues.phoneNumber ||
    !formValues.Email ||
    !formValues.Password ||
    !formValues.confirmationPassword ||
    formValues.Password !== formValues.confirmationPassword ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.Email) ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      formValues.Password
    ) ||
    formValues.phoneNumber.length !== 9 ||
    !/^\d+$/.test(formValues.phoneNumber);

  console.log("Is submitButtonDisabled:", submitButtonDisabled);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 10,
        }}
      >
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginRight: 80,
            marginLeft: 15,
          }}
        >
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
            marginBottom: 30,
          }}
        >
          Setup your account
        </Text>
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
                name="Email"
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
                    marginBottom: 20,
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
                {errors.phoneNumber && (
                  <Text style={{ color: "red" }}>
                    {errors.phoneNumber.message}
                  </Text>
                )}
              </View>
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
                  name="Password"
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
                  name="confirmationPassword"
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
              {errors.confirmationPassword && (
                <Text>
                  {errors.confirmationPassword.type === "required" &&
                    "This is required."}
                  {errors.confirmationPassword.type === "minLength" &&
                    "Password must be at least 8 characters."}
                  {errors.confirmationPassword.type === "validate" &&
                    "Passwords do not match."}
                  {errors.confirmationPassword.type === "pattern" &&
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."}
                </Text>
              )}

              <Pressable
                style={{
                  ...styles.submitButton,
                  backgroundColor: submitButtonDisabled ? "#C3C3C3" : "#a2c5c9",
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
    marginBottom: 50,
  },
});
