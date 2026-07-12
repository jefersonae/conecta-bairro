import { useEffect, useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { listDiagnosticRecords } from "@/lib/diagnostics";

export function SyncStatus() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const records = await listDiagnosticRecords();
      setCount(records.length);
    };

    void load();
  }, []);

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count
          ? `${count} diagnóstico(s) registrado(s)`
          : "Nenhum diagnóstico registrado"}
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
