// Página de Agenda de Eventos (versão calendário mensal)
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { events as mockEvents } from "@/data/mockData";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const toKey = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const keyToDate = (key: string) => {
    const [y, m, d] = key.split("-").map((n) => Number(n));
    return new Date(y, m - 1, d);
  };

  // UX state: local events copy (so we can mutate in UI), filters and create modal
  const [localEvents, setLocalEvents] = useState<Event[]>([...mockEvents]);
  const [filters, setFilters] = useState<string[]>([]); // empty = all
  const [createOpen, setCreateOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    type: "outro",
    color: "#3B82F6",
  });

  // Normaliza datas para o dia local (evita problemas de fuso)
  // Filtra eventos de acordo com filtros selecionados
  const filteredEvents = useMemo(() => {
    if (!filters || filters.length === 0) return localEvents;
    return localEvents.filter((ev) => filters.includes(ev.type));
  }, [localEvents, filters]);

  // Cria Dates locais a partir das strings 'YYYY-MM-DD' (evita parseISO/UTC)
  const eventDates = useMemo(() => {
    return filteredEvents.map((e) => {
      const [y, m, d] = e.date.split("-").map((n) => Number(n));
      return new Date(y, m - 1, d);
    });
  }, [filteredEvents]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    filteredEvents.forEach((ev) => {
      // Presume ev.date está no formato 'YYYY-MM-DD' e usa a string como chave
      const key = ev.date;
      if (!map[key]) map[key] = [] as any;
      map[key].push(ev);
    });
    return map;
  }, []);

  const selectedKey = selectedDate ? toKey(selectedDate) : undefined;

  return (
    <AppLayout maxWidthClass="max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Agenda do Mês</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendário</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <TooltipProvider>
              <Calendar
                className="h-full"
                mode="single"
                selected={selectedDate}
                onDayClick={(day) => setSelectedDate(day || undefined)}
                modifiers={{ hasEvent: eventDates }}
                modifiersClassNames={{ hasEvent: "ring-2 ring-primary/50 rounded-full" }}
                components={{
                  Day: ({ date, ...dayProps }: any) => {
                    const key = toKey(date);
                    const evs = eventsByDate[key] || [];
                    const title = evs.length === 0 ? "" : evs.map((x: any) => x.title).join("\n");
                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div {...dayProps} className={`w-full h-full flex flex-col items-center justify-center ${dayProps.className || ""}`}>
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-[0.72rem]">{date.getDate()}</div>
                              <div className="flex items-center gap-1 mt-1">
                                {evs.slice(0, 3).map((ev: any) => (
                                  <span key={ev.id} className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: ev.color }} />
                                ))}
                                {evs.length > 3 && (
                                  <span className="text-[0.65rem] text-muted-foreground">+{evs.length - 3}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        {evs.length > 0 && (
                          <TooltipContent>
                            <div className="whitespace-pre-line max-w-xs">{title}</div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  },
                }}
              />
            </TooltipProvider>
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Eventos {selectedKey ? `em ${format(keyToDate(selectedKey as string), "dd/MM/yyyy")}` : "do mês"}</CardTitle>
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
                              {format(keyToDate(ev.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <Badge style={{ backgroundColor: ev.color }}>{ev.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{ev.description}</p>
                    </div>
                  ))
                )
              ) : Object.keys(eventsByDate).length === 0 ? (
                <p className="text-muted-foreground">Nenhum evento cadastrado.</p>
              ) : (
                Object.keys(eventsByDate)
                  .sort()
                  .map((dateKey) => (
                    <div key={dateKey} className="mb-4">
                      <h4 className="font-semibold">{format(keyToDate(dateKey), "dd 'de' MMMM", { locale: ptBR })}</h4>
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Agenda;
