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
import { useState, useEffect } from "react";
import Modal from "react-native-modal";
import Transactions from "./transactions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

export interface TransactionData {
  TransactionId: string;
  UserId: string;
  CounterPartyFirstName: string;
  CounterPartyLastName: string;
  TransactionDate: string;
  Amount: number;
  Type: string;
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

// greets user depending on time of day
const getTimeOfDayGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 17) {
    return "Good Afternoon";
  } else if (currentHour < 20) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

// data for transaction history
interface TransactionDetails {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: number;
  TransactionDate: string;
  TransactionId: string;
  Amount: number;
  Type: string;
}

export interface TransactionInfo {
  TransactionId: string;
  UserId: string;
  CounterPartyFirstName: string;
  CounterPartyLastName: string;
  TransactionDate: string;
  Amount: number;
  Type: string;
}

export default function Home() {
  const navigation = useNavigation<
    StackNavigationProp<{
      Transfer: undefined;
    }>
  >();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [user, setUser] = useState<{
    LastName: string;
    EmailName: string;
    FirstName: string;
  } | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<
    TransactionDetails[]
  >([]);
  const [transactionInfo, setTransactionInfo] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorLoadingTransactionHistory, setErrorLoadingTransactionHistory] =
    useState(false);
  const [showAll, setShowAll] = useState(false);
  const [errorLoadingWalletData, setErrorLoadingWalletData] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [loadingMoneyInOut, setLoadingMoneyInOut] = useState(true);
  const [moneyInOut, setMoneyInOut] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    setGreeting(getTimeOfDayGreeting());

    getUser();
  }, []);

  const getUser = async () => {
    let Fetchuser = await AsyncStorage.getItem("user");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    if (Fetchuser) {
      setUser(JSON.parse(Fetchuser));
      fetchWallet();
    } else {
      console.log("No user found");
    }
  };

  // fetch users balance
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
        getTransactionHistory();
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

  // fetches transaction history
  const getTransactionHistory = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No logged-in user found.");
      }
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.Id;
      const response = await axios.get(
        `http://10.0.2.2:5001/api/users/transactionHistory/${userId}`
      );
      if (response.data) {
        const data = response.data;
        console.log("Transaction history: ", data);
        setTransactionDetails(data);
        setTransactionInfo(data);
        const totals = calculateTransactionTotals(data);
        setMoneyInOut([totals.moneyIn, totals.moneyOut]);
        setLoadingMoneyInOut(false);
        setErrorLoadingWalletData(false);
        setLoading(false);
      } else {
        console.error("Failed to fetch transaction history");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoadingMoneyInOut(false);
    }
  };

  // Calculate money in and money out from transaction history data
  const calculateTransactionTotals = (transactions: TransactionDetails[]) => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.Type && tx.Type.toLowerCase() === "debit") {
          acc.moneyOut += Number(tx.Amount);
        } else if (tx.Type && tx.Type.toLowerCase() === "credit") {
          acc.moneyIn += Number(tx.Amount);
        }
        return acc;
      },
      { moneyIn: 0, moneyOut: 0 }
    );
  };

  // shows more transactions
  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  // filter date
  const filterDate = (date: string) => {
    const now = new Date();
    const newDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - newDate.getTime()) / 1000
    );

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
      <>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : errorLoadingWalletData && !loading ? (
          <View>
            <Text style={styles.errorText}>
              Error loading wallet data. Please try again.
            </Text>
            <View style={styles.retryBox}>
              <Pressable onPress={fetchWallet}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View
              style={{
                justifyContent: "center",
                marginBottom: 5,
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#373737",
                }}
              >
                {greeting} {user?.FirstName || "Guest"}
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  marginBottom: 20,
                  color: "#000",
                }}
              >
                Your Wallet
              </Text>
            </View>

            <View style={styles.boxContainer}>
              <View style={styles.moneyContainer}>
                <View style={styles.moneyBoxContainer}>
                  <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                    K{wallet?.Balance}
                  </Text>
                </View>

                <Pressable 
                style={styles.transferButton}
                onPress={() => navigation.navigate("Transfer")}
                >
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

              <View style={{ marginTop: 30, marginHorizontal: 20 }}>
                <Text style={styles.insightsTitle}>Insights</Text>
                <View style={styles.insightsRow}>
                  <View style={styles.insightBox}>
                    <Text style={styles.insightLabel}>Money in</Text>
                    <Text style={styles.insightValue}>K{moneyInOut[0]}</Text>
                  </View>
                  <View style={styles.insightBox}>
                    <Text style={styles.insightLabel}>Money Out</Text>
                    <Text style={styles.insightValue}>K{moneyInOut[1]}</Text>
                  </View>
                </View>
              </View>

              {transactionDetails.length > 0 ? (
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
                      {transactionDetails?.length > 1 && (
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
                      showAll ? transactionInfo : transactionInfo.slice(0, 1)
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
                                color:
                                  item.Type === "credit"
                                    ? "#008000"
                                    : "#ff0000",
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
                        getTransactionHistory();
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
                <Transactions transactionInfo={transactionInfo} />
              </View>
            </Modal>
          </>
        )}}
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  boxContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
    backgroundColor: "#a2c5c9",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: "40%",
  },
  retryText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  insightsTitle: {
    color: "#373737",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  insightsRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
    width: "100%",
    marginBottom: 20,
  },
  insightBox: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd2d6",
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  insightLabel: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  insightValue: {
    marginTop: 15,
    color: "#000",
    fontWeight: "bold",
    fontSize: 21,
  },
});
