// Página de Aniversariantes do Mês
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBirthdaysByMonth } from "@/data/mockData";
import { Cake } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Aniversariantes = () => {
  const currentMonth = new Date().getMonth() + 1;
  const birthdays = getBirthdaysByMonth(currentMonth);

  return (
    <AppLayout maxWidthClass="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Cake className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Aniversariantes do Mês</h1>
      </div>

      {birthdays.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum aniversariante este mês.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {birthdays.map((person) => (
            <Card key={person.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={person.photoUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {person.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{person.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{person.setor}</p>
                    <p className="text-sm text-primary font-medium mt-1">
                      🎉{" "}
                      {person.birthDate &&
                        format(new Date(person.birthDate), "dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Aniversariantes;
