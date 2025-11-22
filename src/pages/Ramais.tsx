import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ramais as mockRamais, companies as mockCompanies } from "@/data/mockData";
import { Ramal } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const Ramais = () => {
  const { user, isAdmin } = useAuth();
  const [ramaisList, setRamaisList] = useState<Ramal[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string>(
    isAdmin ? "all" : user?.companyId ?? "all",
  );

  useEffect(() => {
    setRamaisList([...mockRamais]);
  }, []);

  useEffect(() => {
    if (!isAdmin && user?.companyId) {
      setCompanyFilter(user.companyId);
    }
  }, [isAdmin, user?.companyId]);

  const resolvedCompanyId = useMemo(() => {
    if (isAdmin) {
      return companyFilter === "all" ? undefined : companyFilter;
    }
    return user?.companyId || undefined;
  }, [companyFilter, isAdmin, user?.companyId]);

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

      {isAdmin && (
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

      {filteredRamais.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum ramal encontrado para os filtros selecionados.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orderedSectors.map((sector) => (
            <Card key={sector}>
              <CardHeader>
                <CardTitle className="text-xl">{sector}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedBySector[sector].map((ramal) => (
                  <div
                    key={ramal.id}
                    className="flex flex-col gap-1 border border-border/60 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold">{ramal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Ramal {ramal.extension}
                        {ramal.phone ? ` • Tel: ${ramal.phone}` : ""}
                      </p>
                      {ramal.email && (
                        <p className="text-xs text-muted-foreground break-all">{ramal.email}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {isAdmin && (
                        <>
                          <span className="font-medium block">{getCompanyName(ramal.companyId)}</span>
                          <Separator className="my-1" />
                        </>
                      )}
                      <span className="uppercase tracking-wide text-[10px] text-muted-foreground">
                        {ramal.sector}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Ramais;
