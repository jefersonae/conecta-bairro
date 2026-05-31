export function getFriendlyAuthErrorMessage(errorMessage: string): string {
  const message = errorMessage.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
  }

  if (message.includes("user already registered")) {
    return "Esse e-mail já está cadastrado. Tente entrar com sua conta.";
  }

  if (message.includes("email not confirmed")) {
    return "Sua conta ainda não foi confirmada. Verifique sua caixa de entrada.";
  }

  if (message.includes("password should be at least")) {
    return "A senha precisa ter no mínimo 6 caracteres.";
  }

  if (message.includes("fetch")) {
    return "Não foi possível se conectar ao Supabase. Verifique a URL e a anon key.";
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}
