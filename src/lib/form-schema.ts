import { z } from "zod";

export const formSchema = z.object({
  // Tab 1: Dados Gerais (Generic)
  nomeRespondente: z.string().min(3, "Nome muito curto"),
  empresa: z.string().min(2, "Nome da empresa é obrigatório"),
  cargo: z.string().min(2, "Cargo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  celular: z.string().min(10, "Celular inválido"),
  valorPretendido: z.string().min(1, "Informe o valor pretendido"),
  justificativa: z.string().min(10, "Justifique a necessidade do financiamento"),

  // Tab 2: Projeto Amazônia (Specific)
  cidadeEstado: z.string().optional(),
  numeroColaboradores: z.string().optional(),
  faturamentoAnual: z.string().optional(),
  tipoServico: z.array(z.string()).default([]),
  modalTransporte: z.array(z.string()).default([]),
  tamanhoFrota: z.string().optional(),
  capacidadePessoas: z.string().optional(),
  capacidadeCargas: z.string().optional(),
  destinosAtendidos: z.string().optional(),
  fontesFinanciamento: z.string().optional(),
  recursosSustentaveis: z.string().optional(),
  garantias: z.string().optional(),
  // Tab 3: Agronegócio [NEW]
  areaProducao: z.string().optional(),
  principaisCulturas: z.string().optional(),
  maquinarioProprio: z.string().optional(),

  // Tab 4: Construção Civil [NEW]
  estagioProjeto: z.string().optional(),
  licencasAmbientais: z.string().optional(),
  custoMateriais: z.string().optional(),

  desafiosSetor: z.string().optional(),
  oportunidadesSetor: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
