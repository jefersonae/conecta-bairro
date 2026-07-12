import { useMemo } from "react";

import { ScrollView, StyleSheet, Text, View } from "react-native";

import { MOCK_ACTION_PLAN_RECORDS } from "@/lib/mock-action-plans";

export default function MetricasScreen() {
  const metrics = useMemo(() => {
    const totalDiagnosticos = MOCK_ACTION_PLAN_RECORDS.length;
    const totalTarefas = MOCK_ACTION_PLAN_RECORDS.reduce(
      (sum, record) => sum + record.actionPlan.length,
      0,
    );
    const tarefasConcluidas = MOCK_ACTION_PLAN_RECORDS.reduce(
      (sum, record) =>
        sum +
        record.actionPlan.filter((task) => task.status === "concluído").length,
      0,
    );
    const tarefasEmExecucao = MOCK_ACTION_PLAN_RECORDS.reduce(
      (sum, record) =>
        sum +
        record.actionPlan.filter((task) => task.status === "em execução")
          .length,
      0,
    );
    const tarefasPendentes =
      totalTarefas - tarefasConcluidas - tarefasEmExecucao;
    const maturidadeMedia =
      totalDiagnosticos === 0
        ? "Inicial"
        : (() => {
            const averageScore =
              MOCK_ACTION_PLAN_RECORDS.reduce(
                (sum, record) => sum + record.score,
                0,
              ) / totalDiagnosticos;

            if (averageScore >= 5) return "Avançado";
            if (averageScore >= 3) return "Intermediário";
            return "Inicial";
          })();

    return {
      totalDiagnosticos,
      totalTarefas,
      tarefasConcluidas,
      tarefasEmExecucao,
      tarefasPendentes,
      maturidadeMedia,
    };
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.kicker}>Métricas</Text>
        <Text style={styles.title}>Painel administrativo</Text>
        <Text style={styles.description}>
          Aqui o administrador acompanha os indicadores consolidados a partir
          dos planos de ação simulados.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Volume de atendimentos</Text>
        <Text style={styles.metricValue}>{metrics.totalDiagnosticos}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.metricLabel}>Maturidade média</Text>
        <Text style={styles.metricValue}>{metrics.maturidadeMedia}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.metricLabel}>Regional</Text>
        <Text style={styles.metricValue}>Todos os bairros</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.metricLabel}>Nicho</Text>
        <Text style={styles.metricValue}>Diversos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Tarefas planejadas</Text>
        <Text style={styles.metricValue}>{metrics.totalTarefas}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.metricLabel}>Tarefas em aberto</Text>
        <Text style={styles.metricValue}>{metrics.tarefasPendentes}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.metricLabel}>Tarefas em execução</Text>
        <Text style={styles.metricValue}>{metrics.tarefasEmExecucao}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.metricLabel}>Tarefas concluídas</Text>
        <Text style={styles.metricValue}>{metrics.tarefasConcluidas}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#07111f" },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 28,
    padding: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  kicker: {
    color: "#89f7d1",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "700",
  },
  title: { color: "#f8fbff", fontSize: 26, lineHeight: 32, fontWeight: "800" },
  description: {
    color: "rgba(232, 241, 255, 0.78)",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  metricLabel: {
    color: "rgba(232, 241, 255, 0.64)",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 11,
  },
  metricValue: { color: "#f8fbff", fontSize: 18, fontWeight: "800" },
});
