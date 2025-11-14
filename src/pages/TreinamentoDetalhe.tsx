import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trainings as mockTrainings, companies as mockCompanies } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Training, TrainingCategory } from "@/types";
import { format } from "date-fns";

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

const TreinamentoDetalhe = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";
  const allowedCategories = resolveAllowedCategories(user?.category, user?.setor, isAdmin);

  const training = useMemo(() => mockTrainings.find((item) => item.id === id), [id]);

  const canSeeTraining = useMemo(() => {
    if (!training) return false;
    const matchesCategory = allowedCategories.has(training.category);
    const matchesCompany = isSuperAdmin ? true : training.companyId === user?.companyId;
    return matchesCategory && matchesCompany;
  }, [training, allowedCategories, isSuperAdmin, user?.companyId]);

  const getCompanyName = (companyId: string) =>
    mockCompanies.find((company) => company.id === companyId)?.nome || "Empresa";

  return (
    <AppLayout maxWidthClass="max-w-3xl" contentClassName="space-y-6">
      {!training || !canSeeTraining ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">Treinamento não encontrado ou você não possui acesso.</p>
            <Button asChild variant="outline">
              <Link to="/treinamentos">Voltar para Treinamentos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="w-full aspect-video bg-muted">
            <img src={training.imageUrl} alt={training.title} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {training.category} • {format(new Date(training.createdAt), "dd/MM/yyyy")}
              </p>
              <h1 className="text-3xl font-bold">{training.title}</h1>
              <p className="text-base text-muted-foreground">{training.shortDescription}</p>
              {(isAdmin || isSuperAdmin) && (
                <p className="text-xs text-muted-foreground">Empresa: {getCompanyName(training.companyId)}</p>
              )}
            </div>
            <div className="whitespace-pre-line leading-relaxed text-sm text-foreground/90">{training.content}</div>
            <div className="pt-4">
              <Button asChild>
                <Link to="/treinamentos">Voltar para Treinamentos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default TreinamentoDetalhe;
