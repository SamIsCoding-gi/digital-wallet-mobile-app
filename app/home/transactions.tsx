import {
  Text,
  View,
  Pressable,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";

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

export default function Transactions() {
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
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.toLocaleString("default", { month: "long" });
    const year = newDate.getFullYear();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    return `${day}th ${month} ${year}, ${hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      ) : errorLoadingTransactionHistory ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Error loading transaction history.
          </Text>
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
      ) : (
        <View style={{ flex: 1, width: "100%" }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.title}>Transactions</Text>
          </View>
          {transactionHistorydata.length > 0 ? (
            <>
              <FlatList
                data={transactionHistorydata}
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
                    <Text style={styles.idText}>
                      {item.TransactionId.slice(0, 8)}...
                    </Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Text
                        style={[
                          styles.amountText,
                          {
                            color:
                              item.Type === "credit" ? "#008000" : "#ff0000",
                          },
                        ]}
                      >
                        {item.Type === "credit" ? "+" : "-"} K {item.Amount}
                      </Text>
                    </View>
                  </View>
                )}
              />

              {/* {transactionHistorydata.length > 5 && (
                <View style={{ alignItems: "center" }}>
                  <Pressable onPress={handleShowMore}>
                    <Text style={styles.showMoreText}>
                      {showAll ? "Show Less" : "Show More"}
                    </Text>
                  </Pressable>
                </View>
              )} */}
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 10,
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
  title: {
    textAlign: "center",
    color: "#373737",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionCard: {
    backgroundColor: "#ececec",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    minWidth: "100%",
    justifyContent: "space-between",
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
    marginHorizontal: 5,
  },
  amountText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  showMoreText: {
    color: "#0000ff",
    fontSize: 14,
    marginTop: 10,
  },
});
