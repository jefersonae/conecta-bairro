import { useEffect, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { supabase } from "@/lib/supabase";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [message, setMessage] = useState("Confirmando seu e-mail...");
  const confirmationCode = Array.isArray(code) ? code[0] : code;

  useEffect(() => {
    const completeAuth = async () => {
      if (!confirmationCode) {
        setMessage("Link de confirmação inválido. Volte para entrar no app.");
        return;
      }

      const { error } =
        await supabase.auth.exchangeCodeForSession(confirmationCode);

      if (error) {
        setMessage(
          "Não foi possível confirmar seu e-mail. Tente entrar novamente.",
        );
        return;
      }

      router.replace("/");
    };

    void completeAuth();
  }, [confirmationCode, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#89f7d1" />
      <Text style={styles.title}>Confirmação de e-mail</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#07111f",
    padding: 24,
  },
  title: {
    color: "#eef4ff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    color: "rgba(232, 241, 255, 0.76)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
