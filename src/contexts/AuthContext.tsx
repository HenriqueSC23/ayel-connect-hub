// ============================================
// CONTEXTO DE AUTENTICAÇÃO
// ============================================
// Este contexto gerencia o estado de autenticação do usuário
// em toda a aplicação usando React Context API.
//
// 🔐 FUNCIONALIDADES:
// - Login (verificação de credenciais)
// - Logout (limpa sessão)
// - Registro de novos usuários
// - Persistência de sessão no localStorage
// - Verificação de permissões (isAdmin)
//
// ⚠️ MIGRAÇÃO PARA BACKEND:
// 
// 1. Substitua findUserByCredentials() por POST /api/auth/login
// 2. Implemente JWT ou sessões no backend
// 3. Armazene token no localStorage e envie no header das requisições
// 4. Adicione refresh token para renovação automática
// 5. Implemente proteção contra CSRF
//
// EXEMPLO COM JWT:
// const login = async (username: string, password: string) => {
//   const response = await fetch('/api/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password })
//   });
//   const { token, user } = await response.json();
//   localStorage.setItem('token', token);
//   setUser(user);
// };
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/types";
import { findUserByCredentials, createUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Chave para persistência no localStorage
const STORAGE_KEY = "ayel_intranet_user";

// ============================================
// PROVIDER DO CONTEXTO
// ============================================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // ============================================
  // EFEITO: Restaura sessão do localStorage ao carregar
  // ============================================
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // ============================================
  // FUNÇÃO: Login
  // ============================================
  // Autentica o usuário e salva sessão
  // 
  // BACKEND: POST /api/auth/login
  // Body: { username, password }
  // Response: { token, user }
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // ⚠️ MIGRAÇÃO: Substituir por fetch('/api/auth/login')
      const foundUser = await findUserByCredentials(username, password);

      if (foundUser) {
        // Remove senha antes de armazenar (segurança)
        const { password: _, ...userWithoutPassword } = foundUser;
        
        setUser(foundUser);
        
        // Persiste sessão no localStorage
        // ⚠️ BACKEND: Armazenar apenas token JWT, não o objeto user completo
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));

        toast({
          title: "Login realizado!",
          description: `Bem-vindo, ${foundUser.fullName}!`,
        });

        return true;
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário ou senha incorretos.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  // ============================================
  // FUNÇÃO: Logout
  // ============================================
  // Remove sessão e redireciona para login
  // 
  // BACKEND: POST /api/auth/logout (opcional, para invalidar token)
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    
    // ⚠️ BACKEND: Fazer POST /api/auth/logout para invalidar token no servidor
    
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
  };

  // ============================================
  // FUNÇÃO: Registro
  // ============================================
  // Cria novo usuário no sistema
  // 
  // BACKEND: POST /api/auth/register ou POST /api/users
  // Body: { username, email, password, fullName, category }
  // Response: { user } (sem retornar senha)
  const register = async (
    userData: Omit<User, "id" | "createdAt">
  ): Promise<boolean> => {
    try {
      // ⚠️ MIGRAÇÃO: Substituir por fetch('/api/auth/register')
      const newUser = await createUser(userData);

      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada com sucesso. Faça login para continuar.",
      });

      return true;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  // ============================================
  // HELPER: Verifica se usuário é admin
  // ============================================
  // Considera superadmin como tendo permissões administrativas também
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Valor do contexto disponível para toda aplicação
  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// HOOK: useAuth
// ============================================
// Hook customizado para acessar o contexto de autenticação
// Uso: const { user, login, logout, isAdmin } = useAuth();
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
