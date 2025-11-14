import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { trainings as mockTrainings, companies as mockCompanies } from "@/data/mockData";
import { Training, TrainingCategory } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const resolveAllowedCategories = (userCategory?: string, userSector?: string, isAdmin?: boolean): Set<TrainingCategory> => {
  if (isAdmin) {
    return new Set(["vendedor", "tecnico", "suporte", "geral"]);
  }

  const allowed: Set<TrainingCategory> = new Set(["geral"]);
  const category = (userCategory || "").toLowerCase();
  const sector = (userSector || "").toLowerCase();

  if (category === "vendedor") allowed.add("vendedor");
  if (category === "tecnico") allowed.add("tecnico");
  if (sector.includes("suporte") || category === "suporte") allowed.add("suporte");

  return allowed;
};

const Treinamentos = () => {
  const { user, isAdmin } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string>(isSuperAdmin ? "all" : user?.companyId ?? "all");

  useEffect(() => {
    setTrainings([...mockTrainings]);
  }, []);

  useEffect(() => {
    if (!isSuperAdmin && user?.companyId) {
      setCompanyFilter(user.companyId);
    }
  }, [isSuperAdmin, user?.companyId]);

  const allowedCategories = useMemo(
    () => resolveAllowedCategories(user?.category, user?.setor, isAdmin),
    [user?.category, user?.setor, isAdmin],
  );

  const resolvedCompanyId = useMemo(() => {
    if (isSuperAdmin) {
      return companyFilter === "all" ? undefined : companyFilter;
    }
    return user?.companyId;
  }, [companyFilter, isSuperAdmin, user?.companyId]);

  const filteredTrainings = useMemo(() => {
    return trainings.filter((training) => {
      const matchesCompany = resolvedCompanyId ? training.companyId === resolvedCompanyId : true;
      const matchesCategory = allowedCategories.has(training.category);
      return matchesCompany && matchesCategory;
    });
  }, [trainings, resolvedCompanyId, allowedCategories]);

  const getCompanyName = (companyId: string) =>
    mockCompanies.find((company) => company.id === companyId)?.nome || "Empresa";

  return (
    <AppLayout maxWidthClass="max-w-6xl" contentClassName="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Treinamentos</h1>
        <p className="text-muted-foreground text-sm">Selecione um treinamento para acessar o conteúdo completo.</p>
      </div>

      {isSuperAdmin && (
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Filtrar por empresa</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full max-w-sm">
              <Label className="text-sm mb-2 block">Empresa</Label>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as empresas</SelectItem>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredTrainings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum treinamento disponível para o perfil selecionado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTrainings.map((training) => (
            <Card key={training.id} className="overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow">
              <div className="relative w-full bg-muted overflow-hidden">
                <img
                  src={training.imageUrl}
                  alt={training.title}
                  className="w-full object-cover object-center h-[200px] sm:h-[320px]"
                  loading="lazy"
                />
              </div>
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">{training.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{training.shortDescription}</p>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                  <span className="uppercase tracking-wide">Categoria: {training.category}</span>
                  {(isAdmin || isSuperAdmin) && <span>{getCompanyName(training.companyId)}</span>}
                </div>
                <Button asChild className="w-full">
                  <Link to={`/treinamentos/${training.id}`}>Acessar Treinamento</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Treinamentos;
