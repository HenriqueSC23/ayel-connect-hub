// Página de Atalhos/Links Rápidos
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { shortcuts } from "@/data/mockData";
import { ExternalLink, Users, Wrench } from "lucide-react";

const Atalhos = () => {
  const primary = shortcuts.filter(
    (shortcut) => shortcut.title === "Portal RH" || shortcut.title === "Suporte Técnico",
  );

  const placeholders = [1, 2, 3, 4].map((i) => ({
    id: `ph-${i}`,
    title: "Em breve",
    description: "Serviço sugerido disponível em breve",
  }));

  const iconMap: Record<string, any> = {
    Users,
    Wrench,
  };

  return (
    <AppLayout maxWidthClass="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Links Rápidos</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {primary.map((shortcut) => {
          const Icon = shortcut.icon ? iconMap[shortcut.icon] || ExternalLink : ExternalLink;
          return (
            <a
              key={shortcut.id}
              href={shortcut.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform hover:scale-105"
            >
              <Card className="h-full hover:border-primary cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{shortcut.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{shortcut.description}</CardDescription>
                </CardContent>
              </Card>
            </a>
          );
        })}

        {placeholders.map((placeholder) => (
          <div key={placeholder.id} className="block transition-transform hover:scale-105">
            <Card className="h-full border-dashed border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/10 flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base">{placeholder.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{placeholder.description}</CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Atalhos;
