import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trainings as mockTrainings, companies as mockCompanies } from "@/data/mockData";
import { Training, TrainingCategory } from "@/types";

type SectorKey = "vendas" | "tecnico" | "rh" | "suporte" | "geral";

const sectorLabels: Record<SectorKey, string> = {
  vendas: "Vendas",
  tecnico: "Tecnico",
  rh: "RH",
  suporte: "Suporte",
  geral: "Geral",
};

const sectorOrder: SectorKey[] = ["vendas", "tecnico", "rh", "suporte", "geral"];

const categoryToSector: Record<TrainingCategory, SectorKey> = {
  vendedor: "vendas",
  tecnico: "tecnico",
  suporte: "suporte",
  geral: "geral",
  rh: "rh",
};

const mapCategoryToSector = (category: TrainingCategory): SectorKey => categoryToSector[category] || "geral";

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

  const trainingsBySector = useMemo(() => {
    const grouped: Record<SectorKey, Training[]> = {
      vendas: [],
      tecnico: [],
      rh: [],
      suporte: [],
      geral: [],
    };
    filteredTrainings.forEach((training) => {
      const sector = mapCategoryToSector(training.category);
      grouped[sector].push(training);
    });
    return grouped;
  }, [filteredTrainings]);

  const getCompanyName = (companyId: string) =>
    mockCompanies.find((company) => company.id === companyId)?.nome || "Empresa";

  return (
    <AppLayout maxWidthClass="max-w-6xl" contentClassName="space-y-6 lg:min-h-[calc(100vh-125px)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Aprenda mais</h1>
        <p className="text-muted-foreground text-sm">
          Aqui voce encontra cursos, lives, materiais de aprendizado e conteudos extras para apoiar o seu desenvolvimento.
        </p>
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
              <Label className="text-sm mb-2 block">Setor / funcao</Label>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as TrainingCategory | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  <SelectItem value="vendedor">Vendas</SelectItem>
                  <SelectItem value="tecnico">Tecnico</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTrainings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum conteudo encontrado para os filtros selecionados.
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {sectorOrder.map((sector) => {
            const sectorTrainings = trainingsBySector[sector];
            return (
              <AccordionItem
                key={sector}
                value={sector}
                className="rounded-xl border border-border/60 bg-card/40 px-4"
              >
                <AccordionTrigger className="text-base font-semibold text-left">
                  <div className="flex w-full items-center justify-between gap-4">
                    <span>{sectorLabels[sector]}</span>
                    <span className="text-sm font-normal text-muted-foreground">{sectorTrainings.length} conteudos</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  {sectorTrainings.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/70 bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
                      Nenhum conteudo para este setor com os filtros atuais.
                    </div>
                  ) : (
                    <div className="flex w-full flex-col gap-4">
                      {sectorTrainings.map((training) => (
                        <Card key={training.id} className="w-full overflow-hidden border border-border/70 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-stretch">
                            <div className="w-full bg-muted md:w-64 md:flex-shrink-0">
                              <img
                                src={training.imageUrl}
                                alt={training.title}
                                className="h-48 w-full object-cover object-center md:h-full"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex flex-1 flex-col gap-4 p-4">
                              <div>
                                <h3 className="text-xl font-semibold">{training.title}</h3>
                                <p className="text-sm text-muted-foreground">{training.shortDescription}</p>
                              </div>
                              <div className="hidden md:block h-px w-full bg-border/70" />
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                <span className="uppercase tracking-wide">Setor: {sectorLabels[sector]}</span>
                                <span className="font-medium text-foreground/80 capitalize">{getCompanyName(training.companyId)}</span>
                              </div>
                              <Button asChild className="w-full md:w-auto md:self-start">
                                <Link to={`/treinamentos/${training.id}`}>Acessar conteudo</Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </AppLayout>
  );
};

export default AprendaMais;
