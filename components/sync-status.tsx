import { useEffect, useState } from "react";

import { Alert, StyleSheet, Text, View } from "react-native";

import {
    readPendingDiagnostics,
    syncPendingDiagnostics,
} from "@/lib/diagnostics";

export function SyncStatus() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const pending = await readPendingDiagnostics();
      setPendingCount(pending.length);
    };

    void load();
  }, []);

  useEffect(() => {
    const sync = async () => {
      const pending = await readPendingDiagnostics();
      if (!pending.length) return;

      try {
        await syncPendingDiagnostics();
        setPendingCount(0);
      } catch (error) {
        Alert.alert(
          "Sincronização",
          error instanceof Error ? error.message : "Falha na sincronização.",
        );
      }
    };

    void sync();
  }, []);

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {pendingCount
          ? `${pendingCount} diagnóstico(s) pendente(s)`
          : "Sincronização em dia"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "rgba(137, 247, 209, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(137, 247, 209, 0.24)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: { color: "#89f7d1", fontSize: 12, fontWeight: "700" },
});
