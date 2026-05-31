import { useEffect } from "react";

import { Redirect, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "@/contexts/auth-context";

export default function IndexScreen() {
  const { initializing, session, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (session) {
      router.replace(role === "lojista" ? "/lojista" : "/consultor");
      return;
    }

    router.replace("/login");
  }, [initializing, role, router, session]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#89f7d1" />
      </View>
    );
  }

  return (
    <Redirect
      href={
        session ? (role === "lojista" ? "/lojista" : "/consultor") : "/login"
      }
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#07111f",
  },
});
