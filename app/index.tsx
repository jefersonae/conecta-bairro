import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const roles = [
  {
    title: "Administrador",
    description: "Acessar métricas, gestão e visão geral do programa.",
    href: "/administrador",
  },
  {
    title: "Consultor",
    description: "Abrir diagnósticos, plano de ação e acompanhamento.",
    href: "/consultor",
  },
  {
    title: "Lojista",
    description: "Ver a jornada do lojista e o diagnóstico disponível.",
    href: "/lojista",
  },
] as const;

export default function IndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.kicker}>Conecta Bairro</Text>
          <Text style={styles.title}>Selecione a tela que deseja abrir</Text>
          <Text style={styles.description}>
            Escolha um perfil para entrar diretamente na área correspondente.
          </Text>
        </View>

        <View style={styles.list}>
          {roles.map((role) => (
            <Pressable
              key={role.title}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push(role.href)}
            >
              <Text style={styles.cardTitle}>{role.title}</Text>
              <Text style={styles.cardDescription}>{role.description}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#07111f",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 20,
  },
  headerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 28,
    padding: 24,
    gap: 10,
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
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "rgba(137, 247, 209, 0.1)",
    borderColor: "rgba(137, 247, 209, 0.22)",
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 6,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: "rgba(137, 247, 209, 0.16)",
  },
  cardTitle: {
    color: "#f8fbff",
    fontSize: 18,
    fontWeight: "800",
  },
  cardDescription: {
    color: "rgba(232, 241, 255, 0.72)",
    lineHeight: 20,
    fontSize: 14,
  },
});
