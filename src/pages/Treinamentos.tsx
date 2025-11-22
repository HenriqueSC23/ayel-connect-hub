import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { trainings as mockTrainings, companies as mockCompanies } from "@/data/mockData";
import { Training, TrainingCategory } from "@/types";

const AprendaMais = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<TrainingCategory | "all">("all");

  useEffect(() => {
    setTrainings([...mockTrainings]);
  }, []);

  const filteredTrainings = useMemo(() => {
    return trainings.filter((training) => {
      const matchesCompany = companyFilter === "all" ? true : training.companyId === companyFilter;
      const matchesCategory = categoryFilter === "all" ? true : training.category === categoryFilter;
      return matchesCompany && matchesCategory;
    });
  }, [trainings, companyFilter, categoryFilter]);

  const getCompanyName = (companyId: string) =>
    mockCompanies.find((company) => company.id === companyId)?.nome || "Empresa";

  return (
    <AppLayout maxWidthClass="max-w-6xl" contentClassName="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Aprenda mais</h1>
        <p className="text-muted-foreground text-sm">Encontre materiais rápidos e conteúdos extras para apoiar o dia a dia.</p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
            <div>
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

            <div>
              <Label className="text-sm mb-2 block">Categoria</Label>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as TrainingCategory | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTrainings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum conteúdo encontrado para os filtros selecionados.
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
                  <span>{getCompanyName(training.companyId)}</span>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/treinamentos/${training.id}`}>Acessar conteúdo</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default AprendaMais;
