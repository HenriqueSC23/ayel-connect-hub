# Ayel Connect Hub – Documentação Técnica

## Visão Geral
Ayel Connect Hub é a intranet multiempresas da Ayel Segurança e Tecnologia. O portal foi projetado para centralizar comunicação interna e operações de RH/operacionais em um único front-end web, pronto para receber um back-end no futuro. Principais módulos:

- **Início / Mural:** posts, comunicados importantes e feed com filtros (função + empresa).
- **Agenda / Calendário:** eventos segmentados com visualização mensal.
- **Treinamentos:** cards chamativos com conteúdo detalhado por página.
- **Ramais:** diretório de contatos dividido por setor.
- **Atalhos:** links rápidos corporativos.
- **Usuários / Colaboradores:** catálogo dos colaboradores com tags de função e empresa.
- **Admin:** painel para CRUD de usuários, eventos, empresas, treinamentos, ramais etc.
- **Multiempresa:** cada entidade conhece `companyId`/`companyTarget`, usuários possuem `role` + `companyId`, garantindo segmentação por empresa e função.

## Tecnologias e Stack
- **Framework/build:** React 18 + Vite 5 (plugin SWC).  
- **Linguagem:** TypeScript strict.  
- **Estilização:** Tailwind CSS + tailwind-merge + tokens utilitários.  
- **Biblioteca de UI:** shadcn/ui (componentes Radix) e ícones lucide-react.  
- **Formulários/validação:** react-hook-form + zod.  
- **Calendário:** react-day-picker.  
- **Outros utilitários:** date-fns (datas), sonner (toasts), react-router-dom (rotas SPA), @tanstack/react-query (ready para consumo de APIs).  

## Modelagem e Conceitos de ADS
### Camadas
1. **Apresentação:** páginas em `src/pages` (Login, Dashboard, Agenda, Treinamentos etc.) usam componentes de layout (`AppLayout`, `Header`, `PostCard`).  
2. **Modelo:** `src/types/index.ts` centraliza interfaces (`User`, `Post`, `Event`, `Training`, `Company`, `Ramal`, `Shortcut`).  
3. **Dados:** `src/data/mockData.ts` fornece mocks e helpers CRUD (assíncronos para simular API). `AuthContext` orquestra autenticação, permissões e persistência.  

### Entidades
- **User:** dados pessoais, `role` (`user` ou `admin`), `category` (função/setor), `companyId`.  
- **Company:** id, nome, CNPJ, logomarca, cor.  
- **Post:** autor, título, conteúdo, imagem, `roleTarget`, `companyTarget`, `isImportant`, `likes`, `createdAt`.  
- **Event:** título, data, tipo, descrição, cor, `roleTarget`, `companyTarget`, metadados de criação.  
- **Training:** título, descrição curta, imagem, categoria (`geral`, `vendedor`, `tecnico`, `suporte`), conteúdo longo, `companyId`.  
- **Ramal:** colaborador, setor, ramal, telefone, e-mail, `companyId`.  
- **Shortcut:** título, url, descrição, ícone, `companyId`.  

### Conceito Multiempresa
- Usuário → possui `companyId` + função.  
- Conteúdo → traz `companyTarget` (ou `companyId`) e `roleTarget`.  
- Visibilidade → `(companyTarget === "all" || companyTarget === user.companyId)` **E** `(roleTarget === "all" || roleTarget === user.category)`.  
- Admin ignora filtros e enxerga todos os registros.  

## Estrutura de Pastas
```
src/
├── components/        # AppLayout, Header, PostCard, UI shadcn, etc.
├── contexts/
│   └── AuthContext.tsx
├── data/
│   └── mockData.ts    # arrays e helpers CRUD (posts, events, users, etc.)
├── hooks/             # ex.: use-toast
├── lib/               # utilidades (cn, etc.)
├── pages/             # rotas SPA (Login, Dashboard, Agenda, Treinamentos, Ramais, Admin...)
├── types/
│   └── index.ts       # interfaces / tipos do domínio
└── main.tsx           # bootstrap React Router + Providers
```

## Módulos do Sistema
### Autenticação / Usuário
- `AuthContext` guarda `user`, `login`, `logout`, `register`, `isAdmin`.  
- Login usa `findUserByCredentials` (mock). Registro usa `createUser`.  
- Roles: `user` (colaborador) e `admin` (acesso total).  
- Permissões: Admin acessa painel `/admin` e vê todos os dados; colaborador só vê o que pertence à sua função/empresa.  

