import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SyncStatus } from "@/components/sync-status";
import { MOCK_ACTION_PLAN_RECORDS } from "@/lib/mock-action-plans";
import { getMockUserByProfile } from "@/lib/mock-users";

export default function ConsultorDashboard() {
  const router = useRouter();
  const user = getMockUserByProfile("consultor");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.kicker}>Painel do Consultor</Text>
        <Text style={styles.title}>Bem-vindo, {user.name}.</Text>
        <Text style={styles.description}>
          Realize diagnósticos de maturidade digital e acompanhe os planos de
          ação dos estabelecimentos.
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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Planos simulados</Text>
        <Text style={styles.sectionSubtitle}>
          Use esses exemplos para navegar pela estrutura dos planos de ação.
        </Text>
      </View>

      {MOCK_ACTION_PLAN_RECORDS.map((record) => {
        const pendingCount = record.actionPlan.filter(
          (task) => task.status === "pendente",
        ).length;

        return (
          <View key={record.id} style={styles.planCard}>
            <View style={styles.planHeaderRow}>
              <View style={styles.planMeta}>
                <Text style={styles.planName}>{record.shopName}</Text>
                <Text style={styles.planCaption}>{record.niche}</Text>
              </View>
              <View style={styles.planScoreBadge}>
                <Text style={styles.planScoreText}>{record.score} pts</Text>
              </View>
            </View>

            <Text style={styles.planSummary}>
              {record.actionPlan.length} tarefas planejadas, {pendingCount} em
              aberto.
            </Text>

            <View style={styles.planActionsRow}>
              <Pressable
                style={styles.planPrimaryButton}
                onPress={() =>
                  router.push({
                    pathname: "/plano-acao",
                    params: { id: record.id },
                  })
                }
              >
                <Text style={styles.planPrimaryText}>Abrir plano</Text>
              </Pressable>
            </View>
          </View>
        );
      })}

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.push("/diagnostico")}
      >
        <Text style={styles.primaryText}>Novo diagnóstico</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/plano-acao")}
      >
        <Text style={styles.secondaryText}>Ver plano de ação</Text>
      </Pressable>
    </ScrollView>
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
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
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
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    color: "#f8fbff",
    fontSize: 18,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "rgba(232, 241, 255, 0.66)",
    lineHeight: 18,
    fontSize: 13,
  },
  planCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    gap: 12,
  },
  planHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  planMeta: {
    flex: 1,
    gap: 4,
  },
  planName: {
    color: "#f8fbff",
    fontSize: 16,
    fontWeight: "800",
  },
  planCaption: {
    color: "rgba(232, 241, 255, 0.72)",
    fontSize: 13,
  },
  planScoreBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(137, 247, 209, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(137, 247, 209, 0.22)",
  },
  planScoreText: {
    color: "#89f7d1",
    fontSize: 12,
    fontWeight: "800",
  },
  planSummary: {
    color: "rgba(232, 241, 255, 0.76)",
    lineHeight: 19,
  },
  planActionsRow: {
    flexDirection: "row",
  },
  planPrimaryButton: {
    minHeight: 44,
    borderRadius: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#89f7d1",
  },
  planPrimaryText: {
    color: "#07111f",
    fontSize: 14,
    fontWeight: "800",
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
});
