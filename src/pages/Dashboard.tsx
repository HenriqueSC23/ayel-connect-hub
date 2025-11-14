// ============================================
// DASHBOARD (MURAL)
// ============================================
// Página principal da intranet - Feed de posts estilo Instagram/X

import { useState } from "react";
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

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminRoleFilter, setAdminRoleFilter] = useState<PostRoleTarget>("all");
  const [adminCompanyFilter, setAdminCompanyFilter] = useState<CompanyTarget>("all");
  
  // Estado para novo post
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageUrl: "",
    roleTarget: "all" as PostRoleTarget,
    companyTarget: "all" as CompanyTarget,
  });

  // Filtra posts baseado na categoria do usuário
  const visiblePosts = getVisiblePosts(user);

  // Caso seja admin, permite filtrar o feed por categoria (ou ver todos)
  const postsToShow = isAdmin
    ? mockPosts.filter(
        (post) =>
          (adminRoleFilter === "all" || post.roleTarget === adminRoleFilter) &&
          (adminCompanyFilter === "all" || post.companyTarget === adminCompanyFilter),
      )
    : visiblePosts;

  // ============================================
  // HANDLER: Criar novo post (apenas Admin)
  // ============================================
  // ⚠️ BACKEND: POST /api/posts
  // Body: { authorId, title, content, imageUrl, roleTarget, companyTarget }
  // Response: { post: Post }
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
      likes: [],
      createdAt: new Date().toISOString(),
    };

    // ⚠️ BACKEND: Salvar post no banco
    // fetch('/api/posts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(post)
    // });

    // Adiciona ao array local (remover ao usar API real)
    mockPosts.unshift(post);

    // Reseta formulário
    setNewPost({
      title: "",
      content: "",
      imageUrl: "",
      roleTarget: "all",
      companyTarget: "all",
    });
    setDialogOpen(false);
  };

  return (
    <AppLayout maxWidthClass="max-w-2xl">
      {/* Boas-vindas */}
      <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Olá, {user?.fullName?.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo à intranet da Ayel Segurança e Tecnologia
        </p>
      </div>

      {/* Botão criar post (apenas Admin) */}
      {isAdmin && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6 gap-2" size="lg">
              <PlusCircle className="h-5 w-5" />
              Criar novo post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-background">
            <DialogHeader>
              <DialogTitle>Criar novo post</DialogTitle>
              <DialogDescription>
                Compartilhe informações com os colaboradores
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título (opcional)</Label>
                <Input
                  id="title"
                  placeholder="Título do post"
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
                  placeholder="Escreva sua mensagem..."
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
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
                    className="w-full h-40 object-cover rounded-lg"
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

              <Button type="submit" className="w-full">
                Publicar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Filtro (apenas Admin) */}
      {isAdmin && (
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="filter">Filtrar posts</Label>
            <p className="text-xs text-muted-foreground">Role + Empresa</p>
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

      {/* Feed de posts */}
      <div className="space-y-6">
        {postsToShow.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
          </div>
        ) : (
          postsToShow.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
