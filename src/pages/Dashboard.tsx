// ============================================
// DASHBOARD (MURAL)
// ============================================
// Página principal da intranet - Feed de posts estilo Instagram/X

import { useState } from "react";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getPostsByUserCategory } from "@/data/mockData";
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
import { UserCategory, Post } from "@/types";
import { posts as mockPosts } from "@/data/mockData";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminFilter, setAdminFilter] = useState<UserCategory | "todos">("todos");
  
  // Estado para novo post
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageUrl: "",
    targetCategory: "todos" as UserCategory | "todos",
  });

  // Filtra posts baseado na categoria do usuário
  // Usuário vê apenas posts "todos" ou posts da sua categoria
  const visiblePosts = user
    ? getPostsByUserCategory(user.category)
    : mockPosts;

  // Caso seja admin, permite filtrar o feed por categoria (ou ver todos)
  const postsToShow = isAdmin
    ? adminFilter === "todos"
      ? mockPosts
      : mockPosts.filter((p) => p.targetCategory === adminFilter)
    : visiblePosts;

  // ============================================
  // HANDLER: Criar novo post (apenas Admin)
  // ============================================
  // ⚠️ BACKEND: POST /api/posts
  // Body: { authorId, title, content, imageUrl, targetCategory }
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
      targetCategory: newPost.targetCategory,
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
      targetCategory: "todos",
    });
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-2xl py-6 px-4">
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
                  <Label htmlFor="category">Para quem? *</Label>
                  <Select
                    value={newPost.targetCategory}
                    onValueChange={(value: UserCategory | "todos") =>
                      setNewPost({ ...newPost, targetCategory: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="todos">Todos os colaboradores</SelectItem>
                      <SelectItem value="vendedor">Vendedores</SelectItem>
                      <SelectItem value="tecnico">Técnicos</SelectItem>
                      <SelectItem value="rh">RH</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
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
            <Label htmlFor="filter">Filtrar posts por categoria</Label>
            <div className="mt-2">
              <Select
                value={adminFilter}
                onValueChange={(value: UserCategory | "todos") => setAdminFilter(value)}
              >
                <SelectTrigger id="filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="todos">Todos os posts</SelectItem>
                  <SelectItem value="vendedor">Vendedores</SelectItem>
                  <SelectItem value="tecnico">Técnicos</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
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
      </main>
    </div>
  );
};

export default Dashboard;
