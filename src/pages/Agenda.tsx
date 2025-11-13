// Página de Agenda de Eventos
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { events } from "@/data/mockData";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Agenda = () => {
  const typeLabels: Record<string, string> = {
    feriado: "Feriado",
    pagamento: "Pagamento",
    reuniao: "Reunião",
    treinamento: "Treinamento",
    outro: "Outro",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Agenda do Mês</h1>
        
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: event.color + "20" }}
                    >
                      <Calendar className="h-6 w-6" style={{ color: event.color }} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <Badge style={{ backgroundColor: event.color }}>
                    {typeLabels[event.type]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Agenda;
