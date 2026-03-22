import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/use-auth"
import { TimerReset } from "lucide-react"

export function SessionExpiringModal() {
  const { showRefreshModal, performRefresh, handleLogout } = useAuth()

  return (
    <AlertDialog open={showRefreshModal}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <TimerReset className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Aviso de Segurança</span>
          </div>
          <AlertDialogTitle className="text-xl">Sua sessão está expirando</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Por motivos de segurança, sua sessão será encerrada em aproximadamente 5 minutos. 
            Deseja continuar conectado e renovar seu acesso?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel 
            onClick={handleLogout}
            className="border-none hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            Sair agora
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => performRefresh()}
            className="bg-primary font-bold shadow-md hover:bg-primary/90"
          >
            Sim, continuar logado
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}