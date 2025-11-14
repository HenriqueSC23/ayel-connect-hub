// ============================================
// TIPOS DA APLICAÇÃO AYEL INTRANET
// ============================================
// Este arquivo contém todos os tipos TypeScript da aplicação.
// Facilita a manutenção e garante type-safety.
// Ao conectar com banco de dados, mantenha esses tipos sincronizados
// com o schema do banco.

// Categorias de colaboradores disponíveis no sistema
export type UserCategory =
  | "vendedor"
  | "tecnico"
  | "rh"
  | "administrativo"
  | "outros";

export type BlogCategory = "geral" | "vendedor" | "rh";
export type TrainingCategory = "vendedor" | "tecnico" | "suporte" | "geral";

// Tipo de usuário (define permissões)
export type UserRole = "superadmin" | "admin" | "user";

// ============================================
// USUÁRIO
// ============================================
// Representa um colaborador/usuário do sistema
// BANCO DE DADOS: Esta será a tabela "users" ou "colaboradores"
export interface User {
  id: string;                    // UUID ou auto-increment do banco
  username: string;              // Login único
  email: string;                 // Email corporativo
  password: string;              // ATENÇÃO: No backend, sempre usar hash (bcrypt)
  fullName: string;              // Nome completo
  role: UserRole;                // superadmin | admin | user
  category: UserCategory;        // Categoria do colaborador
  companyId?: string;            // Empresa à qual o usuário pertence (omitido para superadmin)
  setor?: string;                // Setor/departamento
  birthDate?: string;            // Data de nascimento (formato: YYYY-MM-DD)
  photoUrl?: string;             // URL da foto (armazenar no storage/S3)
  createdAt: string;             // Data de criação
}

// ============================================
// POST DO MURAL
// ============================================
// Representa uma publicação no mural (feed)
// BANCO DE DADOS: Tabela "posts"
export interface Post {
  id: string;                    // UUID ou auto-increment
  authorId: string;              // Foreign key para users.id
  authorName: string;            // Nome do autor (desnormalizado para performance)
  title?: string;                // Título opcional
  content: string;               // Texto do post
  imageUrl?: string;             // URL da imagem (storage/S3)
  targetCategory: UserCategory | "todos";  // Para quem o post é visível
  likes: string[];               // Array de user IDs que curtiram
  createdAt: string;             // Data de criação
  companyId?: string;            // Empresa proprietária do post
}

// ============================================
// BLOG POST
// ============================================
export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  companyId: string;
  category: BlogCategory;
  createdAt: string; // YYYY-MM-DD
  updatedAt?: string;
  authorId: string;
}

// ============================================
// TREINAMENTO
// ============================================
export interface Training {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  category: TrainingCategory;
  content: string;
  companyId: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// COMENTÁRIO
// ============================================
// Representa um comentário em um post
// BANCO DE DADOS: Tabela "comments"
export interface Comment {
  id: string;                    // UUID ou auto-increment
  postId: string;                // Foreign key para posts.id
  authorId: string;              // Foreign key para users.id
  authorName: string;            // Nome do autor
  content: string;               // Texto do comentário
  createdAt: string;             // Data de criação
}

// ============================================
// EVENTO DA AGENDA
// ============================================
// Representa um evento no calendário da empresa
// BANCO DE DADOS: Tabela "events"
export interface Event {
  id: string;                    // UUID ou auto-increment
  title: string;                 // Nome do evento
  description: string;           // Descrição detalhada
  date: string;                  // Data do evento (formato: YYYY-MM-DD)
  type: "feriado" | "pagamento" | "reuniao" | "treinamento" | "outro";
  color: string;                 // Cor para exibição (hex ou classe CSS)
  createdBy: string;             // Foreign key para users.id
  createdAt: string;             // Data de criação
  companyId?: string;
}

// ============================================
// COLABORADOR (para lista de aniversariantes)
// ============================================
// Pode ser uma view ou tabela derivada de User
// BANCO DE DADOS: Query JOIN ou VIEW baseada em users
export interface Collaborator {
  id: string;                    // user.id
  fullName: string;              // user.fullName
  category: UserCategory;        // user.category
  email: string;                 // user.email
  setor?: string;                // user.setor
  birthDate?: string;            // user.birthDate
  photoUrl?: string;             // user.photoUrl
  companyId?: string;
}

// ============================================
// ATALHO/LINK RÁPIDO
// ============================================
// Representa um link útil da empresa
// BANCO DE DADOS: Tabela "shortcuts" ou "quick_links"
export interface Shortcut {
  id: string;                    // UUID ou auto-increment
  title: string;                 // Título do link
  url: string;                   // URL completa
  description: string;           // Descrição breve
  icon?: string;                 // Nome do ícone ou URL
  category?: string;             // Categoria do link (opcional)
  createdBy: string;             // Foreign key para users.id
  createdAt: string;             // Data de criação
  companyId?: string;
}

// ============================================
// EMPRESA
// ============================================
export interface Company {
  id: string;
  nome: string;
  cnpj?: string;
  logo?: string;
  brandColor?: string;
  createdAt: string;
}

// ============================================
// RAMAL
// ============================================
export interface Ramal {
  id: string;
  name: string;
  sector: string;
  extension: string;
  phone?: string;
  email?: string;
  companyId: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// CONTEXTO DE AUTENTICAÇÃO
// ============================================
// Estado e métodos do contexto de autenticação
export interface AuthContextType {
  user: User | null;                              // Usuário logado ou null
  login: (username: string, password: string) => Promise<boolean>;  // Função de login
  logout: () => void;                             // Função de logout
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<boolean>;  // Registro
  isAdmin: boolean;                               // Helper: usuário é admin?
}

// ============================================
// DADOS DE CADASTRO
// ============================================
// Dados do formulário de registro
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  category: UserCategory;
}

// ============================================
// FILTROS DE BUSCA
// ============================================
// Para filtrar colaboradores, eventos, etc.
export interface SearchFilters {
  query?: string;                // Texto de busca
  category?: UserCategory;       // Filtrar por categoria
  month?: number;                // Filtrar por mês (1-12)
  type?: string;                 // Filtrar por tipo (eventos)
}
