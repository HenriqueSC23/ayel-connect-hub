// ============================================
// TIPOS DA APLICAÃÃO AYEL INTRANET
// ============================================
// Este arquivo contÃ©m todos os tipos TypeScript da aplicaÃ§Ã£o.
// Facilita a manutenÃ§Ã£o e garante type-safety.
// Ao conectar com banco de dados, mantenha esses tipos sincronizados
// com o schema do banco.

// Categorias de colaboradores disponÃ­veis no sistema
export type UserCategory =
  | "vendedor"
  | "tecnico"
  | "rh"
  | "administrativo"
  | "outros";

export type BlogCategory = "geral" | "vendedor" | "rh";
export type TrainingCategory = "vendedor" | "tecnico" | "suporte" | "geral";

// Tipo de usuÃ¡rio (define permissÃµes)
export type UserRole = "superadmin" | "admin" | "user";

// ============================================
// USUÃRIO
// ============================================
// Representa um colaborador/usuÃ¡rio do sistema
// BANCO DE DADOS: Esta serÃ¡ a tabela "users" ou "colaboradores"
export interface User {
  id: string;                    // UUID ou auto-increment do banco
  username: string;              // Login Ãºnico
  email: string;                 // Email corporativo
  phone?: string;                // Telefone corporativo ou celular de contato
  password: string;              // ATENÃÃO: No backend, sempre usar hash (bcrypt)
  fullName: string;              // Nome completo
  role: UserRole;                // superadmin | admin | user
  category: UserCategory;        // Categoria do colaborador
  companyId?: string;            // Empresa Ã  qual o usuÃ¡rio pertence (omitido para superadmin)
  setor?: string;                // Setor/departamento
  birthDate?: string;            // Data de nascimento (formato: YYYY-MM-DD)
  photoUrl?: string;             // URL da foto (armazenar no storage/S3)
  createdAt: string;             // Data de criaÃ§Ã£o
}

// ============================================
// POST DO MURAL
// ============================================
// Representa uma publicaÃ§Ã£o no mural (feed)
// BANCO DE DADOS: Tabela "posts"
export type PostRoleTarget = UserCategory | "all";
export type CompanyTarget = "all" | string;

export interface Post {
  id: string;                    // UUID ou auto-increment
  authorId: string;              // Foreign key para users.id
  authorName: string;            // Nome do autor (desnormalizado para performance)
  title?: string;                // TÃ­tulo opcional
  content: string;               // Texto do post
  imageUrl?: string;             // URL da imagem (storage/S3)
  roleTarget: PostRoleTarget;    // FunÃ§Ã£o alvo do post
  companyTarget: CompanyTarget;  // Empresa alvo do post
  isImportant?: boolean;         // Indica se é comunicado importante
  likes: string[];               // Array de user IDs que curtiram
  createdAt: string;             // Data de criaÃ§Ã£o
  companyId?: string;            // Empresa proprietÃ¡ria do post
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
// COMENTÃRIO
// ============================================
// Representa um comentÃ¡rio em um post
// BANCO DE DADOS: Tabela "comments"
export interface Comment {
  id: string;                    // UUID ou auto-increment
  postId: string;                // Foreign key para posts.id
  authorId: string;              // Foreign key para users.id
  authorName: string;            // Nome do autor
  content: string;               // Texto do comentÃ¡rio
  createdAt: string;             // Data de criaÃ§Ã£o
}

// ============================================
// EVENTO DA AGENDA
// ============================================
// Representa um evento no calendÃ¡rio da empresa
// BANCO DE DADOS: Tabela "events"
export interface Event {
  id: string;                    // UUID ou auto-increment
  title: string;                 // Nome do evento
  description: string;           // DescriÃ§Ã£o detalhada
  date: string;                  // Data do evento (formato: YYYY-MM-DD)
  type: "feriado" | "pagamento" | "reuniao" | "treinamento" | "outro";
  color: string;                 // Cor para exibiÃ§Ã£o (hex ou classe CSS)
  createdBy: string;             // Foreign key para users.id
  createdAt: string;             // Data de criaÃ§Ã£o
  companyId?: string;
  roleTarget: PostRoleTarget;
  companyTarget: CompanyTarget;
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
  phone?: string;                // user.phone
  setor?: string;                // user.setor
  birthDate?: string;            // user.birthDate
  photoUrl?: string;             // user.photoUrl
  companyId?: string;
}

// ============================================
// ATALHO/LINK RÃPIDO
// ============================================
// Representa um link Ãºtil da empresa
// BANCO DE DADOS: Tabela "shortcuts" ou "quick_links"
export interface Shortcut {
  id: string;                    // UUID ou auto-increment
  title: string;                 // TÃ­tulo do link
  url: string;                   // URL completa
  description: string;           // DescriÃ§Ã£o breve
  icon?: string;                 // Nome do Ã­cone ou URL
  category?: string;             // Categoria do link (opcional)
  createdBy: string;             // Foreign key para users.id
  createdAt: string;             // Data de criaÃ§Ã£o
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
// CONTEXTO DE AUTENTICAÃÃO
// ============================================
// Estado e mÃ©todos do contexto de autenticaÃ§Ã£o
export interface AuthContextType {
  user: User | null;                              // UsuÃ¡rio logado ou null
  login: (username: string, password: string) => Promise<boolean>;  // FunÃ§Ã£o de login
  logout: () => void;                             // FunÃ§Ã£o de logout
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<boolean>;  // Registro
  isAdmin: boolean;                               // Helper: usuÃ¡rio Ã© admin?
}

// ============================================
// DADOS DE CADASTRO
// ============================================
// Dados do formulÃ¡rio de registro
export interface RegisterData {
  username: string;
  email: string;
  phone: string;
  photoUrl?: string;
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
  month?: number;                // Filtrar por mÃªs (1-12)
  type?: string;                 // Filtrar por tipo (eventos)
}

