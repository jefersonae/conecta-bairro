import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/lib/supabase";

export type DiagnosticStatus = "pendente" | "sincronizado";

export type DiagnosticAnswer = {
  id: string;
  question: string;
  score: number;
  selected: string;
};

export type ActionTask = {
  id: string;
  title: string;
  description: string;
  status: "pendente" | "em execução" | "concluído";
};

export type DiagnosticRecord = {
  id: string;
  shopName: string;
  shopAddress: string;
  niche: string;
  consultantName: string;
  score: number;
  maturity: "Inicial" | "Intermediário" | "Avançado";
  answers: DiagnosticAnswer[];
  actionPlan: ActionTask[];
  status: DiagnosticStatus;
  createdAt: string;
};

const STORAGE_KEY = "conecta-bairro:diagnostics";
const PENDING_KEY = "conecta-bairro:diagnostics-pending";

export const QUESTIONNAIRE = [
  {
    id: "q1",
    question: "A loja possui canal de vendas online?",
    options: ["Não", "Parcialmente", "Sim"],
    weights: [0, 1, 2],
  },
  {
    id: "q2",
    question: "Usa gestão digital de estoque e pagamentos?",
    options: ["Não", "Algumas ferramentas", "Plataforma completa"],
    weights: [0, 1, 2],
  },
  {
    id: "q3",
    question: "Há presença em redes sociais e marketing digital?",
    options: ["Nenhuma", "Básica", "Ativa"],
    weights: [0, 1, 2],
  },
];

export function scoreDiagnostic(answers: DiagnosticAnswer[]) {
  return answers.reduce((sum, item) => sum + item.score, 0);
}

export function classifyMaturity(score: number) {
  if (score >= 5) return "Avançado";
  if (score >= 3) return "Intermediário";
  return "Inicial";
}

export function generateActionPlan(
  score: number,
  shopName: string,
): ActionTask[] {
  const baseTasks = [
    {
      title: "Criar presença digital",
      description: `Defina perfil e catálogo para ${shopName} em canais gratuitos.`,
    },
    {
      title: "Padronizar pagamentos",
      description:
        "Ative QR Code e meios digitais para reduzir atrito no checkout.",
    },
    {
      title: "Organizar estoque e atendimento",
      description:
        "Centralize estoque, pedidos e mensagens para melhorar a operação.",
    },
  ];

  if (score >= 4) {
    baseTasks.push({
      title: "Expansão de marketing",
      description:
        "Crie campanhas segmentadas para fortalecer a retenção e o ticket médio.",
    });
  }

  return baseTasks.map((task, index) => ({
    id: `task-${Date.now()}-${index}`,
    title: task.title,
    description: task.description,
    status: "pendente",
  }));
}

export async function saveDiagnosticRecord(record: DiagnosticRecord) {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const list = raw ? (JSON.parse(raw) as DiagnosticRecord[]) : [];
  const existing = list.findIndex((item) => item.id === record.id);

  if (existing >= 0) {
    list[existing] = record;
  } else {
    list.unshift(record);
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function updateDiagnosticRecord(record: DiagnosticRecord) {
  await saveDiagnosticRecord(record);
}

export async function listDiagnosticRecords() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [] as DiagnosticRecord[];
  return JSON.parse(raw) as DiagnosticRecord[];
}

export async function queuePendingDiagnostic(record: DiagnosticRecord) {
  const raw = await AsyncStorage.getItem(PENDING_KEY);
  const pending = raw ? (JSON.parse(raw) as DiagnosticRecord[]) : [];
  pending.push(record);
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export async function readPendingDiagnostics() {
  const raw = await AsyncStorage.getItem(PENDING_KEY);
  return raw ? (JSON.parse(raw) as DiagnosticRecord[]) : [];
}

export async function clearPendingDiagnostic(id: string) {
  const pending = await readPendingDiagnostics();
  const next = pending.filter((item) => item.id !== id);
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(next));
}

export async function syncPendingDiagnostics() {
  const pending = await readPendingDiagnostics();
  if (!pending.length) return [];

  const synced: DiagnosticRecord[] = [];

  for (const record of pending) {
    const { error } = await supabase.from("digital_diagnoses").upsert(
      {
        id: record.id,
        shop_name: record.shopName,
        shop_address: record.shopAddress,
        niche: record.niche,
        consultant_name: record.consultantName,
        score: record.score,
        maturity: record.maturity,
        answers: record.answers,
        action_plan: record.actionPlan,
        status: "sincronizado",
      },
      { onConflict: "id" },
    );

    if (!error) {
      const syncedRecord = { ...record, status: "sincronizado" as const };
      await updateDiagnosticRecord(syncedRecord);
      synced.push(syncedRecord);
      await clearPendingDiagnostic(record.id);
    }
  }

  return synced;
}

export async function updateTaskStatus(
  recordId: string,
  taskId: string,
  status: ActionTask["status"],
) {
  const records = await listDiagnosticRecords();
  const record = records.find((item) => item.id === recordId);

  if (!record) return null;

  record.actionPlan = record.actionPlan.map((task) =>
    task.id === taskId ? { ...task, status } : task,
  );

  await updateDiagnosticRecord(record);
  await queuePendingDiagnostic(record);

  return record;
}
