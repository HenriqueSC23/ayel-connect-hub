// Página de Atalhos/Links Rápidos
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { shortcuts } from "@/data/mockData";
import { ExternalLink, Users, ShoppingCart, Wrench, Mail, FolderOpen, Shield } from "lucide-react";

const Atalhos = () => {
  const iconMap: Record<string, any> = {
    Users,
    ShoppingCart,
    Wrench,
    Mail,
    FolderOpen,
    Shield,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Links Rápidos</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon ? iconMap[shortcut.icon] : ExternalLink;
            
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
        </div>
      </main>
    </div>
  );
};

export default Atalhos;
