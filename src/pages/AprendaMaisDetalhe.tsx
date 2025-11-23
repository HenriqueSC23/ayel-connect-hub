import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trainings as mockTrainings, companies as mockCompanies } from "@/data/mockData";
import { format } from "date-fns";

const AprendaMaisDetalhe = () => {
  const { id } = useParams();

  const training = useMemo(() => mockTrainings.find((item) => item.id === id), [id]);

  const getCompanyName = (companyId: string) =>
    mockCompanies.find((company) => company.id === companyId)?.nome || "Empresa";

  return (
    <AppLayout maxWidthClass="max-w-3xl" contentClassName="space-y-6">
      {!training ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">Conteúdo extra não encontrado.</p>
            <Button asChild variant="outline">
              <Link to="/treinamentos">Voltar para Aprenda mais</Link>
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
              <p className="text-xs text-muted-foreground">Empresa: {getCompanyName(training.companyId)}</p>
            </div>
            <div className="whitespace-pre-line leading-relaxed text-sm text-foreground/90">{training.content}</div>
            <div className="pt-4">
              <Button asChild>
                <Link to="/treinamentos">Voltar para Aprenda mais</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default AprendaMaisDetalhe;
