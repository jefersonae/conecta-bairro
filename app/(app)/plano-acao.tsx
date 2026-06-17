import { useEffect, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { listDiagnosticRecords, updateTaskStatus } from "@/lib/diagnostics";

export default function PlanoAcaoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [record, setRecord] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!params.id) return;
      const records = await listDiagnosticRecords();
      setRecord(records.find((item) => item.id === params.id) ?? null);
    };

    void load();
  }, [params.id]);

  const updateStatus = async (
    taskId: string,
    status: "pendente" | "em execução" | "concluído",
  ) => {
    if (!record) return;
    const updated = await updateTaskStatus(record.id, taskId, status);
    setRecord(updated ?? record);
  };

  if (!record) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#89f7d1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Plano de Ação</Text>
      <Text style={styles.title}>{record.shopName}</Text>
      <Text style={styles.description}>
        Atualize o status das tarefas e acompanhe o progresso remotamente.
      </Text>

      {record.actionPlan.map((task: any) => (
        <View key={task.id} style={styles.taskCard}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
          <Text style={styles.taskStatus}>Status atual: {task.status}</Text>
          <View style={styles.actionsRow}>
            {(["pendente", "em execução", "concluído"] as const).map(
              (status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(task.id, status)}
                  style={[
                    styles.chip,
                    task.status === status && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      task.status === status && styles.chipTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </Pressable>
              ),
            )}
          </View>
        </View>
      ))}

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#07111f",
  },
  screen: { flex: 1, backgroundColor: "#07111f" },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
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
  taskCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 24,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  taskTitle: { color: "#f8fbff", fontSize: 17, fontWeight: "800" },
  taskDescription: {
    color: "rgba(232, 241, 255, 0.76)",
    fontSize: 13,
    lineHeight: 19,
  },
  taskStatus: {
    color: "#89f7d1",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  chipActive: {
    backgroundColor: "rgba(137, 247, 209, 0.14)",
    borderColor: "#89f7d1",
  },
  chipText: {
    color: "#eef4ff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  chipTextActive: { color: "#89f7d1" },
  backButton: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#89f7d1",
  },
  backText: { color: "#07111f", fontSize: 16, fontWeight: "800" },
});