### Multiempresa
- Empresas vêm de `mockData.companies`; Admin pode criar/editar no painel.  
- `companyId` em usuário determina pertencimento.  
- `companyTarget`/`roleTarget` em posts, eventos, treinamentos e ramais controlam alcance.  
- Padrão repetido em `getVisiblePosts`, Agenda, Treinamentos e Ramais.  

### Posts / Mural
- Campos: título (opcional), conteúdo, imagem, `roleTarget`, `companyTarget`, `isImportant`.  
- Admin vê todos; colaborador vê apenas posts cujo `roleTarget` e `companyTarget` batem com sua função/empresa.  
- Botão toggle marca “Comunicado importante”; no desktop há sidebar “Comunicados importantes”, no mobile um filtro “Todos × Comunicados”. PostCard mostra badge especial.  

### Agenda (Eventos + Calendário)
- Eventos têm `title`, `date`, `type`, `description`, `color`, `roleTarget`, `companyTarget`.  
- Componente `react-day-picker` mostra marcações, e o card “Eventos do mês” lista com tags de função/empresa.  
- Admin possui filtros de função/empresa; usuários comuns seguem a regra automática.  

### Treinamentos
- Página `/treinamentos` lista cards grandes com imagem, descrição curta e botão “Acessar”.  
- Cada item abre `/treinamentos/:id` com título, imagem, resumo e conteúdo longo.  
- Categoria (`geral`, `vendedor`, `tecnico`, `suporte`) + `companyId` controlam visibilidade.  
- CRUD completo em `/admin`.  

### Ramais
- Estrutura: nome, setor, ramal, telefone, e-mail, `companyId`.  
- Página `/ramais` mostra apenas a empresa do usuário, agrupando por setor.  
- Admin tem CRUD completo (inclui seleção de empresa).  

### Admin
- Painel dividido em cards (Usuários, Eventos, Treinamentos, Ramais, Empresas, Atalhos).  
- Cada card possui botões “Adicionar” e “Editar” que abrem Dialogs shadcn.  
- Formulários seguem padrão: selects para função/empresa e campos específicos de cada entidade.  

## Navegação e Responsividade
- **Desktop:** sidebar fixa à esquerda (menu completo). Conteúdo ocupa área à direita. Páginas como Início usam grid 2 colunas (feed + sidebar).  
- **Mobile:** sidebar some; surge bottom nav com ícones (Início, Agenda, Treinamentos, Ramais, Perfil). O item Perfil abre modal com todos os links + botão “Sair”. `AppLayout` adiciona `padding-bottom` para não esconder conteúdo atrás da barra.  

## Como instalar e rodar o projeto
```bash
# Pré-requisitos
# - Node.js >= 18
# - npm ou yarn
# - Git

# Clonar
git clone https://github.com/HenriqueSC23/ayel-connect-hub.git
cd ayel-connect-hub

# Instalar dependências
npm install
# ou
yarn install

# Desenvolvimento
npm run dev
# (Vite expõe por padrão em http://localhost:5173)

# Build de produção
npm run build
npm run preview      # ou configure npm run start conforme necessidade
```
Pronto para deploy em serviços como Vercel, Netlify, Render, etc.

## Conexão com Back-end / Banco de Dados (futuro)
- Hoje os dados vivem em `src/data/mockData.ts` e helpers (createUser, createEvent...).  
- Próximo passo: substituir esses helpers por chamadas HTTP (`fetch`/`axios`) para um backend real.  
- Sugestão: criar pasta `services/` ou `api/` para centralizar requests; usar React Query para caching e estados.  
- `AuthContext` já explica como trocar `findUserByCredentials` por `POST /api/auth/login` com JWT.  
- O front inteiro já espera dados via props/estado – basta ligar posts, eventos, treinamentos, ramais, usuários e empresas a endpoints reais.  

## Boas Práticas e Pontos de Atenção
1. **Componentização:** reaproveitar `AppLayout`, `Card`, `Dialog`, `Select` e demais componentes shadcn.  
2. **Tipagem forte:** atualizar `src/types/index.ts` ao adicionar campos; evita `any` e mantém coerência.  
3. **Multiempresa:** preservar regra `(companyTarget, roleTarget)` em qualquer novo recurso.  
4. **Experiência mobile:** manter bottom nav, menu de perfil e responsividade (cards, grids, agenda).  
5. **Comunicados importantes:** usar o flag `isImportant` para garantir destaque no feed e sidebar.  
6. **Migração para backend:** isolar lógica de dados em services/hooks para facilitar manutenção.  

Com esta documentação, equipes de ADS ou desenvolvedores conseguem compreender rapidamente a arquitetura do Ayel Connect Hub, manter o código e evoluir a intranet com segurança.***
