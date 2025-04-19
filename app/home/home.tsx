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
import Transactions from "./transactions";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxContainer}>
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
      <Transactions />
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
  boxContainer: {
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
    marginTop: 30,
    marginBottom: 20
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
});
