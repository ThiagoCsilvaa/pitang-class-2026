import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowRight, Zap, ShieldCheck, Star } from 'lucide-react'
import { checkAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const isLogged = checkAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Pitang.Store</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/dashboard/products" search={{ page: 1 }} className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
            <Button size="sm" className="rounded-full" 
            onClick={() => navigate({to: '/login'})}>
              {isLogged && (
                "Go to Dashboard"
              )}
              {!isLogged && (
                "Entrar"
              )}
            </Button>
          </nav>
        </div>
      </header>

      
      <main className="flex-1">
        <section className="container max-w-7xl mx-auto px-6 py-24 lg:py-32 flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted/50 text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Zap className="mr-1 h-3 w-3 fill-primary text-primary" />
            Nova coleção de tech disponível
          </div>

          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Simplicidade em cada <br />
            <span className="text-primary italic">detalhe tecnológico.</span>
          </h1>

          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Sua curadoria exclusiva de gadgets e acessórios com design minimalista. 
            Experimente a navegação fluida em nosso dashboard de produtos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link to="/dashboard/products" search={{ page: 1 }}>
              <Button size="lg" className="rounded-full h-12 px-8 gap-2 group">
                Explorar Catálogo
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        
        <section className="container max-w-7xl mx-auto px-6 py-20 border-t border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Compra Segura</h3>
              <p className="text-sm text-muted-foreground">
                Processamento de dados com os mais altos padrões de segurança.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Curadoria Premium</h3>
              <p className="text-sm text-muted-foreground">
                Apenas itens selecionados que combinam performance e estética.
              </p>
            </div>
          </div>
        </section>
      </main>

      
      <footer className="border-t bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            

            <div className="col-span-1 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-7 w-7 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg tracking-tight">Pitang.Store</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Elevando sua experiência digital com curadoria de excelência e design minimalista. 
                O futuro da tecnologia, hoje.
              </p>
              <div className="flex gap-4 pt-2">
      
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors">
                  <span className="text-xs font-bold">In</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors">
                  <span className="text-xs font-bold">Gh</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-widest">Plataforma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li className="hover:text-primary cursor-pointer transition-colors">Produtos</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Novidades</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Ofertas</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Dashboard</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-widest">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li className="hover:text-primary cursor-pointer transition-colors">Ajuda & FAQ</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Rastreio</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Privacidade</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Termos de Uso</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest">Fique por dentro</h4>
              <p className="text-sm text-muted-foreground">Assine para receber atualizações exclusivas.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="flex-1 h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm">Ok</Button>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
            <p>© 2026 Pitang Store. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <span className="hover:text-primary cursor-pointer">Segurança</span>
              <span className="hover:text-primary cursor-pointer">Cookies</span>
              <span className="hover:text-primary cursor-pointer">Acessibilidade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}