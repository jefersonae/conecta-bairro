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
import type { UserRole } from "@/contexts/auth-context";
import { useAuth } from "@/contexts/auth-context";

const registerSchema = z.object({
  fullName: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres."),
  role: z.enum(["lojista", "consultor"], {
    required_error: "Selecione um tipo de perfil.",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const profileOptions: {
  label: string;
  value: UserRole;
  description: string;
}[] = [
  {
    label: "Lojista",
    value: "lojista",
    description: "Painel com foco em operação comercial e atendimento.",
  },
  {
    label: "Consultor",
    value: "consultor",
    description: "Visão de acompanhamento, apoio e produtividade.",
  },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "consultor",
    },
  });

  const selectedRole = watch("role");

  const footer = useMemo(
    () => (
      <Text style={styles.footerText}>
        Já tem conta?{" "}
        <Link href="/login" style={styles.footerLink}>
          Entrar
        </Link>
      </Text>
    ),
    [],
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      await signUp({
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        role: values.role,
      });

      Alert.alert(
        "Conta criada",
        "Seu cadastro foi enviado para o Supabase. Se a confirmação de e-mail estiver ativa, verifique sua caixa de entrada.",
      );

      router.replace("/login");
    } catch (error) {
      Alert.alert(
        "Falha no cadastro",
        error instanceof Error ? error.message : "Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Cadastre lojistas e consultores com o perfil certo desde o primeiro acesso."
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
            <Text style={styles.label}>Nome completo</Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.fullName ? styles.inputError : null,
                  ]}
                  placeholder="Seu nome completo"
                  placeholderTextColor="rgba(232, 241, 255, 0.4)"
                  autoCapitalize="words"
                  autoCorrect={false}
                  textContentType="name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.fullName ? (
              <Text style={styles.errorText}>{errors.fullName.message}</Text>
            ) : null}
          </View>

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
                  placeholder="Crie uma senha forte"
                  placeholderTextColor="rgba(232, 241, 255, 0.4)"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
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

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tipo de perfil</Text>
            <View style={styles.roleGrid}>
              {profileOptions.map((option) => {
                const active = selectedRole === option.value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() =>
                      setValue("role", option.value, { shouldValidate: true })
                    }
                    style={[
                      styles.roleCard,
                      active ? styles.roleCardActive : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTitle,
                        active ? styles.roleTitleActive : null,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.roleDescription,
                        active ? styles.roleDescriptionActive : null,
                      ]}
                    >
                      {option.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.role ? (
              <Text style={styles.errorText}>{errors.role.message}</Text>
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
              <Text style={styles.submitButtonText}>Criar cadastro</Text>
            )}
          </Pressable>

          <Text style={styles.helperText}>
            O perfil escolhido vai direcionar o usuário para o dashboard correto
            após o login.
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
  roleGrid: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  roleCard: {
    flexGrow: 1,
    flexBasis: 140,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  roleCardActive: {
    backgroundColor: "rgba(137, 247, 209, 0.14)",
    borderColor: "#89f7d1",
  },
  roleTitle: {
    color: "#eef4ff",
    fontSize: 16,
    fontWeight: "800",
  },
  roleTitleActive: {
    color: "#89f7d1",
  },
  roleDescription: {
    color: "rgba(232, 241, 255, 0.68)",
    fontSize: 12,
    lineHeight: 18,
  },
  roleDescriptionActive: {
    color: "rgba(232, 241, 255, 0.9)",
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
