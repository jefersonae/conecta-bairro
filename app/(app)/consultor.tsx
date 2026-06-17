import { useEffect } from "react";

import { Redirect, useRouter } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SyncStatus } from "@/components/sync-status";
import { useAuth } from "@/contexts/auth-context";

export default function ConsultorDashboard() {
  const router = useRouter();
  const { initializing, session, profile, role, signOut } = useAuth();

  useEffect(() => {
    if (!initializing && session && role === "lojista") {
      router.replace("/lojista");
    }
  }, [initializing, role, router, session]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#89f7d1" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (role !== "consultor") {
    return <ActivityIndicator size="large" color="#89f7d1" />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      Alert.alert(
        "Erro ao sair",
        error instanceof Error ? error.message : "Tente novamente.",
      );
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerCard}>
        <Text style={styles.kicker}>Painel do Consultor</Text>
        <Text style={styles.title}>
          Bem-vindo, {profile?.full_name ?? "consultor"}.
        </Text>
        <Text style={styles.description}>
          O roteamento privado está ativo e direcionando cada perfil para sua
          área.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Perfil</Text>
        <Text style={styles.infoValue}>Consultor</Text>
        <Text style={styles.infoCaption}>
          Este painel agora inclui o acesso ao diagnóstico digital e a
          sincronização offline.
        </Text>
      </View>

      <SyncStatus />

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.push("/diagnostico" as never)}
      >
        <Text style={styles.primaryText}>Novo diagnóstico</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/plano-acao" as never)}
      >
        <Text style={styles.secondaryText}>Ver plano de ação</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#07111f",
  },
  screen: {
    flex: 1,
    backgroundColor: "#07111f",
    padding: 20,
    gap: 16,
    justifyContent: "center",
  },
  headerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 28,
    padding: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  kicker: {
    color: "#89f7d1",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: "#f8fbff",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
  },
  description: {
    color: "rgba(232, 241, 255, 0.78)",
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: "rgba(137, 247, 209, 0.1)",
    borderColor: "rgba(137, 247, 209, 0.22)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 8,
  },
  infoLabel: {
    color: "rgba(232, 241, 255, 0.64)",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontSize: 11,
    fontWeight: "700",
  },
  infoValue: {
    color: "#f8fbff",
    fontSize: 22,
    fontWeight: "800",
  },
  infoCaption: {
    color: "rgba(232, 241, 255, 0.72)",
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#89f7d1",
  },
  primaryText: {
    color: "#07111f",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  secondaryText: {
    color: "#eef4ff",
    fontSize: 16,
    fontWeight: "800",
  },
  logoutButton: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff7b7b",
  },
  logoutText: {
    color: "#07111f",
    fontSize: 16,
    fontWeight: "800",
  },
});
