// ============================================
// DASHBOARD (MURAL)
// ============================================
// Página principal da intranet - Feed de posts estilo Instagram/X

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  collaborators as mockCollaborators,
  companies as mockCompanies,
  events as mockEvents,
  getVisiblePosts,
  posts as mockPosts,
} from "@/data/mockData";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { DayProps } from "react-day-picker";
import { CompanyTarget, Post, PostRoleTarget } from "@/types";
import {
  filterPostsByAdminSelectors,
  filterPostsForMobileView,
  getImportantPosts,
  isPostReadyToShow,
} from "@/lib/posts";
import { Switch } from "@/components/ui/switch";
import { filterItemsForUser } from "@/lib/audience";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminRoleFilter, setAdminRoleFilter] = useState<PostRoleTarget>("all");
  const [adminCompanyFilter, setAdminCompanyFilter] = useState<CompanyTarget>("all");
  const [mobilePostFilter, setMobilePostFilter] = useState<"all" | "important">("all");

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageUrl: "",
    roleTarget: "all" as PostRoleTarget,
    companyTarget: "all" as CompanyTarget,
    isImportant: false,
  });
  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const { toast } = useToast();
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const currentTime = useMemo(() => new Date(), []);

  const visiblePosts = getVisiblePosts(user);
  const visibleEvents = useMemo(() => filterItemsForUser(mockEvents, user), [user]);
  const eventDates = useMemo(
    () =>
      visibleEvents.map((e) => {
        const [y, m, d] = e.date.split("-").map(Number);
        return new Date(y, m - 1, d);
      }),
    [visibleEvents],
  );
  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof mockEvents> = {};
    visibleEvents.forEach((ev) => {
      const key = ev.date;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [visibleEvents]);

  const nextBirthday = useMemo(() => {
    const today = new Date();
    const todayY = today.getFullYear();
    const todayStart = new Date(todayY, today.getMonth(), today.getDate());

    const withNextDate = mockCollaborators
      .filter((c) => !!c.birthDate)
      .map((c) => {
        const [, month, day] = (c.birthDate as string).split("-").map(Number);
        let next = new Date(todayY, month - 1, day);
        if (next < todayStart) {
          next = new Date(todayY + 1, month - 1, day);
        }
        return { person: c, next };
      });

    if (withNextDate.length === 0) return null;

    return withNextDate.reduce((closest, current) => {
      if (!closest) return current;
      return current.next < closest.next ? current : closest;
    }, null as { person: (typeof mockCollaborators)[number]; next: Date } | null);
  }, []);

  const postsForUser = useMemo(
    () => (isAdmin ? visiblePosts : visiblePosts.filter((post) => isPostReadyToShow(post, currentTime))),
    [visiblePosts, isAdmin, currentTime],
  );

  const basePosts = isAdmin
    ? filterPostsByAdminSelectors(postsForUser, adminRoleFilter, adminCompanyFilter)
    : postsForUser;

  const importantPosts = useMemo(() => getImportantPosts(basePosts), [basePosts]);

  const postsToShow = useMemo(
    () => filterPostsForMobileView(basePosts, mobilePostFilter),
    [basePosts, mobilePostFilter],
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim() || !user) return;

    const now = new Date();
    let scheduledISO: string | null = null;
    if (publishMode === "schedule") {
      if (!scheduledDate) {
        toast({
          title: "Defina a data de publicação",
          description: "Escolha uma data futura para programar o comunicado.",
          variant: "destructive",
        });
        return;
      }
      const scheduleDate = new Date(`${scheduledDate}T09:00:00`);
      if (scheduleDate <= now) {
        toast({
          title: "Data inválida",
          description: "Selecione uma data futura para agendar a publicação.",
          variant: "destructive",
        });
        return;
      }
      scheduledISO = scheduleDate.toISOString();
    }

    const post: Post = {
      id: String(Date.now()),
      authorId: user.id,
      authorName: user.fullName,
      title: newPost.title,
      content: newPost.content,
      imageUrl: newPost.imageUrl || undefined,
      roleTarget: newPost.roleTarget,
      companyTarget: newPost.companyTarget,
      isImportant: newPost.isImportant,
      likes: [],
      createdAt: now.toISOString(),
      status: publishMode === "schedule" ? "scheduled" : "published",
      scheduledFor: scheduledISO,
      publishedAt: publishMode === "schedule" ? null : now.toISOString(),
    };

    mockPosts.unshift(post);

    setNewPost({
      title: "",
      content: "",
      imageUrl: "",
      roleTarget: "all",
      companyTarget: "all",
      isImportant: false,
    });
    setPublishMode("now");
    setScheduledDate("");
    setDialogOpen(false);
  };

  return (
    <AppLayout maxWidthClass="max-w-6xl">
      <div className="lg:grid lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.9fr)] lg:gap-8">
        <div>
          <div className="mb-6 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-6">
            <h1 className="mb-2 text-2xl font-bold">
              Olá, {user?.fullName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo à TGA intranet
            </p>
          </div>

          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mb-6 w-full gap-2" size="lg">
                  <PlusCircle className="h-5 w-5" />
                  Criar novo post
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar novo post</DialogTitle>
                  <DialogDescription>
                    Compartilhe novidades com toda a equipe
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título (opcional)</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Nova política de benefícios"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      placeholder="Escreva o comunicado..."
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      required
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Imagem (URL)</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={newPost.imageUrl}
                      onChange={(e) =>
                        setNewPost({ ...newPost, imageUrl: e.target.value })
                      }
                    />
                    {newPost.imageUrl && (
                      <img
                        src={newPost.imageUrl}
                        alt="Preview"
                        className="h-40 w-full rounded-lg object-cover"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleTarget">Função / setor alvo *</Label>
                    <Select
                      value={newPost.roleTarget}
                      onValueChange={(value: PostRoleTarget) =>
                        setNewPost({ ...newPost, roleTarget: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="all">Todos os setores</SelectItem>
                        <SelectItem value="vendedor">Vendedores</SelectItem>
                        <SelectItem value="tecnico">Técnicos</SelectItem>
                        <SelectItem value="rh">RH</SelectItem>
                        <SelectItem value="administrativo">Administrativo</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyTarget">Empresa alvo *</Label>
                    <Select
                      value={newPost.companyTarget}
                      onValueChange={(value: CompanyTarget) =>
                        setNewPost({ ...newPost, companyTarget: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="all">Todas as empresas</SelectItem>
                        {mockCompanies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Publicação</Label>
                    <RadioGroup
                      value={publishMode}
                      onValueChange={(value) => setPublishMode(value as "now" | "schedule")}
                      className="grid gap-2 sm:grid-cols-2"
                    >
                      <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-card px-3 py-2">
                        <RadioGroupItem value="now" id="publish-now" />
                        <Label htmlFor="publish-now" className="text-sm font-medium leading-none">
                          Publicar agora
                        </Label>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-card px-3 py-2">
                        <RadioGroupItem value="schedule" id="publish-schedule" />
                        <Label htmlFor="publish-schedule" className="text-sm font-medium leading-none">
                          Agendar
                        </Label>
                      </div>
                    </RadioGroup>
                    {publishMode === "schedule" && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="scheduledDate">Data programada</Label>
                          <Input
                            id="scheduledDate"
                            type="date"
                            min={todayStr}
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">Comunicado importante</p>
                      <p className="text-xs text-muted-foreground">
                        Destaca este post no mural e na barra lateral.
                      </p>
                    </div>
                    <Switch
                      checked={newPost.isImportant}
                      onCheckedChange={(checked) =>
                        setNewPost({ ...newPost, isImportant: checked })
                      }
                      aria-label="Marcar como comunicado importante"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Publicar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {isAdmin && (
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="filter">Filtrar posts</Label>
                <p className="text-xs text-muted-foreground">Função + Empresa</p>
              </div>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                <Select
                  value={adminRoleFilter}
                  onValueChange={(value: PostRoleTarget) => setAdminRoleFilter(value)}
                >
                  <SelectTrigger id="filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Todos os setores</SelectItem>
                    <SelectItem value="vendedor">Vendedores</SelectItem>
                    <SelectItem value="tecnico">Técnicos</SelectItem>
                    <SelectItem value="rh">RH</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={adminCompanyFilter}
                  onValueChange={(value: CompanyTarget) => setAdminCompanyFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Todas as empresas</SelectItem>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="mb-6 md:hidden">
            <Label className="text-sm font-medium">Exibir posts</Label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={mobilePostFilter === "all" ? "default" : "outline"}
                onClick={() => setMobilePostFilter("all")}
              >
                Todos
              </Button>
              <Button
                type="button"
                variant={mobilePostFilter === "important" ? "default" : "outline"}
                onClick={() => setMobilePostFilter("important")}
              >
                Comunicados
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {postsToShow.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
              </div>
            ) : (
              postsToShow.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-card shadow-sm">
              <div className="border-b px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  Comunicados importantes
                </h2>
                <p className="text-xs text-muted-foreground">
                  Destaques publicados para você
                </p>
              </div>
              <div className="divide-y">
                {importantPosts.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-muted-foreground">
                    Nenhum comunicado importante no momento.
                  </div>
                ) : (
                  importantPosts.slice(0, 6).map((post) => (
                    <div key={post.id} className="px-5 py-4">
                      <p className="text-sm font-semibold">
                        {post.title || "Comunicado sem título"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.content.slice(0, 120)}
                        {post.content.length > 120 ? "..." : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card shadow-sm">
              <div className="border-b px-4 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide">Agenda rápida</h2>
                <p className="text-xs text-muted-foreground">Eventos marcados no calendário.</p>
              </div>
              <div className="px-3 py-3">
                <TooltipProvider delayDuration={50}>
                  <Calendar
                    mode="single"
                    modifiers={{ hasEvent: eventDates }}
                    modifiersClassNames={{ hasEvent: "ring-2 ring-primary/50 rounded-full" }}
                    locale={ptBR}
                    className="w-full text-sm [&_.rdp-caption_label]:text-sm [&_.rdp-head_cell]:text-[11px] [&_.rdp-day]:h-8 [&_.rdp-day]:w-8 [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-table]:table-fixed"
                    components={{
                      Day: (dayProps: DayProps) => {
                        const { date, ...buttonProps } = dayProps;
                        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
                          date.getDate(),
                        ).padStart(2, "0")}`;
                        const evs = eventsByDate[key] ?? [];
                        const dayButton = (
                          <button
                            {...buttonProps}
                            type="button"
                            className="w-full h-full flex flex-col items-center justify-center gap-1"
                          >
                            <span className="text-[0.75rem]">{date.getDate()}</span>
                            <div className="flex items-center gap-1">
                              {evs.slice(0, 3).map((ev) => (
                                <span
                                  key={ev.id}
                                  className="inline-block h-1.5 w-1.5 rounded-full"
                                  style={{ backgroundColor: ev.color }}
                                />
                              ))}
                              {evs.length > 3 && (
                                <span className="text-[0.65rem] text-muted-foreground">+{evs.length - 3}</span>
                              )}
                            </div>
                          </button>
                        );

                        if (evs.length === 0) return dayButton;

                        return (
                          <Tooltip>
                            <TooltipTrigger asChild>{dayButton}</TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs space-y-1">
                              {evs.map((ev) => (
                                <p key={ev.id} className="text-xs leading-tight">
                                  {ev.title}
                                </p>
                              ))}
                            </TooltipContent>
                          </Tooltip>
                        );
                      },
                    }}
                  />
                </TooltipProvider>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card shadow-sm">
              <div className="border-b px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide">Aniversariante do mês</h2>
              </div>
              <div className="px-5 py-4">
                {!nextBirthday ? (
                  <p className="text-sm text-muted-foreground">Nenhum aniversariante encontrado.</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground">{nextBirthday.person.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {nextBirthday.person.birthDate && format(nextBirthday.next, "dd/MM", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-muted-foreground">{nextBirthday.person.setor || "Setor não informado"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
