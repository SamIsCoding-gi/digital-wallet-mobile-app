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

const mockWallet: WalletData = {
  UserId: "U001",
  Balance: 1000,
};

const mockUser: userDataType = {
  Id: "U001",
  FirstName: "Samuel",
  LastName: "Kibunda",
  PhoneNumber: 123456789,
  Balance: 1000,
  Email: "samuel@example.com",
};

const mockRecipients: recipientDataType[] = [
  {
    Id: "U002",
    FirstName: "Alice",
    LastName: "Smith",
    Email: "alice@example.com",
    PhoneNumber: 987654321,
  },
  {
    Id: "U003",
    FirstName: "Bob",
    LastName: "Johnson",
    Email: "bob@example.com",
    PhoneNumber: 876543210,
  },
];

export default function Transfer() {
  const [userData] = useState<userDataType | null>(mockUser);
  const [wallet] = useState<WalletData | null>(mockWallet);
  const [amountToSend, setAmountToSend] = useState<number>(0);
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [selectedRecipient, setSelectedRecipient] =
    useState<recipientDataType | null>(null);
  const [searchResults, setSearchResults] = useState<recipientDataType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [moneyTransferred, setMoneyTransferred] = useState(false);

  // Modal visibility
  const [amountModalVisible, setAmountModalVisible] = useState(true);
  const [recipientModalVisible, setRecipientModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

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

  // Recipient screen
  const handleRecipientSearch = (email: string) => {
    setRecipientEmail(email);
    if (email.length > 2) {
      const results = mockRecipients.filter((r) =>
        r.Email.toLowerCase().includes(email.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
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

  // Confirmation screen
  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmationModalVisible(false);
      setMoneyTransferred(true);
    }, 1500);
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
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Transfer Money</Text>

      {/* Amount Modal */}
      <Modal visible={amountModalVisible} animationType="slide" transparent>
        <Pressable
          style={{ position: "absolute", top: 20, left: 20 }}
          onPress={() => {
            setAmountModalVisible(false);
            resetTransfer();
          }}
        >
          <Image
            source={require("../../assets/images/back.png")}
            style={{ width: 25, height: 25 }}
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
                        ? "#000"
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
                <Text style={styles.buttonText}>Next</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Recipient Modal */}
      <Modal visible={recipientModalVisible} animationType="slide" transparent>
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
              value={recipientEmail}
              onChangeText={handleRecipientSearch}
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
                style={[styles.button, { backgroundColor: "#888" }]}
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
                  { backgroundColor: selectedRecipient ? "#000" : "#ccc" },
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
                {new Date().toLocaleDateString()}
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
            />
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.button, { backgroundColor: "#888" }]}
                onPress={() => {
                  setConfirmationModalVisible(false);
                  setRecipientModalVisible(true);
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: "#000" },
                  loading && { backgroundColor: "#ccc" },
                ]}
                onPress={handleSend}
                disabled={loading}
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
            <Pressable
              style={[styles.button, { marginTop: 20 }]}
              onPress={resetTransfer}
            >
              <Text style={styles.buttonText}>Go back home</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    color: "#fff",
    fontSize: 16,
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
