import { useMemo, useState } from "react";

import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    classifyMaturity,
    generateActionPlan,
    QUESTIONNAIRE,
    saveDiagnosticRecord,
    scoreDiagnostic,
} from "@/lib/diagnostics";

export default function DiagnosticoScreen() {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [niche, setNiche] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const totalScore = useMemo(() => {
    return QUESTIONNAIRE.reduce(
      (sum, item) => sum + (answers[item.id] ?? 0),
      0,
    );
  }, [answers]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!shopName || !shopAddress || !niche) {
      Alert.alert(
        "Preenchimento obrigatório",
        "Informe loja, endereço e nicho antes de salvar o diagnóstico.",
      );
      return;
    }

    const diagnosticAnswers = QUESTIONNAIRE.map((item) => ({
      id: item.id,
      question: item.question,
      score: item.weights[answers[item.id] ?? 0] ?? 0,
      selected: item.options[answers[item.id] ?? 0] ?? "Não informado",
    }));

    const score = scoreDiagnostic(diagnosticAnswers);
    const record = {
      id: `diagnostic-${Date.now()}`,
      shopName,
      shopAddress,
      niche,
      consultantName: "Consultor em campo",
      score,
      maturity: classifyMaturity(score) as
        | "Inicial"
        | "Intermediário"
        | "Avançado",
      answers: diagnosticAnswers,
      actionPlan: generateActionPlan(score, shopName),
      status: "pendente" as const,
      createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      await saveDiagnosticRecord(record);
      Alert.alert(
        "Diagnóstico registrado",
        "O diagnóstico foi salvo localmente.",
      );
      router.replace("/consultor");
    } catch (error) {
      Alert.alert(
        "Falha",
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o diagnóstico.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.kicker}>Diagnóstico digital</Text>
        <Text style={styles.title}>
          Avalie a maturidade tecnológica do comércio
        </Text>
        <Text style={styles.description}>
          As respostas são armazenadas no dispositivo e podem ser consultadas
          depois.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nome do estabelecimento</Text>
        <TextInput
          value={shopName}
          onChangeText={setShopName}
          style={styles.input}
          placeholder="Ex.: Feira do Bairro"
          placeholderTextColor="rgba(232, 241, 255, 0.4)"
        />
        <Text style={styles.label}>Endereço</Text>
        <TextInput
          value={shopAddress}
          onChangeText={setShopAddress}
          style={styles.input}
          placeholder="Rua, bairro, cidade"
          placeholderTextColor="rgba(232, 241, 255, 0.4)"
        />
        <Text style={styles.label}>Nicho de atuação</Text>
        <TextInput
          value={niche}
          onChangeText={setNiche}
          style={styles.input}
          placeholder="Mercado, moda, alimentação..."
          placeholderTextColor="rgba(232, 241, 255, 0.4)"
        />
      </View>

      {QUESTIONNAIRE.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.question}>{item.question}</Text>
          {item.options.map((option, optionIndex) => (
            <Pressable
              key={option}
              onPress={() => handleSelect(item.id, optionIndex)}
              style={[
                styles.optionButton,
                (answers[item.id] ?? 0) === optionIndex &&
                  styles.optionButtonActive,
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      ))}

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Pontuação atual</Text>
        <Text style={styles.scoreValue}>
          {totalScore} pts ·{" "}
          {totalScore >= 5
            ? "Avançado"
            : totalScore >= 3
              ? "Intermediário"
              : "Inicial"}
        </Text>
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        style={styles.submitButton}
      >
        {submitting ? (
          <ActivityIndicator color="#07111f" />
        ) : (
          <Text style={styles.submitText}>Salvar diagnóstico</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#07111f" },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
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
  title: { color: "#f8fbff", fontSize: 26, lineHeight: 32, fontWeight: "800" },
  description: {
    color: "rgba(232, 241, 255, 0.78)",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 24,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  label: { color: "#eef4ff", fontSize: 13, fontWeight: "700" },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f8fbff",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  question: { color: "#f8fbff", fontSize: 15, fontWeight: "700" },
  optionButton: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  optionButtonActive: {
    backgroundColor: "rgba(137, 247, 209, 0.14)",
    borderColor: "#89f7d1",
  },
  optionText: { color: "#eef4ff", fontSize: 14 },
  scoreCard: {
    backgroundColor: "rgba(137, 247, 209, 0.12)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(137, 247, 209, 0.22)",
  },
  scoreLabel: {
    color: "rgba(232, 241, 255, 0.68)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  scoreValue: { color: "#f8fbff", fontSize: 18, fontWeight: "800" },
  submitButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#89f7d1",
  },
  submitText: { color: "#07111f", fontSize: 16, fontWeight: "800" },
});
