import { StyleSheet, Text, View } from "react-native";

import { SyncStatus } from "@/components/sync-status";
import { getMockUserByProfile } from "@/lib/mock-users";

export default function LojistaDashboard() {
  const user = getMockUserByProfile("lojista");

  return (
    <View style={styles.screen}>
      <View style={styles.headerCard}>
        <Text style={styles.kicker}>Painel do Lojista</Text>
        <Text style={styles.title}>Bem-vindo, {user.name}.</Text>
        <Text style={styles.description}>
          Acompanhe seu plano de ação e o progresso das tarefas sugeridas.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Usuário mockado</Text>
        <Text style={styles.infoValue}>{user.email}</Text>
        <Text style={styles.infoCaption}>
          Perfil {user.profile} · {user.company} · {user.neighborhood}
        </Text>
      </View>

      <SyncStatus />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
