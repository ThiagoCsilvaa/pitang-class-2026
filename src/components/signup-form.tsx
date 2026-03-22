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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Criar nova conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Preencha os dados abaixo para começar
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
          <Input id="name" type="text" placeholder="Thiago Cavalcanti" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input id="email" type="email" placeholder="exemplo@email.com" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input id="password" type="password" required />
          <FieldDescription>
            A senha deve ter pelo menos 8 caracteres.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmar Senha</FieldLabel>
          <Input id="confirm-password" type="password" required />
        </Field>
        <Field>
          <Button type="submit" className="transition-all active:scale-95 font-bold">
            Criar Conta
          </Button>
        </Field>
        
        <FieldDescription className="px-6 text-center">
          Já possui uma conta? <Link to="/login" className="underline underline-offset-4 hover:text-primary transition-colors">Fazer login</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}