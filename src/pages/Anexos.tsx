import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { attachments as mockAttachments, companies as mockCompanies } from "@/data/mockData";
import { Attachment, Company } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const Anexos = () => {
  const { user, isAdmin } = useAuth();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string>(isAdmin ? "all" : user?.companyId ?? "all");

  useEffect(() => {
    setAttachments([...mockAttachments]);
  }, []);

  useEffect(() => {
    if (!isAdmin && user?.companyId) {
      setCompanyFilter(user.companyId);
    }
  }, [isAdmin, user?.companyId]);

  const companyMap = useMemo(() => {
    const map = new Map<string, Company>();
    mockCompanies.forEach((company) => map.set(company.id, company));
    return map;
  }, []);

  const availableCompanies = useMemo(() => {
    if (isAdmin) return mockCompanies;
    if (user?.companyId) {
      return mockCompanies.filter((company) => company.id === user.companyId);
    }
    return mockCompanies;
  }, [isAdmin, user?.companyId]);

  const filteredAttachments = useMemo(() => {
    return attachments.filter((attachment) => {
      const matchesFilter =
        companyFilter === "all" ? true : attachment.companyId === "all" || attachment.companyId === companyFilter;
      if (!isAdmin && user?.companyId) {
        return matchesFilter && (attachment.companyId === "all" || attachment.companyId === user.companyId);
      }
      return matchesFilter;
    });
  }, [attachments, companyFilter, isAdmin, user?.companyId]);

  const groupedByCategory = useMemo(() => {
    const map = new Map<string, Attachment[]>();
    filteredAttachments.forEach((attachment) => {
      const category = attachment.category || "Outros";
      if (!map.has(category)) {
        map.set(category, []);
      }
      map.get(category)!.push(attachment);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredAttachments]);

  const getCompanyLabel = (companyId: string): string => {
    if (companyId === "all") return "Todas as empresas";
    return companyMap.get(companyId)?.nome || "Empresa";
  };

  return (
    <AppLayout maxWidthClass="max-w-6xl" contentClassName="space-y-6 lg:min-h-[calc(100vh-125px)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Anexos</h1>
        <p className="text-sm text-muted-foreground">
          Arquivos, documentos e materiais para consulta dos colaboradores.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filtros</CardTitle>
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
                {availableCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {groupedByCategory.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum anexo encontrado para os filtros selecionados.
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {groupedByCategory.map(([category, items]) => (
            <AccordionItem key={category} value={category} className="rounded-xl border border-border/70 px-4">
              <AccordionTrigger className="text-left text-base font-semibold">
                <div className="flex w-full items-center justify-between gap-4">
                  <span>{category}</span>
                  <span className="text-sm font-normal text-muted-foreground">{items.length} arquivo(s)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="flex flex-col gap-3">
                  {items.map((attachment) => (
                    <Card key={attachment.id} className="w-full border border-border/70">
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{attachment.title}</h3>
                          {attachment.description && (
                            <p className="text-sm text-muted-foreground">{attachment.description}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span>{getCompanyLabel(attachment.companyId)}</span>
                          <span>Cadastrado em {new Date(attachment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Button asChild variant="secondary">
                          <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                            Abrir anexo
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </AppLayout>
  );
};

export default Anexos;
