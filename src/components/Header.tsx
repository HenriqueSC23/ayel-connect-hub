// ============================================
// HEADER DA APLICAÇÃO
// ============================================
// Cabeçalho fixo no topo com logo, navegação e dados do usuário
// Inspirado em redes sociais modernas (Instagram/X)

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Calendar,
  Cake,
  Users,
  Link as LinkIcon,
  Shield,
  LogOut,
  Search,
} from "lucide-react";
import { useState } from "react";
import logo from "@/assets/ayel-logo.jpg";

export const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // Helper para verificar se link está ativo
  const isActive = (path: string) => location.pathname === path;

  // Mapeia categoria para texto legível
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      vendedor: "Vendedor",
      tecnico: "Técnico",
      rh: "RH",
      administrativo: "Administrativo",
      outros: "Outros",
    };
    return labels[category] || category;
  };

  // Iniciais do usuário para avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r bg-background/95 z-50">
        <div className="flex h-16 items-center px-4 border-b">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Ayel Segurança e Tecnologia" className="h-10" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          <Link to="/">
            <Button variant={isActive("/") ? "secondary" : "ghost"} size="sm" className="w-full justify-start gap-3">
              <Home className="h-5 w-5" />
              <span>Mural</span>
            </Button>
          </Link>

          <Link to="/agenda">
            <Button variant={isActive("/agenda") ? "secondary" : "ghost"} size="sm" className="w-full justify-start gap-3">
              <Calendar className="h-5 w-5" />
              <span>Agenda</span>
            </Button>
          </Link>

          <Link to="/aniversariantes">
            <Button variant={isActive("/aniversariantes") ? "secondary" : "ghost"} size="sm" className="w-full justify-start gap-3">
              <Cake className="h-5 w-5" />
              <span>Aniversariantes</span>
            </Button>
          </Link>

          <Link to="/colaboradores">
            <Button variant={isActive("/colaboradores") ? "secondary" : "ghost"} size="sm" className="w-full justify-start gap-3">
              <Users className="h-5 w-5" />
              <span>Colaboradores</span>
            </Button>
          </Link>

          <Link to="/atalhos">
            <Button variant={isActive("/atalhos") ? "secondary" : "ghost"} size="sm" className="w-full justify-start gap-3">
              <LinkIcon className="h-5 w-5" />
              <span>Atalhos</span>
            </Button>
          </Link>

          {isAdmin && (
            <Link to="/admin">
              <Button variant={isActive("/admin") ? "secondary" : "ghost"} size="sm" className="w-full justify-start gap-3">
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </Button>
            </Link>
          )}
        </nav>

        <div className="px-3 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.photoUrl} alt={user?.fullName} />
                <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user?.fullName || "U")}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">{user?.category && getCategoryLabel(user.category)}</span>
              </div>
            </div>
            <Button variant="ghost" onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Spacer so main content is not under the fixed sidebar */}
      <div className="hidden md:block md:w-64" />

      {/* Mobile header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Ayel Segurança e Tecnologia" className="h-10" />
          </Link>

          {/* Mobile right controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoUrl} alt={user?.fullName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user?.fullName || "U")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.category && getCategoryLabel(user.category)}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
};
