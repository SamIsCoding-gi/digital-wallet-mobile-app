import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, set } from "react-hook-form";

interface IFormInput {
  amountToSend: number;
  email: string;
}

interface WalletData {
  UserId: string;
  Balance: number;
}

interface userDataType {
  Id: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: number;
  Balance: number;
  Email: string;
}

interface recipientDataType {
  LastName: string;
  FirstName: string;
  Email: string;
  Id: string;
  PhoneNumber: number;
}

export default function Transfer() {
  const [userData] = useState<userDataType | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [amountToSend, setAmountToSend] = useState<number>(0);
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [selectedRecipient, setSelectedRecipient] =
    useState<recipientDataType | null>(null);
  const [searchResults, setSearchResults] = useState<recipientDataType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [moneyTransferred, setMoneyTransferred] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  // Modal visibility
  const [amountModalVisible, setAmountModalVisible] = useState(true);
  const [recipientModalVisible, setRecipientModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [errorLoadingWalletData, setErrorLoadingWalletData] = useState(false);
  const [lLoadingEmails, setLoadingEmails] = useState(false);
  const [amountScreen, setAmountScreen] = useState(true);
  const [moneyTransfered, setMoneyTransfered] = useState(false);
  const [recipientScreen, setRecipientScreen] = useState(false);
  const [noUserFound, setNoUserFound] = useState(false);
  const [confirmationScreen, setConfirmationScreen] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [onfocusePassword, setOnfocusePassword] = useState(false);

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

  // get user data
  useEffect(() => {
    setLoading(true);
    fetchWallet();
  }, []);

  // fetches users balance
  const fetchWallet = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No logged-in user found.");
      }
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.Id;
      const response = await axios.get(
        `http://10.0.2.2:5001/api/users/wallet/${userId}`
      );
      if (response.data) {
        const data = response.data;
        console.log("current users wallet: ", data);
        setWallet(data);
        setErrorLoadingWalletData(false);
      } else {
        setLoading(false);
        setErrorLoadingWalletData(true);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorLoadingWalletData(true);
    }
    setLoading(false);
  };

  // Amount screen
  const openRecipientModal = () => {
    if (amountToSend < 10 || (wallet && amountToSend > wallet.Balance)) {
      setErrorMessage(`Amount must be between K10 and K${wallet?.Balance}`);
      return;
    }
    setErrorMessage("");
    setAmountModalVisible(false);
    setRecipientModalVisible(true);
  };

  const openConfirmationModal = () => {
    if (!selectedRecipient) {
      setErrorMessage("Please select a recipient.");
      return;
    }
    setErrorMessage("");
    setRecipientModalVisible(false);
    setConfirmationModalVisible(true);
  };

  // Reset all
  const resetTransfer = () => {
    setAmountToSend(0);
    setRecipientEmail("");
    setSelectedRecipient(null);
    setSearchResults([]);
    setMoneyTransferred(false);
    setAmountModalVisible(true);
  };

  // compares password and confirms it with retyped password
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No user logged in user.");
      }
      const parsedUser = JSON.parse(storedUser);
      const currentUserId = parsedUser.Id;
      console.log(
        amountToSend,
        currentUserId,
        data.password,
        selectedRecipient?.Id
      );
      const response = await axios.post(
        "http://10.0.2.2:5001/api/users/transfer",
        {
          amountToSend: amountToSend,
          userId: currentUserId,
          password: data.password,
          recipientId: selectedRecipient?.Id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data;
      console.log(responseData);
      if (responseData.success) {
        setConfirmationModalVisible(false);
        setMoneyTransferred(true);
        setLoading(false);
      } else {
        setErrorMessage(responseData.message || "Transfer failed.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage((error as any).message);
      setLoading(false);
    }
  };

  // function to search for recipient by email
  const searchRecipient = (
    data: recipientDataType | recipientDataType[],
    email: string
  ) => {
    console.log("users found: ", data);
    const results = (Array.isArray(data) ? data : [data]).filter((user) =>
      user.Email.toLowerCase().includes(email.toLowerCase())
    );
    setSearchResults(results);
  };

  // function to search for recipient by email
  const handleEmailSearch = async (email: string) => {
    setNoUserFound(false);
    setErrorMessage("");
    setLoadingEmails(true);
    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        console.error("No user found in localStorage.");
        setErrorLoadingWalletData(true);
        setLoading(false);
        setNoUserFound(true);
        return;
      }
      const parsedUser = JSON.parse(user);
      let currentUserId = parsedUser.Id;
      console.log(currentUserId);
      const response = await axios.get(
        `http://10.0.2.2:5001/api/users/search/${email}?excludeId=${currentUserId}`
      );
      if (response.data) {
        const data = await response.data;

        searchRecipient(data, email);
      } else {
        console.error("User not found");
        setNoUserFound(true);
      }
    } catch (error) {
      console.error(error);
      setNoUserFound(true);
    }
    setLoadingEmails(false);
  };

  // filter date
  const filterDate = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.toLocaleString("default", { month: "long" });
    const year = newDate.getFullYear();
    return `${day}th ${month} ${year}`;
  };

  const formValues = watch();

  const submitButtonDisabled =
    !formValues.password ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      formValues.password
    );
    
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Transfer Money</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ marginTop: 20 }}
        />
      ) : errorLoadingWalletData ? (
        <Text style={styles.error}>
          Error loading wallet data. Please try again.
        </Text>
      ) : (
        <>
          {/* Amount screen */}
          <Modal visible={amountModalVisible} animationType="slide" transparent>
            <Pressable onPress={() => navigation.goBack()}>
              <Image
                source={require("../../assets/images/back.png")}
                style={{ width: 25, height: 25, marginLeft: 20

                 }}
              />
            </Pressable>
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Amount to Transfer</Text>
                <Text style={styles.modalSubtitle}>
                  Amount must be between K10 and K{wallet?.Balance}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={amountToSend ? amountToSend.toString() : ""}
                  onChangeText={(text) =>
                    setAmountToSend(Number(text.replace(/[^0-9]/g, "")))
                  }
                  maxLength={10}
                />
                {errorMessage ? (
                  <Text style={styles.error}>{errorMessage}</Text>
                ) : null}
                <View style={styles.modalButtonRow}>
                  <Pressable
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          amountToSend >= 10 &&
                          wallet &&
                          amountToSend <= wallet.Balance
                            ? "#a2c5c9"
                            : "#ccc",
                      },
                    ]}
                    onPress={openRecipientModal}
                    disabled={
                      !(
                        amountToSend >= 10 &&
                        wallet &&
                        amountToSend <= wallet.Balance
                      )
                    }
                  >
                    <Text style={{ color: "black", fontSize: 16 }}>Next</Text>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Recipient Modal */}
          <Modal
            visible={recipientModalVisible}
            animationType="slide"
            transparent
          >
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Pressable
                style={{ position: "absolute", top: 20, left: 20 }}
                onPress={() => {
                  setRecipientModalVisible(false);
                  setAmountModalVisible(true);
                  setSelectedRecipient(null);
                  setSearchResults([]);
                }}
              >
                <Image
                  source={require("../../assets/images/closeX.png")}
                  style={{ width: 25, height: 25 }}
                />
              </Pressable>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Recipient Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Recipient Email"
                  keyboardType="email-address"
                  onChangeText={(email) => handleEmailSearch(email)}
                  autoCapitalize="none"
                />
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.Id}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[
                        styles.recipientItem,
                        selectedRecipient?.Id === item.Id &&
                          styles.selectedRecipient,
                      ]}
                      onPress={() => setSelectedRecipient(item)}
                    >
                      <Text style={styles.recipientText}>
                        {item.FirstName} {item.LastName} - {item.Email}
                      </Text>
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    recipientEmail.length > 2 ? (
                      <Text style={styles.error}>No users found.</Text>
                    ) : null
                  }
                  style={{ maxHeight: 120, marginBottom: 10 }}
                />
                {errorMessage ? (
                  <Text style={styles.error}>{errorMessage}</Text>
                ) : null}
                <View style={styles.modalButtonRow}>
                  <Pressable
                    style={[styles.button, { backgroundColor: "#a2c5c9" }]}
                    onPress={() => {
                      setRecipientModalVisible(false);
                      setAmountModalVisible(true);
                      setSelectedRecipient(null);
                      setSearchResults([]);
                    }}
                  >
                    <Text style={styles.buttonText}>Previous</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      {
                        backgroundColor: selectedRecipient ? "#a2c5c9" : "#ccc",
                      },
                    ]}
                    onPress={openConfirmationModal}
                    disabled={!selectedRecipient}
                  >
                    <Text style={styles.buttonText}>Next</Text>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Confirmation Modal */}
          <Modal
            visible={confirmationModalVisible}
            animationType="slide"
            transparent
          >
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Pressable
                style={{ position: "absolute", top: 20, left: 20 }}
                onPress={() => {
                  setConfirmationModalVisible(false);
                  setRecipientModalVisible(true);
                }}
              >
                <Image
                  source={require("../../assets/images/closeX.png")}
                  style={{ width: 25, height: 25 }}
                />
              </Pressable>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Confirm Transaction</Text>
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmLabel}>Amount:</Text>
                  <Text style={styles.confirmValue}>K {amountToSend}</Text>
                </View>
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmLabel}>Name:</Text>
                  <Text style={styles.confirmValue}>
                    {selectedRecipient?.FirstName} {selectedRecipient?.LastName}
                  </Text>
                </View>
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmLabel}>Email:</Text>
                  <Text style={styles.confirmValue}>
                    {selectedRecipient?.Email}
                  </Text>
                </View>
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmLabel}>Phone:</Text>
                  <Text style={styles.confirmValue}>
                    {selectedRecipient?.PhoneNumber}
                  </Text>
                </View>
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmLabel}>Date:</Text>
                  <Text style={styles.confirmValue}>
                    {filterDate(new Date().toISOString())}
                  </Text>
                </View>
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
                    name="password"
                  />
                  <Pressable onPress={() => setHidePassword(!hidePassword)}>
                    <Image
                      source={
                        hidePassword
                          ? require("../../assets/images/hidden.png")
                          : require("../../assets/images/shown.png")
                      }
                      style={{
                        width: 25,
                        height: 25,
                        right: 10,
                      }}
                    />
                  </Pressable>
                </View>
                {errorMessage ? (
                  <Text style={styles.error}>{errorMessage}</Text>
                ) : null}
                <View style={styles.modalButtonRow}>
                  <Pressable
                    style={[styles.button, { backgroundColor: "#a2c5c9" }]}
                    onPress={() => {
                      setConfirmationModalVisible(false);
                      setRecipientModalVisible(true);
                    }}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Previous</Text>
                  </Pressable>
                  <Pressable
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 10,
                      marginHorizontal: 5,
                      alignItems: "center",
                      backgroundColor: submitButtonDisabled
                        ? "#888"
                        : "#a2c5c9",
                    }}
                    onPress={handleSubmit(onSubmit)}
                    disabled={submitButtonDisabled}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Send</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Success Modal */}
          <Modal visible={moneyTransferred} animationType="fade" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image
                  source={require("../../assets/images/transfer_success.png")}
                  style={{ width: 90, height: 90, marginBottom: 20 }}
                  resizeMode="contain"
                />
                <Text style={[styles.modalTitle, { color: "#278727" }]}>
                  Transfer Successful
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    marginBottom: 10,
                  }}
                >
                  <Pressable
                    style={[styles.button, { marginTop: 20, padding: 20 }]}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Go back home
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
      <Text style={styles.footer}>© 2025 Samuel Kibunda</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#373737",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(223, 223, 223, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#453E3A",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#453E3A",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold"
  },
  error: {
    color: "#ff0000",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  recipientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  selectedRecipient: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  recipientText: {
    fontSize: 16,
    color: "#222",
  },
  confirmBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 6,
  },
  confirmLabel: {
    fontSize: 15,
    color: "#313131",
  },
  confirmValue: {
    fontSize: 15,
    color: "#313131",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 35,
    color: "#222",
    fontSize: 15,
    textAlign: "center",
  },
});
