import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { users as mockUsers, createUser, events as mockEvents } from "@/data/mockData";
import { User, Event } from "@/types";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const [events, setEvents] = useState<Event[]>([...mockEvents]);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "user",
    category: "outros",
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    type: "outro",
    color: "#3B82F6",
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createUser({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      fullName: newUser.fullName,
      role: "user",
      category: newUser.category as any,
      setor: "",
      birthDate: "",
    } as any);
    setUsers((s) => [created, ...s]);
    setNewUser({ username: "", email: "", password: "", fullName: "", role: "user", category: "outros" });
  };

  const handleDeleteUser = (id: string) => {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx !== -1) mockUsers.splice(idx, 1);
    setUsers([...mockUsers]);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const ev: Event = {
      id: String(Date.now()),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      type: newEvent.type,
      color: newEvent.color,
      createdBy: "admin",
      createdAt: new Date().toISOString(),
    } as Event;
    mockEvents.unshift(ev);
    setEvents([...mockEvents]);
    setNewEvent({ title: "", description: "", date: "", type: "outro", color: "#3B82F6" });
  };

  const handleDeleteEvent = (id: string) => {
    const idx = mockEvents.findIndex(ev => ev.id === id);
    if (idx !== -1) mockEvents.splice(idx, 1);
    setEvents([...mockEvents]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Administração</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Adicionar Usuário</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo usuário</DialogTitle>
                      <DialogDescription>Crie um usuário de teste (mock)</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-3">
                      <div>
                        <Label>Nome completo</Label>
                        <Input value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Usuário</Label>
                        <Input value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Senha</Label>
                        <Input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Criar</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-muted/5 rounded">
                    <div>
                      <div className="font-medium">{u.fullName}</div>
                      <div className="text-xs text-muted-foreground">{u.email} • {u.category}</div>
                    </div>
                    <div>
                      <Button variant="destructive" onClick={() => handleDeleteUser(u.id)}>Excluir</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Adicionar Evento</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo evento</DialogTitle>
                      <DialogDescription>Adicione eventos à agenda (mock)</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddEvent} className="space-y-3">
                      <div>
                        <Label>Título</Label>
                        <Input value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} />
                      </div>
                      <div>
                        <Label>Data</Label>
                        <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Cor (hex)</Label>
                        <Input value={newEvent.color} onChange={(e) => setNewEvent({...newEvent, color: e.target.value})} />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Salvar evento</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between p-3 bg-muted/5 rounded">
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-xs text-muted-foreground">{ev.date} • {ev.type}</div>
                    </div>
                    <div>
                      <Button variant="destructive" onClick={() => handleDeleteEvent(ev.id)}>Excluir</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
