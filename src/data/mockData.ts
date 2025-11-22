// ============================================
// DADOS SIMULADOS - MOCK DATA
// ============================================
// Este arquivo contém todos os dados simulados da aplicação.
// 
// ⚠️ IMPORTANTE PARA MIGRAÇÃO COM BANCO DE DADOS:
// 
// 1. Substitua estas variáveis por chamadas de API fetch()
// 2. Crie endpoints REST ou GraphQL no seu backend
// 3. Use async/await para buscar dados do servidor
// 4. Implemente loading states e error handling
// 
// EXEMPLO DE MIGRAÇÃO:
// 
// Antes (mock):
// export const users = [...];
// 
// Depois (API):
// export const getUsers = async (): Promise<User[]> => {
//   const response = await fetch('/api/users');
//   return response.json();
// }
// ============================================

import {
  User,
  Post,
  Comment,
  Event,
  Collaborator,
  Shortcut,
  UserCategory,
  BlogPost,
  Ramal,
  Training,
  Company,
} from "@/types";
import { filterItemsForUser } from "@/lib/audience";

// ============================================
// USUÁRIOS
// ============================================
// BANCO DE DADOS: SELECT * FROM users
// API Endpoint: GET /api/users
export const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@ayel.com.br",
    phone: "(11) 4002-1000",
    password: "admin123", // ⚠️ NUNCA armazene senha em texto plano no backend!
    fullName: "Administrador Sistema",
    role: "admin",
    category: "administrativo",
    setor: "TI",
    birthDate: "1990-05-15",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    username: "joao.silva",
    email: "joao.silva@ayel.com.br",
    phone: "(11) 98888-1234",
    password: "123456",
    fullName: "João Silva",
    role: "user",
    category: "vendedor",
    setor: "Vendas",
    birthDate: "1992-03-20",
    photoUrl: "https://i.pravatar.cc/150?img=12",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    username: "maria.santos",
    email: "maria.santos@ayel.com.br",
    phone: "(11) 97777-4321",
    password: "123456",
    fullName: "Maria Santos",
    role: "user",
    category: "tecnico",
    setor: "Suporte Técnico",
    birthDate: "1988-07-10",
    photoUrl: "https://i.pravatar.cc/150?img=5",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    username: "carlos.oliveira",
    email: "carlos.oliveira@ayel.com.br",
    phone: "(31) 3222-0000",
    password: "123456",
    fullName: "Carlos Oliveira",
    role: "user",
    category: "rh",
    setor: "Recursos Humanos",
    birthDate: "1985-11-25",
    photoUrl: "https://i.pravatar.cc/150?img=8",
    companyId: "c2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    username: "ana.costa",
    email: "ana.costa@ayel.com.br",
    phone: "(31) 93333-2222",
    password: "123456",
    fullName: "Ana Costa",
    role: "user",
    category: "vendedor",
    setor: "Vendas",
    birthDate: "1995-12-05",
    photoUrl: "https://i.pravatar.cc/150?img=9",
    companyId: "c2",
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// EMPRESAS (MULTIEMPRESA)
// ============================================
export const companies: Company[] = [
  {
    id: "c1",
    nome: "Ayel Segurança",
    cnpj: "12.345.678/0001-90",
    logo: "/src/assets/tga-logo.png",
    brandColor: "#3B82F6",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2",
    nome: "Ayel Tecnologia",
    cnpj: "98.765.432/0001-10",
    logo: "/src/assets/tga-logo.png",
    brandColor: "#10B981",
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// POSTS DO MURAL
// ============================================
// BANCO DE DADOS: SELECT * FROM posts ORDER BY createdAt DESC
// API Endpoint: GET /api/posts?category={userCategory}
export const posts: Post[] = [
  {
    id: "1",
    authorId: "1",
    authorName: "Administrador Sistema",
    title: "Bem-vindos a Nova Intranet!",
    content: "Estamos felizes em apresentar nossa nova intranet da Ayel! Aqui voce encontrara todas as informacoes importantes da empresa em um so lugar.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    roleTarget: "all",
    companyTarget: "all",
    likes: ["2", "3", "4"],
    isImportant: true,
    companyId: "c1",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    authorId: "1",
    authorName: "Administrador Sistema",
    title: "Novos Equipamentos para Tecnicos",
    content: "Informamos que chegaram os novos tablets para a equipe tecnica. Passar no RH para retirada.",
    imageUrl: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80",
    roleTarget: "tecnico",
    companyTarget: "c1",
    likes: ["3"],
    isImportant: true,
    companyId: "c1",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    authorId: "1",
    authorName: "Administrador Sistema",
    content: "A meta do mes batida! Parabens a equipe de vendas pelo excelente desempenho. Continuem assim!",
    roleTarget: "vendedor",
    companyTarget: "c2",
    likes: ["2", "5"],
    companyId: "c2",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export const getVisiblePosts = (user: User | null): Post[] => filterItemsForUser(posts, user);



// ============================================
// COMENTÁRIOS
// ============================================
// BANCO DE DADOS: SELECT * FROM comments WHERE postId = ?
// API Endpoint: GET /api/posts/{postId}/comments
export const comments: Comment[] = [
  {
    id: "1",
    postId: "1",
    authorId: "2",
    authorName: "João Silva",
    content: "Ficou muito bom! Parabéns pelo trabalho!",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    postId: "1",
    authorId: "3",
    authorName: "Maria Santos",
    content: "Adorei a interface! Muito mais fácil de usar.",
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    postId: "2",
    authorId: "3",
    authorName: "Maria Santos",
    content: "Ótima notícia! Quando podemos buscar?",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================
// EVENTOS DA AGENDA
// ============================================
// BANCO DE DADOS: SELECT * FROM events WHERE MONTH(date) = ?
// API Endpoint: GET /api/events?month={month}&year={year}
export const events: Event[] = [
  {
    id: "1",
    title: "Dia da Consciência Negra",
    description: "Feriado Nacional",
    date: "2025-11-20",
    type: "feriado",
    color: "#EF4444",
    createdBy: "1",
    companyId: "c1",
    roleTarget: "all",
    companyTarget: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Pagamento Mensal",
    description: "Data de pagamento dos colaboradores",
    date: "2025-11-28",
    type: "pagamento",
    color: "#10B981",
    createdBy: "1",
    companyId: "c1",
    roleTarget: "all",
    companyTarget: "all",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Reunião Geral",
    description: "Reunião mensal com todos os setores",
    date: "2025-11-15",
    type: "reuniao",
    color: "#3B82F6",
    createdBy: "1",
    companyId: "c1",
    roleTarget: "all",
    companyTarget: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Treinamento de Vendas",
    description: "Capacitação da equipe comercial",
    date: "2025-11-18",
    type: "treinamento",
    color: "#F59E0B",
    createdBy: "1",
    companyId: "c2",
    roleTarget: "vendedor",
    companyTarget: "c2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Natal",
    description: "Feriado Nacional",
    date: "2025-12-25",
    type: "feriado",
    color: "#EF4444",
    createdBy: "1",
    companyId: "c2",
    roleTarget: "all",
    companyTarget: "all",
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// COLABORADORES (derivado de users)
// ============================================
// BANCO DE DADOS: SELECT id, fullName, category, email, setor, birthDate, photoUrl FROM users
// API Endpoint: GET /api/collaborators
export const collaborators: Collaborator[] = users.map(user => ({
  id: user.id,
  fullName: user.fullName,
  category: user.category,
  email: user.email,
  phone: user.phone,
  setor: user.setor,
  birthDate: user.birthDate,
  photoUrl: user.photoUrl,
  companyId: user.companyId,
}));

// ============================================
// ATALHOS/LINKS RÁPIDOS
// ============================================
// BANCO DE DADOS: SELECT * FROM shortcuts ORDER BY title
// API Endpoint: GET /api/shortcuts
export const shortcuts: Shortcut[] = [
  {
    id: "1",
    title: "Portal RH",
    url: "https://rh.ayel.com.br",
    description: "Acesse holerites, férias e benefícios",
    icon: "Users",
    category: "interno",
    createdBy: "1",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Sistema de Vendas",
    url: "https://vendas.ayel.com.br",
    description: "CRM e gestão de propostas",
    icon: "ShoppingCart",
    category: "interno",
    createdBy: "1",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Suporte Técnico",
    url: "https://suporte.ayel.com.br",
    description: "Sistema de chamados e atendimento",
    icon: "Wrench",
    category: "interno",
    createdBy: "1",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Email Corporativo",
    url: "https://mail.ayel.com.br",
    description: "Webmail da empresa",
    icon: "Mail",
    category: "externo",
    createdBy: "1",
    companyId: "c2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Drive Compartilhado",
    url: "https://drive.ayel.com.br",
    description: "Documentos e arquivos da empresa",
    icon: "FolderOpen",
    category: "interno",
    createdBy: "1",
    companyId: "c2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Portal Porto Seguro",
    url: "https://portoseguro.com.br",
    description: "Acesso aos sistemas Porto Seguro",
    icon: "Shield",
    category: "externo",
    createdBy: "1",
    companyId: "c2",
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// RAMAIS
// ============================================
export const ramais: Ramal[] = [
  {
    id: "r1",
    name: "Central Administrativa",
    sector: "Administrativo",
    extension: "100",
    phone: "(11) 4002-8922",
    email: "adm@ayel.com.br",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r2",
    name: "João Silva",
    sector: "Vendas",
    extension: "210",
    phone: "(11) 98888-1234",
    email: "joao.silva@ayel.com.br",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r3",
    name: "Suporte Técnico",
    sector: "Técnico",
    extension: "350",
    phone: "(11) 97777-4321",
    email: "suporte@ayel.com.br",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r4",
    name: "Recursos Humanos",
    sector: "RH",
    extension: "150",
    phone: "(31) 3222-0000",
    email: "rh@ayeltech.com",
    companyId: "c2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r5",
    name: "Comercial",
    sector: "Vendas",
    extension: "250",
    phone: "(31) 93333-2222",
    companyId: "c2",
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// TREINAMENTOS
// ============================================
export const trainings: Training[] = [
  {
    id: "t1",
    title: "Boas práticas de vendas consultivas",
    shortDescription: "Técnicas e scripts para conduzir negociações de alto valor.",
    imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=60",
    category: "vendedor",
    content: "Neste treinamento você aprenderá a mapear dores do cliente, montar propostas focadas em valor e utilizar gatilhos de urgência sem perder a empatia.",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Checklist técnico de instalações",
    shortDescription: "Fluxos para instalação segura dos equipamentos Ayel.",
    imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1200&q=60",
    category: "tecnico",
    content: "Revise cada etapa de instalação, desde a chegada no cliente até os testes finais dos sensores e centrais de alarme. Inclui checklists imprimíveis.",
    companyId: "c1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t3",
    title: "Atendimento N1 para suporte",
    shortDescription: "Orientações para diagnosticar e resolver chamados recorrentes.",
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=60",
    category: "suporte",
    content: "Procedimentos de troubleshooting, scripts de comunicação e fluxos de escalonamento para equipes de suporte da Ayel Tecnologia.",
    companyId: "c2",
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// HELPERS: Companies CRUD (in-memory/mock)
// ============================================
export const createCompany = async (companyData: Omit<Company, "id" | "createdAt">): Promise<Company> => {
  await simulateNetworkDelay();
  const newCompany: Company = {
    ...companyData,
    id: `c${companies.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  companies.push(newCompany);
  return newCompany;
};

export const updateCompany = async (id: string, data: Partial<Company>): Promise<Company | null> => {
  await simulateNetworkDelay();
  const idx = companies.findIndex(c => c.id === id);
  if (idx === -1) return null;
  companies[idx] = { ...companies[idx], ...data };
  return companies[idx];
};

export const deleteCompany = async (id: string): Promise<boolean> => {
  await simulateNetworkDelay();
  const idx = companies.findIndex(c => c.id === id);
  if (idx === -1) return false;
  companies.splice(idx, 1);
  return true;
};

// ============================================
// HELPERS: Ramais CRUD (in-memory/mock)
// ============================================
export const createRamal = async (ramalData: Omit<Ramal, "id" | "createdAt" | "updatedAt">): Promise<Ramal> => {
  await simulateNetworkDelay();
  const newRamal: Ramal = {
    ...ramalData,
    id: `r${ramais.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  ramais.push(newRamal);
  return newRamal;
};

export const updateRamal = async (id: string, data: Partial<Ramal>): Promise<Ramal | null> => {
  await simulateNetworkDelay();
  const idx = ramais.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  ramais[idx] = { ...ramais[idx], ...data, updatedAt: new Date().toISOString() };
  return ramais[idx];
};

export const deleteRamal = async (id: string): Promise<boolean> => {
  await simulateNetworkDelay();
  const idx = ramais.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  ramais.splice(idx, 1);
  return true;
};

// ============================================
// HELPERS: Treinamentos CRUD (in-memory/mock)
// ============================================
export const createTraining = async (trainingData: Omit<Training, "id" | "createdAt" | "updatedAt">): Promise<Training> => {
  await simulateNetworkDelay();
  const newTraining: Training = {
    ...trainingData,
    id: `t${trainings.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  trainings.push(newTraining);
  return newTraining;
};

export const updateTraining = async (id: string, data: Partial<Training>): Promise<Training | null> => {
  await simulateNetworkDelay();
  const idx = trainings.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  trainings[idx] = { ...trainings[idx], ...data, updatedAt: new Date().toISOString() };
  return trainings[idx];
};

export const deleteTraining = async (id: string): Promise<boolean> => {
  await simulateNetworkDelay();
  const idx = trainings.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  trainings.splice(idx, 1);
  return true;
};

// ============================================
// FUNÇÕES HELPER PARA SIMULAÇÃO DE API
// ============================================
// Estas funções simulam delays de rede e operações assíncronas
// Ao migrar para API real, substitua por fetch() real

/**
 * Simula delay de rede (pode ser removido ao usar API real)
 */
export const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Busca usuário por username e password
 * API: POST /api/auth/login
 */
export const findUserByCredentials = async (
  username: string, 
  password: string
): Promise<User | null> => {
  await simulateNetworkDelay();
  return users.find(u => u.username === username && u.password === password) || null;
};

/**
 * Busca usuário por ID
 * API: GET /api/users/{id}
 */
export const findUserById = async (id: string): Promise<User | null> => {
  await simulateNetworkDelay();
  return users.find(u => u.id === id) || null;
};

/**
 * Cria novo usuário
 * API: POST /api/users
 */
export const createUser = async (userData: Omit<User, "id" | "createdAt">): Promise<User> => {
  await simulateNetworkDelay();
  const newUser: User = {
    ...userData,
    id: String(users.length + 1),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

/**
 * Busca aniversariantes do mês
 * API: GET /api/collaborators/birthdays?month={month}
 */
export const getBirthdaysByMonth = (month: number): Collaborator[] => {
  return collaborators.filter(c => {
    if (!c.birthDate) return false;
    const birthMonth = new Date(c.birthDate).getMonth() + 1;
    return birthMonth === month;
  });
};
