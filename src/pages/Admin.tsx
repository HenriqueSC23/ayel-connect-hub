import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
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
import {
  users as mockUsers,
  createUser,
  events as mockEvents,
  collaborators as mockCollaborators,
  companies as mockCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  ramais as mockRamais,
  createRamal,
  updateRamal,
  deleteRamal,
  trainings as mockTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
} from "@/data/mockData";
import {
  Company,
  CompanyTarget,
  Ramal,
  Training,
  User,
  Event,
  Collaborator,
  PostRoleTarget,
  UserRole,
  UserCategory,
} from "@/types";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Admin = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";
  const defaultCompanyId = user?.companyId || mockCompanies[0]?.id || "";
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const [events, setEvents] = useState<Event[]>([...mockEvents]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([...mockCollaborators]);
  const [companies, setCompanies] = useState<Company[]>([...mockCompanies]);
  const [ramais, setRamais] = useState<Ramal[]>([...mockRamais]);
  const [trainings, setTrainings] = useState<Training[]>([...mockTrainings]);

  const categoryOptions: { label: string; value: UserCategory }[] = [
    { label: "Vendedor", value: "vendedor" },
    { label: "Técnico", value: "tecnico" },
    { label: "RH", value: "rh" },
    { label: "Administrativo", value: "administrativo" },
    { label: "Outros", value: "outros" },
  ];

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: "Usuário", value: "user" },
    { label: "Admin", value: "admin" },
    { label: "Superadmin", value: "superadmin" },
  ];

  const NO_COMPANY_VALUE = "__none__";

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
    role: "user" as UserRole,
    category: "outros" as UserCategory,
    companyId: defaultCompanyId,
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    type: "outro",
    color: "#3B82F6",
    roleTarget: "all" as PostRoleTarget,
    companyTarget: "all" as CompanyTarget,
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

  // Ramais modals/forms
  const [ramalListModalOpen, setRamalListModalOpen] = useState(false);
  const [ramalCreateModalOpen, setRamalCreateModalOpen] = useState(false);
  const [ramalEditModalOpen, setRamalEditModalOpen] = useState(false);
  const [editingRamal, setEditingRamal] = useState<Ramal | null>(null);
  const [newRamal, setNewRamal] = useState({
    name: "",
    sector: "",
    extension: "",
    phone: "",
    email: "",
    companyId: defaultCompanyId,
  });
  const [trainingListModalOpen, setTrainingListModalOpen] = useState(false);
  const [trainingCreateModalOpen, setTrainingCreateModalOpen] = useState(false);
  const [trainingEditModalOpen, setTrainingEditModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [newTraining, setNewTraining] = useState({
    title: "",
    shortDescription: "",
    imageUrl: "",
    category: "geral" as const,
    content: "",
    companyId: defaultCompanyId,
  });

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
    const enforcedCompanyId = isSuperAdmin ? newUser.companyId : user?.companyId || newUser.companyId || defaultCompanyId;
    const created = await createUser({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      fullName: newUser.fullName,
      role: newUser.role,
      category: newUser.category,
      companyId: enforcedCompanyId || undefined,
      setor: "",
      birthDate: "",
    } as User);
    setUsers((s) => [created, ...s]);
    setNewUser({
      username: "",
      email: "",
      password: "",
      fullName: "",
      role: "user",
      category: "outros",
      companyId: isSuperAdmin ? (companies[0]?.id || defaultCompanyId) : (user?.companyId || defaultCompanyId),
    });
  };

  const handleDeleteUser = (id: string) => {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx !== -1) mockUsers.splice(idx, 1);
    setUsers([...mockUsers]);
  };

  const handleUpdateUser = (data: User) => {
    const enforcedCompanyId = isSuperAdmin ? data.companyId : user?.companyId || data.companyId;
    const payload: User = { ...data, companyId: enforcedCompanyId };
    const idx = mockUsers.findIndex(u => u.id === data.id);
    if (idx !== -1) {
      mockUsers[idx] = { ...mockUsers[idx], ...payload };
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
      roleTarget: newEvent.roleTarget,
      companyTarget: newEvent.companyTarget,
    } as Event;
    mockEvents.unshift(ev);
    setEvents([...mockEvents]);
    setNewEvent({ title: "", description: "", date: "", type: "outro", color: "#3B82F6", roleTarget: "all", companyTarget: "all" });
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

  const resetNewRamal = () => {
    setNewRamal({
      name: "",
      sector: "",
      extension: "",
      phone: "",
      email: "",
      companyId: isSuperAdmin ? companies[0]?.id || defaultCompanyId : user?.companyId || defaultCompanyId,
    });
  };

  const handleAddRamal = async (e: React.FormEvent) => {
    e.preventDefault();
    const companyId = isSuperAdmin ? newRamal.companyId : user?.companyId || defaultCompanyId;
    if (!newRamal.name || !newRamal.sector || !newRamal.extension || !companyId) return;
    await createRamal({
      name: newRamal.name,
      sector: newRamal.sector,
      extension: newRamal.extension,
      phone: newRamal.phone || undefined,
      email: newRamal.email || undefined,
      companyId,
    });
    setRamais([...mockRamais]);
    setRamalCreateModalOpen(false);
    resetNewRamal();
  };

  const handleDeleteRamal = async (id: string) => {
    await deleteRamal(id);
    setRamais([...mockRamais]);
  };

  const handleEditRamalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRamal) return;
    const companyId = isSuperAdmin ? editingRamal.companyId : user?.companyId || editingRamal.companyId;
    if (!editingRamal.name || !editingRamal.sector || !editingRamal.extension || !companyId) return;
    await updateRamal(editingRamal.id, { ...editingRamal, companyId });
    setRamais([...mockRamais]);
    setRamalEditModalOpen(false);
    setEditingRamal(null);
  };

  const resetNewTraining = () => {
    setNewTraining({
      title: "",
      shortDescription: "",
      imageUrl: "",
      category: "geral",
      content: "",
      companyId: isSuperAdmin ? companies[0]?.id || defaultCompanyId : user?.companyId || defaultCompanyId,
    });
  };

  const handleAddTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    const companyId = isSuperAdmin ? newTraining.companyId : user?.companyId || defaultCompanyId;
    if (!newTraining.title || !newTraining.shortDescription || !newTraining.imageUrl || !newTraining.content || !companyId) return;
    await createTraining({
      title: newTraining.title,
      shortDescription: newTraining.shortDescription,
      imageUrl: newTraining.imageUrl,
      category: newTraining.category,
      content: newTraining.content,
      companyId,
    });
    setTrainings([...mockTrainings]);
    setTrainingCreateModalOpen(false);
    resetNewTraining();
  };

  const handleDeleteTraining = async (id: string) => {
    await deleteTraining(id);
    setTrainings([...mockTrainings]);
  };

  const handleEditTrainingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTraining) return;
    const companyId = isSuperAdmin ? editingTraining.companyId : user?.companyId || editingTraining.companyId;
    if (!editingTraining.title || !editingTraining.shortDescription || !editingTraining.imageUrl || !editingTraining.content || !companyId) return;
    await updateTraining(editingTraining.id, { ...editingTraining, companyId });
    setTrainings([...mockTrainings]);
    setTrainingEditModalOpen(false);
    setEditingTraining(null);
  };

  const getCompanyName = (id: string) => companies.find((c) => c.id === id)?.nome || "Empresa";
  const accessibleRamais = isSuperAdmin ? ramais : ramais.filter((ramal) => !user?.companyId || ramal.companyId === user?.companyId);
  const accessibleTrainings = isSuperAdmin ? trainings : trainings.filter((training) => !user?.companyId || training.companyId === user?.companyId);

  return (
    <AppLayout>
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
                      <div>
                        <Label>Função / setor *</Label>
                        <Select value={newUser.category} onValueChange={(value) => setNewUser({ ...newUser, category: value as UserCategory })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Empresa *</Label>
                        {isSuperAdmin ? (
                          <Select value={newUser.companyId} onValueChange={(value) => setNewUser({ ...newUser, companyId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input value={getCompanyName(user?.companyId || defaultCompanyId)} disabled />
                        )}
                      </div>
                      <div>
                        <Label>Nível de acesso</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Input
                          value={editingUser.fullName}
                          onChange={(e) =>
                            setEditingUser((prev) => (prev ? ({ ...prev, fullName: e.target.value } as User) : prev))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser((prev) => (prev ? ({ ...prev, email: e.target.value } as User) : prev))
                          }
                        />
                      </div>
                      <div>
                        <Label>Função / setor</Label>
                        <Select
                          value={editingUser.category}
                          onValueChange={(value) =>
                            setEditingUser((prev) =>
                              prev ? ({ ...prev, category: value as UserCategory } as User) : prev
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Empresa</Label>
                        {isSuperAdmin ? (
                          <Select
                            value={editingUser.companyId ?? NO_COMPANY_VALUE}
                            onValueChange={(value) =>
                              setEditingUser((prev) =>
                                prev
                                  ? ({
                                      ...prev,
                                      companyId: value === NO_COMPANY_VALUE ? undefined : value,
                                    } as User)
                                  : prev
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={NO_COMPANY_VALUE}>Sem empresa definida</SelectItem>
                              {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input value={getCompanyName(user?.companyId || editingUser.companyId || defaultCompanyId)} disabled />
                        )}
                      </div>
                      <div>
                        <Label>Nível de acesso</Label>
                        <Select
                          value={editingUser.role}
                          onValueChange={(value) =>
                            setEditingUser((prev) => (prev ? ({ ...prev, role: value as UserRole } as User) : prev))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <div>
                        <Label>Função / setor alvo *</Label>
                        <Select value={newEvent.roleTarget} onValueChange={(value) => setNewEvent({ ...newEvent, roleTarget: value as PostRoleTarget })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os setores</SelectItem>
                            <SelectItem value="vendedor">Vendedores</SelectItem>
                            <SelectItem value="tecnico">Técnicos</SelectItem>
                            <SelectItem value="rh">RH</SelectItem>
                            <SelectItem value="administrativo">Administrativo</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Empresa alvo *</Label>
                        <Select value={newEvent.companyTarget} onValueChange={(value) => setNewEvent({ ...newEvent, companyTarget: value as CompanyTarget })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as empresas</SelectItem>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <div>
                        <Label>Função / setor alvo *</Label>
                        <Select value={editingEvent.roleTarget} onValueChange={(value) => setEditingEvent({...editingEvent, roleTarget: value as PostRoleTarget} as Event)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os setores</SelectItem>
                            <SelectItem value="vendedor">Vendedores</SelectItem>
                            <SelectItem value="tecnico">Técnicos</SelectItem>
                            <SelectItem value="rh">RH</SelectItem>
                            <SelectItem value="administrativo">Administrativo</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Empresa alvo *</Label>
                        <Select value={editingEvent.companyTarget} onValueChange={(value) => setEditingEvent({...editingEvent, companyTarget: value as CompanyTarget} as Event)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as empresas</SelectItem>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

          <Card className="flex flex-col h-full min-h-[260px]">
            <CardHeader className="pb-4">
              <CardTitle>Gerenciar Ramais</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex flex-row flex-wrap items-start gap-3 w-full min-w-0">
                <Dialog
                  open={ramalCreateModalOpen}
                  onOpenChange={(open) => {
                    setRamalCreateModalOpen(open);
                    if (!open) resetNewRamal();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">Adicionar Ramal</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-full">
                    <DialogHeader>
                      <DialogTitle>Novo Ramal</DialogTitle>
                      <DialogDescription>Cadastre um novo ramal interno</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddRamal} className="space-y-3">
                      <div>
                        <Label>Nome</Label>
                        <Input value={newRamal.name} onChange={(e) => setNewRamal({ ...newRamal, name: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Setor/Categoria</Label>
                        <Input value={newRamal.sector} onChange={(e) => setNewRamal({ ...newRamal, sector: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Número do Ramal</Label>
                          <Input value={newRamal.extension} onChange={(e) => setNewRamal({ ...newRamal, extension: e.target.value })} required />
                        </div>
                        <div>
                          <Label>Telefone</Label>
                          <Input value={newRamal.phone} onChange={(e) => setNewRamal({ ...newRamal, phone: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={newRamal.email} onChange={(e) => setNewRamal({ ...newRamal, email: e.target.value })} />
                      </div>
                      {isSuperAdmin ? (
                        <div>
                          <Label>Empresa</Label>
                          <Select value={newRamal.companyId} onValueChange={(value) => setNewRamal({ ...newRamal, companyId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockCompanies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div>
                          <Label>Empresa</Label>
                          <Input value={getCompanyName(user?.companyId || newRamal.companyId)} disabled />
                        </div>
                      )}
                      <div className="flex justify-end">
                        <Button type="submit">Salvar Ramal</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={ramalListModalOpen} onOpenChange={setRamalListModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Editar Ramais
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[850px] w-full">
                    <DialogHeader>
                      <DialogTitle>Ramais cadastrados</DialogTitle>
                      <DialogDescription>Atualize ou exclua os ramais disponíveis</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 max-h-[60vh] overflow-auto">
                      {accessibleRamais.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Nenhum ramal disponível.</div>
                      ) : (
                        accessibleRamais.map((ramal) => (
                          <div key={ramal.id} className="border rounded-lg p-3 flex flex-col gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <div className="font-semibold">{ramal.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Setor: {ramal.sector} • Ramal {ramal.extension}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {ramal.phone && <>Tel: {ramal.phone} • </>}
                                  {ramal.email}
                                </div>
                                {isSuperAdmin && (
                                  <div className="text-xs text-muted-foreground">Empresa: {getCompanyName(ramal.companyId)}</div>
                                )}
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setEditingRamal({ ...ramal });
                                    setRamalEditModalOpen(true);
                                  }}
                                >
                                  Editar
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteRamal(ramal.id)}>
                                  Excluir
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Dialog open={ramalEditModalOpen} onOpenChange={(open) => { setRamalEditModalOpen(open); if (!open) setEditingRamal(null); }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Ramal</DialogTitle>
                    <DialogDescription>Atualize os dados do ramal selecionado</DialogDescription>
                  </DialogHeader>
                  {editingRamal ? (
                    <form onSubmit={handleEditRamalSubmit} className="space-y-3">
                      <div>
                        <Label>Nome</Label>
                        <Input value={editingRamal.name} onChange={(e) => setEditingRamal({ ...editingRamal, name: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Setor</Label>
                        <Input value={editingRamal.sector} onChange={(e) => setEditingRamal({ ...editingRamal, sector: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Ramal</Label>
                          <Input value={editingRamal.extension} onChange={(e) => setEditingRamal({ ...editingRamal, extension: e.target.value })} required />
                        </div>
                        <div>
                          <Label>Telefone</Label>
                          <Input value={editingRamal.phone || ""} onChange={(e) => setEditingRamal({ ...editingRamal, phone: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={editingRamal.email || ""} onChange={(e) => setEditingRamal({ ...editingRamal, email: e.target.value })} />
                      </div>
                      {isSuperAdmin ? (
                        <div>
                          <Label>Empresa</Label>
                          <Select value={editingRamal.companyId} onValueChange={(value) => setEditingRamal({ ...editingRamal, companyId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockCompanies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div>
                          <Label>Empresa</Label>
                          <Input value={getCompanyName(editingRamal.companyId)} disabled />
                        </div>
                      )}
                      <div className="flex justify-between">
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            if (editingRamal) {
                              handleDeleteRamal(editingRamal.id);
                              setRamalEditModalOpen(false);
                              setEditingRamal(null);
                            }
                          }}
                        >
                          Excluir
                        </Button>
                        <div className="flex gap-2">
                          <Button type="button" variant="ghost" onClick={() => { setRamalEditModalOpen(false); setEditingRamal(null); }}>
                            Cancelar
                          </Button>
                          <Button type="submit">Salvar</Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div>Nenhum ramal selecionado.</div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="justify-end border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total: {accessibleRamais.length} ramal(is)</span>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full min-h-[260px]">
            <CardHeader className="pb-4">
              <CardTitle>Gerenciar Treinamentos</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex flex-row flex-wrap items-start gap-3 w-full min-w-0">
                <Dialog
                  open={trainingCreateModalOpen}
                  onOpenChange={(open) => {
                    setTrainingCreateModalOpen(open);
                    if (!open) resetNewTraining();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">Adicionar Treinamento</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[650px] w-full">
                    <DialogHeader>
                      <DialogTitle>Novo Treinamento</DialogTitle>
                      <DialogDescription>Cadastre conteúdos para os colaboradores</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTraining} className="space-y-3">
                      <div>
                        <Label>Título</Label>
                        <Input value={newTraining.title} onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Descrição curta</Label>
                        <Input value={newTraining.shortDescription} onChange={(e) => setNewTraining({ ...newTraining, shortDescription: e.target.value })} required />
                      </div>
                      <div>
                        <Label>URL da imagem</Label>
                        <Input value={newTraining.imageUrl} onChange={(e) => setNewTraining({ ...newTraining, imageUrl: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Categoria</Label>
                          <Select value={newTraining.category} onValueChange={(value) => setNewTraining({ ...newTraining, category: value as any })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="geral">Geral</SelectItem>
                              <SelectItem value="vendedor">Vendedor</SelectItem>
                              <SelectItem value="tecnico">Técnico</SelectItem>
                              <SelectItem value="suporte">Suporte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {isSuperAdmin ? (
                          <div>
                            <Label>Empresa</Label>
                            <Select value={newTraining.companyId} onValueChange={(value) => setNewTraining({ ...newTraining, companyId: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a empresa" />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((company) => (
                                  <SelectItem key={company.id} value={company.id}>
                                    {company.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div>
                            <Label>Empresa</Label>
                            <Input value={getCompanyName(user?.companyId || newTraining.companyId)} disabled />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Conteúdo completo</Label>
                        <Textarea rows={6} value={newTraining.content} onChange={(e) => setNewTraining({ ...newTraining, content: e.target.value })} required />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Salvar Treinamento</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={trainingListModalOpen} onOpenChange={setTrainingListModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Editar Treinamentos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[850px] w-full">
                    <DialogHeader>
                      <DialogTitle>Treinamentos cadastrados</DialogTitle>
                      <DialogDescription>Gerencie os conteúdos publicados</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 max-h-[60vh] overflow-auto">
                      {accessibleTrainings.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Nenhum treinamento disponível.</div>
                      ) : (
                        accessibleTrainings.map((training) => (
                          <div key={training.id} className="flex flex-col gap-2 border rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="font-semibold">{training.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Categoria: {training.category} • {format(new Date(training.createdAt), "dd/MM/yyyy")}
                              </div>
                              {isSuperAdmin && (
                                <div className="text-xs text-muted-foreground">Empresa: {getCompanyName(training.companyId)}</div>
                              )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingTraining({ ...training });
                                  setTrainingEditModalOpen(true);
                                }}
                              >
                                Editar
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteTraining(training.id)}>
                                Excluir
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Dialog open={trainingEditModalOpen} onOpenChange={(open) => { setTrainingEditModalOpen(open); if (!open) setEditingTraining(null); }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Treinamento</DialogTitle>
                    <DialogDescription>Atualize os dados do treinamento</DialogDescription>
                  </DialogHeader>
                  {editingTraining ? (
                    <form onSubmit={handleEditTrainingSubmit} className="space-y-3">
                      <div>
                        <Label>Título</Label>
                        <Input value={editingTraining.title} onChange={(e) => setEditingTraining({ ...editingTraining, title: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Descrição curta</Label>
                        <Input value={editingTraining.shortDescription} onChange={(e) => setEditingTraining({ ...editingTraining, shortDescription: e.target.value })} required />
                      </div>
                      <div>
                        <Label>URL da imagem</Label>
                        <Input value={editingTraining.imageUrl} onChange={(e) => setEditingTraining({ ...editingTraining, imageUrl: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Categoria</Label>
                          <Select value={editingTraining.category} onValueChange={(value) => setEditingTraining({ ...editingTraining, category: value as any })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="geral">Geral</SelectItem>
                              <SelectItem value="vendedor">Vendedor</SelectItem>
                              <SelectItem value="tecnico">Técnico</SelectItem>
                              <SelectItem value="suporte">Suporte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {isSuperAdmin ? (
                          <div>
                            <Label>Empresa</Label>
                            <Select value={editingTraining.companyId} onValueChange={(value) => setEditingTraining({ ...editingTraining, companyId: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a empresa" />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((company) => (
                                  <SelectItem key={company.id} value={company.id}>
                                    {company.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div>
                            <Label>Empresa</Label>
                            <Input value={getCompanyName(editingTraining.companyId)} disabled />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Conteúdo completo</Label>
                        <Textarea rows={6} value={editingTraining.content} onChange={(e) => setEditingTraining({ ...editingTraining, content: e.target.value })} required />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            if (editingTraining) {
                              handleDeleteTraining(editingTraining.id);
                              setTrainingEditModalOpen(false);
                              setEditingTraining(null);
                            }
                          }}
                        >
                          Excluir
                        </Button>
                        <div className="flex gap-2">
                          <Button type="button" variant="ghost" onClick={() => { setTrainingEditModalOpen(false); setEditingTraining(null); }}>
                            Cancelar
                          </Button>
                          <Button type="submit">Salvar</Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div>Nenhum treinamento selecionado.</div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="justify-end border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total: {accessibleTrainings.length} treinamento(s)</span>
            </CardFooter>
          </Card>
      </div>
    </AppLayout>
  );
};

export default Admin;
