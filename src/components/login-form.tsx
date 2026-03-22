import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"
import { useState } from "react"

interface LoginFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, data: LoginData) => void;
}

export type LoginData = {
    username: string, 
    password: string
}

export function LoginForm({
  className,
  onSubmit,
  ...props
}: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      {...props} 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e, { username, password });
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Acesse sua conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Informe seu usuário para entrar no painel
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Usuário</FieldLabel>
          <Input 
            onChange={(e) => setUsername(e.target.value)} 
            value={username} 
            name="username" 
            id="username" 
            type="text" 
            placeholder="Thiago Cavalcanti" 
            required 
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
          </div>
          <Input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            id="password" 
            type="password" 
            autoComplete="current-password"
            required 
          />
        </Field>
        <Field>
          <Button type="submit" className="transition-all active:scale-95 font-bold">
            Entrar
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Ainda não tem uma conta?{" "}
          <Link to="/register" className="underline underline-offset-4 hover:text-primary transition-colors">
            Cadastre-se
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}