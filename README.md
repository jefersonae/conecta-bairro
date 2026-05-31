# Conecta Bairro

Aplicativo Expo Router com autenticação Supabase, perfil por role e rotas privadas para Lojista e Consultor.

## Setup

1. Crie um projeto no Supabase.
2. Execute o SQL em [supabase/schema.sql](supabase/schema.sql) para criar `profiles`, RLS e o trigger de perfil.
3. Preencha o arquivo [.env](.env) com `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. Instale as dependências com `npm install`.
5. Inicie o app com `npm start` ou `npx expo start`.

## Fluxo de rotas

- Público: `/login` e `/register`
- Privado: `/lojista` e `/consultor`
- Entrada do app: `/`, que redireciona para a área correta conforme a sessão e o role do usuário

## Persistência de sessão

- Em dispositivos nativos a sessão é persistida com `expo-secure-store`.
- No web, o armazenamento cai para `localStorage`.

## Validação

- Login e cadastro usam `react-hook-form` + Zod.
- Erros comuns do Supabase são convertidos para mensagens amigáveis.
