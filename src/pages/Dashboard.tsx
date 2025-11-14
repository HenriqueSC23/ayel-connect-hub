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
import { companies as mockCompanies, getVisiblePosts, posts as mockPosts } from "@/data/mockData";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyTarget, Post, PostRoleTarget } from "@/types";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const visiblePosts = getVisiblePosts(user);

  const basePosts = isAdmin
    ? mockPosts.filter(
        (post) =>
          (adminRoleFilter === "all" || post.roleTarget === adminRoleFilter) &&
          (adminCompanyFilter === "all" || post.companyTarget === adminCompanyFilter),
      )
    : visiblePosts;

  const importantPosts = useMemo(
    () => basePosts.filter((post) => post.isImportant),
    [basePosts],
  );

  const postsToShow =
    mobilePostFilter === "important" ? importantPosts : basePosts;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim() || !user) return;

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
      createdAt: new Date().toISOString(),
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
              Bem-vindo à intranet da Ayel Segurança e Tecnologia
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
          <div className="sticky top-24 space-y-4">
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
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
