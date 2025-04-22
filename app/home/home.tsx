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
import Modal from "react-native-modal";
import Transactions from "./transactions";

export interface TransactionData {
  TransactionId: string;
  UserId: string;
  CounterPartyFirstName: string;
  CounterPartyLastName: string;
  TransactionDate: string;
  Amount: number;
  Type: string;
}

// Default data for UI development
const defaultTransactions: TransactionData[] = [
  {
    TransactionId: "TXN12345678",
    UserId: "U001",
    CounterPartyFirstName: "Alice",
    CounterPartyLastName: "Smith",
    TransactionDate: "2024-06-01T10:15:00Z",
    Amount: 500,
    Type: "credit",
  },
  {
    TransactionId: "TXN87654321",
    UserId: "U001",
    CounterPartyFirstName: "Bob",
    CounterPartyLastName: "Johnson",
    TransactionDate: "2024-06-02T14:30:00Z",
    Amount: 200,
    Type: "debit",
  },
  {
    TransactionId: "TXN23456789",
    UserId: "U001",
    CounterPartyFirstName: "Carol",
    CounterPartyLastName: "Williams",
    TransactionDate: "2024-06-03T09:45:00Z",
    Amount: 1000,
    Type: "credit",
  },
  {
    TransactionId: "TXN34567890",
    UserId: "U001",
    CounterPartyFirstName: "David",
    CounterPartyLastName: "Brown",
    TransactionDate: "2024-06-04T16:20:00Z",
    Amount: 150,
    Type: "debit",
  },
  {
    TransactionId: "TXN45678901",
    UserId: "U001",
    CounterPartyFirstName: "Eve",
    CounterPartyLastName: "Davis",
    TransactionDate: "2024-06-05T11:10:00Z",
    Amount: 300,
    Type: "credit",
  },
  {
    TransactionId: "TXN56789012",
    UserId: "U001",
    CounterPartyFirstName: "Frank",
    CounterPartyLastName: "Miller",
    TransactionDate: "2024-06-06T13:55:00Z",
    Amount: 250,
    Type: "debit",
  },
];

export default function Home() {
  const [transactionHistorydata, setTransactionHistoryData] =
    useState<TransactionData[]>(defaultTransactions);
  const [loading, setLoading] = useState(false);
  const [errorLoadingTransactionHistory, setErrorLoadingTransactionHistory] =
    useState(false);
  const [showAll, setShowAll] = useState(false);

  // shows more transactions
  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  // filter date
  const filterDate = (date: string) => {
    const now = new Date();
    const newDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - newDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxContainer}>
        <View style={styles.moneyContainer}>
          <View style={styles.moneyBoxContainer}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>K500</Text>
          </View>
          <Pressable style={styles.transferButton}>
            <Image
              source={require("../../assets/images/arrows.png")}
              style={{
                width: 30,
                height: 30,
              }}
            />
            <Text style={{ fontSize: 16 }}>Transfer</Text>
          </Pressable>
        </View>

        {transactionHistorydata.length > 0 ? (
          <>
            <View
              style={{
                marginBottom: 20,
                alignItems: "center",
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={styles.title}>Latest transactions</Text>
                {transactionHistorydata.length > 5 && (
                  <View style={{ alignItems: "center" }}>
                    <Pressable onPress={handleShowMore}>
                      <Text style={styles.showMoreText}>See all</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
            <FlatList
              data={
                showAll
                  ? transactionHistorydata
                  : transactionHistorydata.slice(0, 1)
              }
              style={{ marginHorizontal: 20 }}
              keyExtractor={(item) => item.TransactionId}
              renderItem={({ item }) => (
                <View style={styles.transactionCard}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.counterPartyText}>
                      {item.Type === "credit"
                        ? `From: ${item.CounterPartyFirstName} ${item.CounterPartyLastName}`
                        : `To: ${item.CounterPartyFirstName} ${item.CounterPartyLastName}`}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>
                    {filterDate(item.TransactionDate)}
                  </Text>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text
                      style={[
                        styles.amountText,
                        {
                          color: item.Type === "credit" ? "#008000" : "#ff0000",
                        },
                      ]}
                    >
                      {item.Type === "credit" ? "+" : "-"} K {item.Amount}
                    </Text>
                  </View>
                </View>
              )}
            />
          </>
        ) : (
          <View style={styles.centered}>
            <Text style={styles.errorText}>No transactions found.</Text>
            <View style={styles.retryBox}>
              <Pressable
                onPress={() => {
                  /* get transaction logic to be added here later */
                }}
              >
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
      <Modal
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        animationInTiming={500}
        animationOutTiming={500}
        coverScreen={false}
        isVisible={showAll}
        style={{
          margin: 0,
          backgroundColor: "white",
        }}
        onBackdropPress={() => setShowAll(false)}
        onBackButtonPress={() => setShowAll(false)}
        onModalHide={() => setShowAll(false)}
        onModalWillHide={() => setShowAll(false)}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
          }}
        >
          <Pressable
            onPress={() => setShowAll(false)}
            style={{
              marginLeft: 20,
              marginTop: 10,
            }}
          >
            <Image
              source={require("../../assets/images/closeX.png")}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </Pressable>
          <Transactions />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  moneyContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 50,
    paddingTop: 20,
    shadowColor: "black",
    shadowOpacity: 50,
    boxShadow: "black",
    elevation: 10,
    width: "90%",
    marginBottom: 20,
  },
  boxContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  moneyBoxContainer: {
    backgroundColor: "#fbfe80",
    padding: 50,
    borderRadius: 20,
    paddingHorizontal: 100,
  },
  transferButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 30,
  },
  title: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  transactionCard: {
    backgroundColor: "#ececec",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    minWidth: "100%",
    justifyContent: "space-between",
    shadowColor: "black",
    shadowOpacity: 50,
    boxShadow: "black",
    elevation: 10,
  },
  counterPartyText: {
    color: "#000",
    fontSize: 14,
  },
  dateText: {
    color: "#5f5f5f",
    fontSize: 12,
    marginHorizontal: 5,
  },
  idText: {
    color: "#5f5f5f",
    fontSize: 12,
  },
  amountText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  showMoreText: {
    color: "#565656",
    fontSize: 16,
    fontWeight: "bold",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  retryBox: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
