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
  const {
    control,
    handleSubmit,
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

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
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
                marginHorizontal: 20,
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
                Phone Number
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Phone number"
                    onBlur={() => setOnfocusePhoneNumber(false)}
                    onFocus={() => setOnfocusePhoneNumber(true)}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      ...styles.textInput,
                      borderWidth: onfocusePhoneNumber ? 2 : 1,
                      borderColor: onfocusePhoneNumber ? "black" : "grey",
                      marginBottom: 20,
                    }}
                  />
                )}
                name="phoneNumber"
              />
              {errors.phoneNumber && <Text>This is required.</Text>}

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
                    secureTextEntry={true}
                    
                    style={{
                      ...styles.textInput,
                      borderWidth: onfocuseConfirmPassword ? 2 : 1,
                      borderColor: onfocuseConfirmPassword ? "black" : "grey",
                      marginBottom: 20,
                    }}
                  />
                )}
                name="confirmationPassword"
              />

              <Pressable
                style={styles.submitButton}
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
    backgroundColor: "#a2c5c9",
    padding: 15,
    marginTop: 20,
    width: "100%",
  },
});
