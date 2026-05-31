import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "@/contexts/auth-context";

export default function AuthLayout() {
  const { initializing, session, role } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#89f7d1" />
      </View>
    );
  }

  if (session) {
    return <Redirect href={role === "lojista" ? "/lojista" : "/consultor"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#07111f",
  },
});
