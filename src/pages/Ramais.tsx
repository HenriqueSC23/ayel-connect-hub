import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { companies as mockCompanies, ramais as mockRamais } from "@/data/mockData";
import { Ramal } from "@/types";

const Ramais = () => {
  const { user, isAdmin } = useAuth();
  const [ramaisList, setRamaisList] = useState<Ramal[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  useEffect(() => {
    setRamaisList([...mockRamais]);
  }, []);

  const resolvedCompanyId = useMemo(() => {
    return companyFilter === "all" ? undefined : companyFilter;
  }, [companyFilter]);

  const filteredRamais = useMemo(() => {
    return ramaisList.filter((ramal) => {
      if (resolvedCompanyId) {
        return ramal.companyId === resolvedCompanyId;
      }
      return true;
    });
  }, [ramaisList, resolvedCompanyId]);

  const groupedBySector = useMemo(() => {
    const groups: Record<string, Ramal[]> = {};

    filteredRamais.forEach((ramal) => {
      const key = ramal.sector?.trim() || "Outros";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(ramal);
    });

    Object.keys(groups).forEach((sector) => {
      groups[sector].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [filteredRamais]);

  const orderedSectors = useMemo(() => {
    return Object.keys(groupedBySector).sort((a, b) => a.localeCompare(b));
  }, [groupedBySector]);

  const getCompanyName = (companyId: string) =>
    mockCompanies.find((company) => company.id === companyId)?.nome || "Empresa";

  return (
    <AppLayout maxWidthClass="max-w-5xl" contentClassName="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Ramais</h1>
        <p className="text-muted-foreground text-sm">
          Consulte os principais contatos internos organizados por setor.
        </p>
      </div>

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

      {filteredRamais.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum ramal encontrado para os filtros selecionados.
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Ramais por setor</CardTitle>
            <p className="text-sm text-muted-foreground">
              Selecione um setor para visualizar os contatos correspondentes.
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-3">
              {orderedSectors.map((sector) => (
                <AccordionItem key={sector} value={sector} className="rounded-xl border border-border/70 px-4">
                  <AccordionTrigger className="text-left text-base font-semibold">
                    <div className="flex w-full items-center justify-between gap-4">
                      <span>{sector}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {groupedBySector[sector].length} contato(s)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="flex flex-col gap-3">
                      {groupedBySector[sector].map((ramal) => (
                        <div
                          key={ramal.id}
                          className="flex flex-col gap-2 rounded-lg border border-border/50 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-foreground">{ramal.name}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium">Ramal {ramal.extension}</span>
                              {ramal.phone && <Separator orientation="vertical" className="h-4" />}
                              {ramal.phone && <span>Tel: {ramal.phone}</span>}
                            </div>
                            {ramal.email && (
                              <p className="text-xs text-muted-foreground break-all">{ramal.email}</p>
                            )}
                          </div>
                          <div className="text-left text-xs text-muted-foreground sm:text-right">
                            {isAdmin && (
                              <>
                                <span className="block text-sm font-semibold text-foreground">
                                  {getCompanyName(ramal.companyId)}
                                </span>
                                <Separator className="my-2" />
                              </>
                            )}
                            <span className="uppercase tracking-wide text-[11px] text-muted-foreground">
                              {ramal.sector || "Outros"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default Ramais;
