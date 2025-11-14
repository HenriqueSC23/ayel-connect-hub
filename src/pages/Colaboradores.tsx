// Página de Lista de Colaboradores
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { users as mockUsers, companies as mockCompanies } from "@/data/mockData";
import { Search, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Company, User } from "@/types";

const Colaboradores = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const companyMap = useMemo(() => {
    const map = new Map<string, Company>();
    mockCompanies.forEach((company) => map.set(company.id, company));
    return map;
  }, []);

  const normalizedUsers: User[] = useMemo(() => {
    const canViewAllCompanies = user?.role === "superadmin";
    return mockUsers.filter((u) => {
      if (u.role !== "user") return false;
      if (canViewAllCompanies) return true;
      if (user?.companyId) {
        return u.companyId === user.companyId;
      }
      return true;
    });
  }, [user?.role, user?.companyId]);

  const filtered = normalizedUsers.filter((collaborator) => {
    const query = search.toLowerCase();
    const companyName = collaborator.companyId ? companyMap.get(collaborator.companyId)?.nome || "" : "";
    return (
      collaborator.fullName.toLowerCase().includes(query) ||
      collaborator.email.toLowerCase().includes(query) ||
      collaborator.category.toLowerCase().includes(query) ||
      companyName.toLowerCase().includes(query)
    );
  });

  const categoryLabels: Record<string, string> = {
    vendedor: "Vendedor",
    tecnico: "Técnico",
    rh: "RH",
    administrativo: "Administrativo",
    outros: "Outros",
  };

  return (
    <AppLayout maxWidthClass="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Colaboradores</h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou setor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((person) => (
          <Card key={person.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={person.photoUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {person.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{person.fullName}</h3>
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {person.email}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{categoryLabels[person.category] || person.category}</Badge>
                    <Badge variant="outline">
                      {person.companyId ? companyMap.get(person.companyId)?.nome || "Empresa" : "Sem empresa"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default Colaboradores;
