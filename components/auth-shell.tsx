import { ReactNode } from "react";

import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Conecta Bairro</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.card}>{children}</View>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#07111f",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 18,
  },
  backgroundGlowTop: {
    position: "absolute",
    top: -120,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(67, 97, 238, 0.28)",
  },
  backgroundGlowBottom: {
    position: "absolute",
    left: -110,
    bottom: -130,
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "rgba(42, 157, 143, 0.2)",
  },
  hero: {
    gap: 10,
    maxWidth: 480,
  },
  kicker: {
    color: "#89f7d1",
    textTransform: "uppercase",
    letterSpacing: 2.4,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: "#f8fbff",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
  },
  subtitle: {
    color: "rgba(232, 241, 255, 0.78)",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "rgba(7, 17, 31, 0.84)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 28,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.26,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 7,
  },
  footer: {
    alignItems: "center",
  },
});
