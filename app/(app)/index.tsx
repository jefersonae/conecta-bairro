import { Redirect } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';

export default function PrivateIndexScreen() {
  const { role } = useAuth();

  return <Redirect href={role === 'lojista' ? '/lojista' : '/consultor'} />;
}