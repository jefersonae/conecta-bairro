import { useEffect } from 'react';

import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';

export default function LojistaDashboard() {
  const router = useRouter();
  const { initializing, session, profile, role, signOut } = useAuth();

  useEffect(() => {
    if (!initializing && session && role === 'consultor') {
      router.replace('/consultor');
    }
  }, [initializing, role, router, session]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#89f7d1" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (role !== 'lojista') {
    return <ActivityIndicator size="large" color="#89f7d1" />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Erro ao sair', error instanceof Error ? error.message : 'Tente novamente.');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerCard}>
        <Text style={styles.kicker}>Painel do Lojista</Text>
        <Text style={styles.title}>Bem-vindo, {profile?.full_name ?? 'lojista'}.</Text>
        <Text style={styles.description}>
          Você está autenticado e com sessão persistida em armazenamento seguro.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Perfil</Text>
        <Text style={styles.infoValue}>Lojista</Text>
        <Text style={styles.infoCaption}>Esse dashboard só aparece para usuários com role lojista.</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07111f',
  },
  screen: {
    flex: 1,
    backgroundColor: '#07111f',
    padding: 20,
    gap: 16,
    justifyContent: 'center',
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 28,
    padding: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  kicker: {
    color: '#89f7d1',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: '#f8fbff',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  description: {
    color: 'rgba(232, 241, 255, 0.78)',
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: 'rgba(137, 247, 209, 0.1)',
    borderColor: 'rgba(137, 247, 209, 0.22)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 8,
  },
  infoLabel: {
    color: 'rgba(232, 241, 255, 0.64)',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontSize: 11,
    fontWeight: '700',
  },
  infoValue: {
    color: '#f8fbff',
    fontSize: 22,
    fontWeight: '800',
  },
  infoCaption: {
    color: 'rgba(232, 241, 255, 0.72)',
    lineHeight: 20,
  },
  logoutButton: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff7b7b',
  },
  logoutText: {
    color: '#07111f',
    fontSize: 16,
    fontWeight: '800',
  },
});