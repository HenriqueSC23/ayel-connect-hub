// Página de Agenda de Eventos (versão calendário mensal)
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { events } from "@/data/mockData";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const toKey = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  // Normaliza datas para o dia local (evita problemas de fuso)
  const eventDates = useMemo(() => {
    return events.map((e) => {
      const d = parseISO(e.date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    });
  }, []);

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof events> = {};
    events.forEach((ev) => {
      const d = parseISO(ev.date);
      const key = toKey(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
      if (!map[key]) map[key] = [] as any;
      map[key].push(ev);
    });
    return map;
  }, []);

  const selectedKey = selectedDate ? toKey(selectedDate) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Agenda do Mês</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendário</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <Calendar
                className="h-full"
                mode="single"
                selected={selectedDate}
                onDayClick={(day) => setSelectedDate(day || undefined)}
                modifiers={{ hasEvent: eventDates }}
                modifiersClassNames={{ hasEvent: "ring-2 ring-primary/50 rounded-full" }}
                dayContent={(date) => {
                  const key = toKey(date);
                  const evs = eventsByDate[key] || [];
                  if (evs.length === 0) return <div className="w-full h-full" />;
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-[0.72rem]">{date.getDate()}</div>
                        <div className="flex items-center gap-1">
                          {evs.slice(0, 3).map((ev) => (
                            <span key={ev.id} className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: ev.color }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </CardContent>
          </Card>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Eventos {selectedKey ? `em ${format(new Date(selectedKey), "dd/MM/yyyy")}` : "do mês"}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedKey ? (
                  (eventsByDate[selectedKey] || []).length === 0 ? (
                    <p className="text-muted-foreground">Nenhum evento nesta data.</p>
                  ) : (
                    (eventsByDate[selectedKey] || []).map((ev) => (
                      <div key={ev.id} className="mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: ev.color + "20" }}>
                              <CalendarIcon className="h-5 w-5" style={{ color: ev.color }} />
                            </div>
                            <div>
                              <h3 className="font-medium">{ev.title}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(ev.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          <Badge style={{ backgroundColor: ev.color }}>{ev.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{ev.description}</p>
                      </div>
                    ))
                  )
                ) : (
                  // lista todos os eventos do mês (agrupados por data)
                  Object.keys(eventsByDate).length === 0 ? (
                    <p className="text-muted-foreground">Nenhum evento cadastrado.</p>
                  ) : (
                    Object.keys(eventsByDate)
                      .sort()
                      .map((dateKey) => (
                        <div key={dateKey} className="mb-4">
                          <h4 className="font-semibold">{format(new Date(dateKey), "dd 'de' MMMM", { locale: ptBR })}</h4>
                          {(eventsByDate[dateKey] || []).map((ev) => (
                            <div key={ev.id} className="mt-2 p-3 bg-muted/5 rounded-md">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: ev.color + "20" }}>
                                      <CalendarIcon className="h-4 w-4" style={{ color: ev.color }} />
                                    </div>
                                    <div>
                                      <div className="font-medium">{ev.title}</div>
                                      <div className="text-xs text-muted-foreground">{ev.description}</div>
                                    </div>
                                  </div>
                                </div>
                                <Badge style={{ backgroundColor: ev.color }}>{ev.type}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agenda;
