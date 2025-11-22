import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Home, Calendar, BookOpen, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface MobileNavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  key: string;
}

interface ProfileMenuItem {
  label: string;
  to: string;
  key: string;
}

interface AppLayoutProps {
  children: ReactNode;
  maxWidthClass?: string;
  contentClassName?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  maxWidthClass = "max-w-5xl",
  contentClassName,
}) => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const mobileNavItems: MobileNavItem[] = useMemo(
    () => [
      { label: "Início", icon: Home, to: "/inicio", key: "inicio" },
      { label: "Agenda", icon: Calendar, to: "/agenda", key: "agenda" },
      { label: "Aprenda mais", icon: BookOpen, to: "/treinamentos", key: "treinamentos" },
      { label: "Ramais", icon: Phone, to: "/ramais", key: "ramais" },
    ],
    [],
  );

  const profileMenuItems: ProfileMenuItem[] = useMemo(() => {
    const base: ProfileMenuItem[] = [
      { label: "Início", to: "/inicio", key: "inicio" },
      { label: "Agenda", to: "/agenda", key: "agenda" },
      { label: "Aniversariantes", to: "/aniversariantes", key: "aniversariantes" },
      { label: "Colaboradores", to: "/colaboradores", key: "colaboradores" },
      { label: "Aprenda mais", to: "/treinamentos", key: "treinamentos" },
      { label: "Ramais", to: "/ramais", key: "ramais" },
      { label: "Atalhos", to: "/atalhos", key: "atalhos" },
    ];
    if (isAdmin) {
      base.push({ label: "Admin", to: "/admin", key: "admin" });
    }
    return base;
  }, [isAdmin]);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="md:pl-64 pt-16 md:pt-6">
        <div
          className={cn(
            "w-full px-4 pb-24 md:pb-10 mx-auto transition-all",
            maxWidthClass,
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
      <div className="md:hidden">
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-3">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground",
                    active && "text-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-foreground" : "text-muted-foreground")} />
                </Link>
              );
            })}
            <Dialog open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
              <DialogTrigger asChild>
                <button
                  className="flex items-center justify-center rounded-full border border-border/80 bg-white h-10 w-10"
                  aria-label="Abrir menu"
                >
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt={user.fullName || "Perfil"} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-primary">
                      {user?.fullName?.slice(0, 2).toUpperCase() || "U"}
                    </span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-t-2xl border border-border/70 p-0">
                <DialogHeader className="px-6 py-4">
                  <DialogTitle>Menu</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Olá, {user?.fullName?.split(" ")[0] || "colaborador"}!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col divide-y divide-border/50">
                  <div className="space-y-2 px-6 pb-4">
                    {profileMenuItems.map((link) => (
                      <Link
                        key={link.key}
                        to={link.to}
                        className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted/40"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="px-6 py-4">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full rounded-lg border border-border/80 bg-destructive/10 px-3 py-3 text-sm font-semibold text-destructive hover:bg-destructive/20"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

