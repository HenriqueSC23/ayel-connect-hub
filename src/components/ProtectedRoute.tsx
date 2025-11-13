// ============================================
// ROTA PROTEGIDA
// ============================================
// Componente que protege rotas internas da aplicação
// Redireciona para login se usuário não estiver autenticado
// 
// USO:
// <ProtectedRoute>
//   <MinhaTelaInterna />
// </ProtectedRoute>

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;  // Se true, apenas admin pode acessar
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAdmin } = useAuth();

  // Se não estiver logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota requer admin mas usuário não é admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
