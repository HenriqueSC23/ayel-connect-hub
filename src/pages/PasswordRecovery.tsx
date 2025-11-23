// ============================================
// PÁGINA DE RECUPERAÇÃO DE SENHA
// ============================================
// Permite que usuário solicite reset de senha via email
// Por enquanto apenas UI (envio de email será implementado no backend)

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft } from "lucide-react";
import logo from "@/assets/tga-logo.png";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ============================================
  // HANDLER: Submit do formulário
  // ============================================
  // ⚠️ BACKEND: Implementar endpoint POST /api/auth/forgot-password
  // Que deve:
  // 1. Verificar se email existe no banco
  // 2. Gerar token único de reset (com expiração)
  // 3. Enviar email com link de reset
  // 4. Link deve apontar para: /reset-password?token={token}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);

    // Simula envio de email (substituir por API real)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setSuccess(true);

    // ⚠️ BACKEND: Fazer requisição real
    // try {
    //   await fetch('/api/auth/forgot-password', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email })
    //   });
    //   setSuccess(true);
    // } catch (error) {
    //   // Mostrar erro
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src={logo} alt="TGA Intranet" className="h-14" />
          </div>
          <div>
            <CardTitle className="text-2xl">Recuperar senha</CardTitle>
            <CardDescription>
              Digite seu email para receber instruções de recuperação
            </CardDescription>
          </div>
        </CardHeader>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@tga.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>

              <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para login
                </Button>
              </Link>
            </CardFooter>
          </form>
        ) : (
          <>
            <CardContent className="space-y-4">
              <Alert className="border-primary bg-primary-light">
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Se o email <strong>{email}</strong> estiver cadastrado em nosso
                  sistema, você receberá instruções para redefinir sua senha.
                </AlertDescription>
              </Alert>

              <p className="text-sm text-muted-foreground text-center">
                Não recebeu o email? Verifique sua caixa de spam ou tente novamente em
                alguns minutos.
              </p>
            </CardContent>

            <CardFooter>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para login
                </Button>
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default PasswordRecovery;
