import type { DiagnosticRecord } from "./diagnostics";

const MOCK_ACTION_PLAN_RECORDS: DiagnosticRecord[] = [
  {
    id: "mock-plan-001",
    shopName: "Mercado Central do Bairro",
    shopAddress: "Rua das Flores, 120",
    niche: "Alimentacao",
    consultantName: "Camila Alves",
    score: 2,
    maturity: "Inicial",
    answers: [],
    actionPlan: [
      {
        id: "mock-task-001-1",
        title: "Criar presenca digital",
        description:
          "Defina perfil comercial no Instagram e WhatsApp para atender pedidos e divulgar ofertas semanais.",
        status: "pendente",
      },
      {
        id: "mock-task-001-2",
        title: "Padronizar formas de pagamento",
        description:
          "Ative PIX e QR Code visivel no caixa para reduzir atrito no fechamento.",
        status: "em execução",
      },
      {
        id: "mock-task-001-3",
        title: "Organizar vitrine de produtos",
        description:
          "Separe os itens mais vendidos e destaque promocionais com precos atualizados.",
        status: "pendente",
      },
    ],
    status: "pendente",
    createdAt: "2026-07-10T08:00:00.000Z",
  },
  {
    id: "mock-plan-002",
    shopName: "Atelie Bela Rua",
    shopAddress: "Av. Principal, 455",
    niche: "Moda e acessorios",
    consultantName: "Rafael Santos",
    score: 5,
    maturity: "Avançado",
    answers: [],
    actionPlan: [
      {
        id: "mock-task-002-1",
        title: "Unificar atendimento digital",
        description:
          "Centralize mensagens de redes sociais e WhatsApp em um fluxo unico de resposta.",
        status: "concluído",
      },
      {
        id: "mock-task-002-2",
        title: "Automatizar recompra",
        description:
          "Crie lembretes de retorno para clientes recorrentes e ofertas personalizadas.",
        status: "em execução",
      },
      {
        id: "mock-task-002-3",
        title: "Expandir campanhas pagas",
        description:
          "Teste anuncios por bairro com foco em conversao e ticket medio.",
        status: "pendente",
      },
      {
        id: "mock-task-002-4",
        title: "Aprimorar controle de estoque",
        description:
          "Atualize entradas e saidas diariamente para reduzir ruptura de itens estrategicos.",
        status: "pendente",
      },
    ],
    status: "sincronizado",
    createdAt: "2026-07-11T11:30:00.000Z",
  },
];

export function getMockActionPlanRecord(recordId?: string) {
  const record =
    MOCK_ACTION_PLAN_RECORDS.find((item) => item.id === recordId) ??
    MOCK_ACTION_PLAN_RECORDS[0];

  return {
    ...record,
    answers: [...record.answers],
    actionPlan: record.actionPlan.map((task) => ({ ...task })),
  };
}

export { MOCK_ACTION_PLAN_RECORDS };

