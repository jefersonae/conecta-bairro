import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { z } from "zod";

import { AuthShell } from "@/components/auth-shell";
import { useAuth } from "@/contexts/auth-context";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const footer = useMemo(
    () => (
      <Text style={styles.footerText}>
        Ainda não tem conta?{" "}
        <Link href="/register" style={styles.footerLink}>
          Criar cadastro
        </Link>
      </Text>
    ),
    [],
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      await signIn(values.email.trim().toLowerCase(), values.password);
      router.replace("/");
    } catch (error) {
      Alert.alert(
        "Falha no login",
        error instanceof Error ? error.message : "Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthShell
      title="Entre na sua conta"
      subtitle="Acesse o painel certo para o seu perfil e continue sua operação sem perder sessão."
      footer={footer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formContent}
        >
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.email ? styles.inputError : null,
                  ]}
                  placeholder="voce@empresa.com"
                  placeholderTextColor="rgba(232, 241, 255, 0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.password ? styles.inputError : null,
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(232, 241, 255, 0.4)"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            ) : null}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#07111f" />
            ) : (
              <Text style={styles.submitButtonText}>Entrar</Text>
            )}
          </Pressable>

          <Text style={styles.helperText}>
            Use o e-mail já criado no Supabase para acessar o app.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  formContent: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#eef4ff",
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    color: "#f8fbff",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff7b7b",
  },
  errorText: {
    color: "#ff9d9d",
    fontSize: 12,
  },
  submitButton: {
    marginTop: 4,
    backgroundColor: "#89f7d1",
    minHeight: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    color: "#07111f",
    fontSize: 16,
    fontWeight: "800",
  },
  helperText: {
    color: "rgba(232, 241, 255, 0.68)",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  footerText: {
    color: "rgba(232, 241, 255, 0.72)",
    fontSize: 14,
  },
  footerLink: {
    color: "#89f7d1",
    fontWeight: "700",
  },
});
