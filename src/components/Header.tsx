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
import logo from "@/assets/ayel-logo.png";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Ayel Segurança e Tecnologia" className="h-10" />
        </Link>

        {/* Navegação Principal - Desktop */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button
              variant={isActive("/") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Mural
            </Button>
          </Link>

          <Link to="/agenda">
            <Button
              variant={isActive("/agenda") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Agenda
            </Button>
          </Link>

          <Link to="/aniversariantes">
            <Button
              variant={isActive("/aniversariantes") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Cake className="h-4 w-4" />
              Aniversariantes
            </Button>
          </Link>

          <Link to="/colaboradores">
            <Button
              variant={isActive("/colaboradores") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Colaboradores
            </Button>
          </Link>

          <Link to="/atalhos">
            <Button
              variant={isActive("/atalhos") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Atalhos
            </Button>
          </Link>

          {/* Link Admin (apenas para admins) */}
          {isAdmin && (
            <Link to="/admin">
              <Button
                variant={isActive("/admin") ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
        </nav>

        {/* Busca e Perfil */}
        <div className="flex items-center gap-2">
          {/* Botão de busca (pode ser implementado depois) */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>

          {/* Dropdown do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoUrl} alt={user?.fullName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.fullName || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-medium">{user?.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.category && getCategoryLabel(user.category)}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.category && getCategoryLabel(user.category)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Menu Mobile - Links de navegação */}
              <div className="md:hidden">
                <DropdownMenuItem asChild>
                  <Link to="/" className="w-full cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Mural
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/agenda" className="w-full cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agenda
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/aniversariantes" className="w-full cursor-pointer">
                    <Cake className="mr-2 h-4 w-4" />
                    Aniversariantes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/colaboradores" className="w-full cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    Colaboradores
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/atalhos" className="w-full cursor-pointer">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Atalhos
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
