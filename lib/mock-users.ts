export type UserProfile = "administrador" | "consultor" | "lojista";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  company?: string;
  neighborhood?: string;
  status: "Ativo" | "Pendente";
};

const MOCK_USERS: MockUser[] = [
  {
    id: "mock-user-admin-001",
    name: "Mariana Torres",
    email: "mariana.torres@conecta-bairro.dev",
    profile: "administrador",
    company: "Conecta Bairro",
    status: "Ativo",
  },
  {
    id: "mock-user-consultor-001",
    name: "Camila Alves",
    email: "camila.alves@conecta-bairro.dev",
    profile: "consultor",
    company: "Consultoria Local",
    neighborhood: "Centro",
    status: "Ativo",
  },
  {
    id: "mock-user-lojista-001",
    name: "Joao Pereira",
    email: "joao.pereira@conecta-bairro.dev",
    profile: "lojista",
    company: "Mercado Central do Bairro",
    neighborhood: "Vila Nova",
    status: "Ativo",
  },
];

export function getMockUserByProfile(profile: UserProfile) {
  return MOCK_USERS.find((user) => user.profile === profile) ?? MOCK_USERS[0];
}

export { MOCK_USERS };

