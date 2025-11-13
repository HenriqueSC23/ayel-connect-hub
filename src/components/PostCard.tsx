// ============================================
// CARD DE POST DO MURAL
// ============================================
// Componente que exibe um post com imagem, curtidas e comentários
// Inspirado em Instagram/X

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Post, Comment } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { comments as mockComments } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?.id || ""));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState<Comment[]>(
    mockComments.filter((c) => c.postId === post.id)
  );

  // ============================================
  // HANDLER: Curtir/Descurtir post
  // ============================================
  // ⚠️ BACKEND: POST /api/posts/{postId}/like
  // Body: { userId }
  // Response: { liked: boolean, likesCount: number }
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    // ⚠️ BACKEND: Fazer requisição para salvar no banco
    // fetch(`/api/posts/${post.id}/like`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId: user.id })
    // });
  };

  // ============================================
  // HANDLER: Adicionar comentário
  // ============================================
  // ⚠️ BACKEND: POST /api/posts/{postId}/comments
  // Body: { userId, content }
  // Response: { comment: Comment }
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: String(Date.now()),
      postId: post.id,
      authorId: user.id,
      authorName: user.fullName,
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    setPostComments([...postComments, comment]);
    setNewComment("");

    // ⚠️ BACKEND: Salvar comentário no banco
    // fetch(`/api/posts/${post.id}/comments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     userId: user.id,
    //     content: newComment
    //   })
    // });
  };

  // Formata data relativa (ex: "há 2 horas")
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  // Mapeia categoria para label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      todos: "Todos",
      vendedor: "Vendedores",
      tecnico: "Técnicos",
      rh: "RH",
      administrativo: "Administrativo",
      outros: "Outros",
    };
    return labels[category] || category;
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.authorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{post.authorName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <Badge variant="secondary">{getCategoryLabel(post.targetCategory)}</Badge>
        </div>

        {post.title && <h3 className="font-semibold text-lg">{post.title}</h3>}
      </CardHeader>

      <CardContent className="space-y-3">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title || "Post"}
            className="w-full rounded-lg object-cover max-h-96"
          />
        )}
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        {/* Ações: Curtir e Comentar */}
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{postComments.length}</span>
          </Button>
        </div>

        {/* Seção de Comentários */}
        {showComments && (
          <div className="w-full space-y-3">
            {/* Lista de comentários */}
            {postComments.length > 0 && (
              <div className="space-y-3 border-t pt-3">
                {postComments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-muted">
                        {comment.authorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{comment.authorName}</span>{" "}
                        <span className="text-muted-foreground">{comment.content}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formulário para adicionar comentário */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <Input
                placeholder="Adicione um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
