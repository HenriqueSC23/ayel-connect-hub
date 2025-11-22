// Página de Atalhos/Links Rápidos
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { shortcuts } from "@/data/mockData";
import { ExternalLink, Users, Wrench, ShoppingCart, Mail, FolderOpen, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Wrench,
  ShoppingCart,
  Mail,
  FolderOpen,
  Shield,
};

const Atalhos = () => {
  // Define setores desejados e tente mapear atalhos existentes para cada um
  const sectors = ["RH", "Técnico", "Vendas", "Administrador"];

  const mapShortcutsForSector = (sector: string) => {
    const s = shortcuts.filter((sc) => {
      const t = sc.title.toLowerCase();
      const cat = (sc.category || "").toLowerCase();
      if (sector === "RH") return t.includes("rh") || cat.includes("rh") || t.includes("holerit");
      if (sector === "Técnico") return t.includes("suporte") || t.includes("suporte técnico") || cat.includes("tecnico");
      if (sector === "Vendas") return t.includes("vendas") || t.includes("sistema de vendas") || cat.includes("vendedor");
      if (sector === "Administrador") return t.includes("portal") || t.includes("mail") || cat === "interno";
      return false;
    });

    // Sempre garanta pelo menos 3 itens — use placeholders se necessário
    const placeholdersNeeded = Math.max(0, 3 - s.length);
    const placeholders = Array.from({ length: placeholdersNeeded }).map((_, i) => ({
      id: `ph-${sector}-${i}`,
      title: "Em breve",
      url: "#",
      description: "Serviço sugerido disponível em breve",
      placeholder: true,
    }));

    return [...s, ...placeholders];
  };

  return (
    <AppLayout maxWidthClass="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Links Rápidos</h1>

      <div className="space-y-4">
        <Accordion type="single" collapsible>
          {sectors.map((sector) => {
            const items = mapShortcutsForSector(sector);
            return (
              <AccordionItem value={sector} key={sector}>
                <AccordionTrigger className="text-lg">{sector}</AccordionTrigger>
                <AccordionContent>
                  {/* Container dos atalhos: coluna, todos com largura total */}
                  <div className="flex flex-col gap-3 w-full">
                    {items.map((it: any) => {
                      const Icon = it.icon ? (iconMap[it.icon] as any) || ExternalLink : ExternalLink;
                      return (
                        <a
                          key={it.id}
                          href={it.url || "#"}
                          target={it.placeholder ? undefined : "_blank"}
                          rel={it.placeholder ? undefined : "noopener noreferrer"}
                          className="block w-full"
                        >
                          <Card
                            className={`w-full h-full ${
                              it.placeholder ? "border-dashed border" : "hover:border-primary cursor-pointer"
                            }`}
                          >
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-base truncate">{it.title}</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="truncate">
                                {it.description}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        </a>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </AppLayout>
  );
};

export default Atalhos;
