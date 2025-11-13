import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { users as mockUsers, createUser, events as mockEvents, collaborators as mockCollaborators, companies as mockCompanies, createCompany, updateCompany, deleteCompany } from "@/data/mockData";
import { Company } from "@/types";
import { User, Event, Collaborator } from "@/types";
import { format } from "date-fns";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const [events, setEvents] = useState<Event[]>([...mockEvents]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([...mockCollaborators]);
  const [companies, setCompanies] = useState<Company[]>([...mockCompanies]);

  const [newCollaborator, setNewCollaborator] = useState({
    fullName: "",
    email: "",
    category: "outros",
    setor: "",
    birthDate: "",
    photoUrl: "",
  });

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    const coll: Collaborator = {
      id: String(Date.now()),
      fullName: newCollaborator.fullName,
      category: newCollaborator.category as any,
      email: newCollaborator.email,
      setor: newCollaborator.setor,
      birthDate: newCollaborator.birthDate,
      photoUrl: newCollaborator.photoUrl || undefined,
    } as Collaborator;
    mockCollaborators.unshift(coll);
    setCollaborators([...mockCollaborators]);
    setNewCollaborator({ fullName: "", email: "", category: "outros", setor: "", birthDate: "", photoUrl: "" });
  };

  const handleDeleteCollaborator = (id: string) => {
    const idx = mockCollaborators.findIndex(c => c.id === id);
    if (idx !== -1) mockCollaborators.splice(idx, 1);
    setCollaborators([...mockCollaborators]);
  };

  const handleUpdateCollaborator = (data: Collaborator) => {
    const idx = mockCollaborators.findIndex(c => c.id === data.id);
    if (idx !== -1) {
      mockCollaborators[idx] = { ...mockCollaborators[idx], ...data };
      setCollaborators([...mockCollaborators]);
    }
    setEditCollabModalOpen(false);
    setEditingCollab(null);
  };

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

  // Companies (multiempresa) - criação rápida
  const [newCompany, setNewCompany] = useState({
    nome: "",
    cnpj: "",
    logo: "",
    brandColor: "#3B82F6",
  });

  const [companiesModalOpen, setCompaniesModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // Users edit/list modal
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);

  // Events edit/list modal
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);

  // Collaborators edit/list modal
  const [collabsModalOpen, setCollabsModalOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);
  const [editCollabModalOpen, setEditCollabModalOpen] = useState(false);

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createCompany({
      nome: newCompany.nome,
      cnpj: newCompany.cnpj,
      logo: newCompany.logo,
      brandColor: newCompany.brandColor,
    });
    setCompanies((s) => [created, ...s]);
    setNewCompany({ nome: "", cnpj: "", logo: "", brandColor: "#3B82F6" });
  };

  const handleDeleteCompany = async (id: string) => {
    const ok = await deleteCompany(id);
    if (ok) setCompanies((s) => s.filter(c => c.id !== id));
  };

  const handleUpdateCompany = async (data: Company) => {
    const updated = await updateCompany(data.id, data);
    if (updated) {
      setCompanies((s) => s.map(c => c.id === updated.id ? updated : c));
    }
    setEditModalOpen(false);
    setEditingCompany(null);
  };

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

  const handleUpdateUser = (data: User) => {
    const idx = mockUsers.findIndex(u => u.id === data.id);
    if (idx !== -1) {
      mockUsers[idx] = { ...mockUsers[idx], ...data };
      setUsers([...mockUsers]);
    }
    setEditUserModalOpen(false);
    setEditingUser(null);
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

  const handleUpdateEvent = (data: Event) => {
    const idx = mockEvents.findIndex(ev => ev.id === data.id);
    if (idx !== -1) {
      mockEvents[idx] = { ...mockEvents[idx], ...data };
      setEvents([...mockEvents]);
    }
    setEditEventModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Administração</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <Card className="flex flex-col h-full min-h-[260px]">
            <CardHeader className="pb-4">
              <CardTitle>Gerenciar Usuários</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex flex-row flex-wrap items-start gap-3 w-full min-w-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">Adicionar Usuário</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-full">
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

                <Dialog open={usersModalOpen} onOpenChange={setUsersModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">Editar Usuários</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] w-full">
                    <DialogHeader>
                      <DialogTitle>Usuários cadastrados</DialogTitle>
                      <DialogDescription>Edite ou exclua usuários existentes</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 max-h-[60vh] overflow-auto">
                      {users.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-muted/5 rounded gap-4">
                          <div className="min-w-0">
                            <div className="font-medium whitespace-normal">{u.fullName}</div>
                            <div className="text-xs text-muted-foreground whitespace-normal">{u.email} • {u.category}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button className="w-full sm:w-auto" onClick={() => { setEditingUser(u); setEditUserModalOpen(true); }}>Editar</Button>
                            <Button variant="destructive" className="w-full sm:w-auto" onClick={() => handleDeleteUser(u.id)}>Excluir</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Dialog open={editUserModalOpen} onOpenChange={setEditUserModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogDescription>Altere os dados do usuário</DialogDescription>
                  </DialogHeader>
                  {editingUser ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(editingUser); }} className="space-y-3">
                      <div>
                        <Label>Nome</Label>
                        <Input value={editingUser.fullName} onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value} as User)} required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value} as User)} />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Input value={editingUser.category} onChange={(e) => setEditingUser({...editingUser, category: e.target.value as any} as User)} />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="destructive" onClick={() => { handleDeleteUser(editingUser.id); setEditUserModalOpen(false); }}>Excluir</Button>
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => { setEditUserModalOpen(false); setEditingUser(null); }}>Cancelar</Button>
                          <Button type="submit">Salvar</Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div>Nenhum usuário selecionado.</div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="justify-end border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total: {users.length} usuário(s)</span>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full min-h-[260px]">
            <CardHeader className="pb-4">
              <CardTitle>Gerenciar Eventos</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex flex-row flex-wrap items-start gap-3 w-full min-w-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">Adicionar Evento</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-full">
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

                <Dialog open={eventsModalOpen} onOpenChange={setEventsModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">Editar Eventos</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] w-full">
                    <DialogHeader>
                      <DialogTitle>Eventos cadastrados</DialogTitle>
                      <DialogDescription>Edite ou exclua eventos existentes</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 max-h-[60vh] overflow-auto">
                      {events.map((ev) => (
                        <div key={ev.id} className="flex items-center justify-between p-3 bg-muted/5 rounded gap-4">
                          <div className="min-w-0">
                            <div className="font-medium whitespace-normal">{ev.title}</div>
                            <div className="text-xs text-muted-foreground whitespace-normal">{ev.date} • {ev.type}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button className="w-full sm:w-auto" onClick={() => { setEditingEvent(ev); setEditEventModalOpen(true); }}>Editar</Button>
                            <Button variant="destructive" className="w-full sm:w-auto" onClick={() => handleDeleteEvent(ev.id)}>Excluir</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Dialog open={editEventModalOpen} onOpenChange={setEditEventModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Evento</DialogTitle>
                    <DialogDescription>Altere os dados do evento</DialogDescription>
                  </DialogHeader>
                  {editingEvent ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateEvent(editingEvent); }} className="space-y-3">
                      <div>
                        <Label>Título</Label>
                        <Input value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value} as Event)} required />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea value={editingEvent.description} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value} as Event)} />
                      </div>
                      <div>
                        <Label>Data</Label>
                        <Input type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value} as Event)} />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="destructive" onClick={() => { handleDeleteEvent(editingEvent.id); setEditEventModalOpen(false); }}>Excluir</Button>
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => { setEditEventModalOpen(false); setEditingEvent(null); }}>Cancelar</Button>
                          <Button type="submit">Salvar</Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div>Nenhum evento selecionado.</div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="justify-end border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total: {events.length} evento(s)</span>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full min-h-[260px]">
            <CardHeader className="pb-4">
              <CardTitle>Gerenciar Aniversariantes</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex flex-row flex-wrap items-start gap-3 w-full min-w-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">Adicionar Aniversariante</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-full">
                    <DialogHeader>
                      <DialogTitle>Novo aniversariante</DialogTitle>
                      <DialogDescription>Adicione um colaborador ao mural de aniversários</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddCollaborator} className="space-y-3">
                      <div>
                        <Label>Nome completo</Label>
                        <Input value={newCollaborator.fullName} onChange={(e) => setNewCollaborator({...newCollaborator, fullName: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={newCollaborator.email} onChange={(e) => setNewCollaborator({...newCollaborator, email: e.target.value})} />
                      </div>
                      <div>
                        <Label>Data de nascimento</Label>
                        <Input type="date" value={newCollaborator.birthDate} onChange={(e) => setNewCollaborator({...newCollaborator, birthDate: e.target.value})} />
                      </div>
                      <div>
                        <Label>Setor</Label>
                        <Input value={newCollaborator.setor} onChange={(e) => setNewCollaborator({...newCollaborator, setor: e.target.value})} />
                      </div>
                      <div>
                        <Label>URL da foto (opcional)</Label>
                        <Input value={newCollaborator.photoUrl} onChange={(e) => setNewCollaborator({...newCollaborator, photoUrl: e.target.value})} />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Adicionar</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={collabsModalOpen} onOpenChange={setCollabsModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">Editar Aniversariantes</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] w-full">
                    <DialogHeader>
                      <DialogTitle>Aniversariantes</DialogTitle>
                      <DialogDescription>Edite ou exclua aniversariantes</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 max-h-[60vh] overflow-auto">
                      {collaborators.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-muted/5 rounded gap-4">
                          <div className="min-w-0">
                            <div className="font-medium whitespace-normal">{c.fullName}</div>
                            <div className="text-xs text-muted-foreground whitespace-normal">{c.email} • {c.setor} • {c.birthDate ? format(new Date(c.birthDate), "dd/MM/yyyy") : "-"}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button className="w-full sm:w-auto" onClick={() => { setEditingCollab(c); setEditCollabModalOpen(true); }}>Editar</Button>
                            <Button variant="destructive" className="w-full sm:w-auto" onClick={() => handleDeleteCollaborator(c.id)}>Excluir</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Dialog open={editCollabModalOpen} onOpenChange={setEditCollabModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Aniversariante</DialogTitle>
                    <DialogDescription>Altere os dados do aniversariante</DialogDescription>
                  </DialogHeader>
                  {editingCollab ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateCollaborator(editingCollab); }} className="space-y-3">
                      <div>
                        <Label>Nome</Label>
                        <Input value={editingCollab.fullName} onChange={(e) => setEditingCollab({...editingCollab, fullName: e.target.value} as Collaborator)} required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={editingCollab.email} onChange={(e) => setEditingCollab({...editingCollab, email: e.target.value} as Collaborator)} />
                      </div>
                      <div>
                        <Label>Setor</Label>
                        <Input value={editingCollab.setor || ""} onChange={(e) => setEditingCollab({...editingCollab, setor: e.target.value} as Collaborator)} />
                      </div>
                      <div>
                        <Label>Data de nascimento</Label>
                        <Input type="date" value={editingCollab.birthDate || ""} onChange={(e) => setEditingCollab({...editingCollab, birthDate: e.target.value} as Collaborator)} />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="destructive" onClick={() => { if (editingCollab) { handleDeleteCollaborator(editingCollab.id); setEditCollabModalOpen(false); } }}>Excluir</Button>
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => { setEditCollabModalOpen(false); setEditingCollab(null); }}>Cancelar</Button>
                          <Button type="submit">Salvar</Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div>Nenhum colaborador selecionado.</div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="justify-end border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total: {collaborators.length} aniversariante(s)</span>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full min-h-[260px]">
            <CardHeader className="pb-4">
              <CardTitle>Gerenciar Empresas</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex flex-row flex-wrap items-start gap-3 w-full min-w-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">Adicionar Empresa</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-full">
                    <DialogHeader>
                      <DialogTitle>Nova Empresa</DialogTitle>
                      <DialogDescription>Crie uma nova empresa (mock)</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddCompany} className="space-y-3">
                      <div>
                        <Label>Nome</Label>
                        <Input value={newCompany.nome} onChange={(e) => setNewCompany({...newCompany, nome: e.target.value})} required />
                      </div>
                      <div>
                        <Label>CNPJ</Label>
                        <Input value={newCompany.cnpj} onChange={(e) => setNewCompany({...newCompany, cnpj: e.target.value})} />
                      </div>
                      <div>
                        <Label>Logo (URL)</Label>
                        <Input value={newCompany.logo} onChange={(e) => setNewCompany({...newCompany, logo: e.target.value})} />
                      </div>
                      <div>
                        <Label>Cor (hex)</Label>
                        <Input value={newCompany.brandColor} onChange={(e) => setNewCompany({...newCompany, brandColor: e.target.value})} />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Criar Empresa</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={companiesModalOpen} onOpenChange={setCompaniesModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">Editar Empresas</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] w-full">
                    <DialogHeader>
                      <DialogTitle>Empresas cadastradas</DialogTitle>
                      <DialogDescription>Edite ou exclua empresas existentes</DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-3 max-h-[60vh] overflow-auto">
                      {companies.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-muted/5 rounded gap-4">
                          <div className="min-w-0">
                            <div className="font-medium whitespace-normal">{c.nome}</div>
                            <div className="text-xs text-muted-foreground whitespace-normal">{c.cnpj} • {c.id}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button className="w-full sm:w-auto" onClick={() => { setEditingCompany(c); setEditModalOpen(true); }}>Editar</Button>
                            <Button variant="destructive" className="w-full sm:w-auto" onClick={() => handleDeleteCompany(c.id)}>Excluir</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Edit company modal (controlled) */}
              <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Empresa</DialogTitle>
                    <DialogDescription>Altere os dados da empresa</DialogDescription>
                  </DialogHeader>
                  {editingCompany ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateCompany(editingCompany); }} className="space-y-3">
                      <div>
                        <Label>Nome</Label>
                        <Input value={editingCompany.nome} onChange={(e) => setEditingCompany({...editingCompany, nome: e.target.value} as Company)} required />
                      </div>
                      <div>
                        <Label>CNPJ</Label>
                        <Input value={editingCompany.cnpj || ""} onChange={(e) => setEditingCompany({...editingCompany, cnpj: e.target.value} as Company)} />
                      </div>
                      <div>
                        <Label>Logo (URL)</Label>
                        <Input value={editingCompany.logo || ""} onChange={(e) => setEditingCompany({...editingCompany, logo: e.target.value} as Company)} />
                      </div>
                      <div>
                        <Label>Cor (hex)</Label>
                        <Input value={editingCompany.brandColor || ""} onChange={(e) => setEditingCompany({...editingCompany, brandColor: e.target.value} as Company)} />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="destructive" onClick={() => { if (editingCompany) { handleDeleteCompany(editingCompany.id); setEditModalOpen(false); } }}>Excluir</Button>
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => { setEditModalOpen(false); setEditingCompany(null); }}>Cancelar</Button>
                          <Button type="submit">Salvar</Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div>Nenhuma empresa selecionada.</div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="justify-end border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total: {companies.length} empresa(s)</span>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
