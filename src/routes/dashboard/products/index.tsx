import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { 
  LayoutGrid, List, ChevronLeft, ChevronRight, 
  ShoppingCart, PackageOpen, Trash2, Minus, CheckCircle2, ReceiptText,
  Star, Info
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
} from "@/components/ui/dialog"
import { z } from 'zod'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'

const productSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute('/dashboard/products/')({
  validateSearch: productSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  
  // Estados para os Modais
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  
  const [lastOrder, setLastOrder] = useState<any[]>([])
  const [lastTotal, setLastTotal] = useState(0)
  
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { cart, addToCart, removeItem, clearCart, totalPrice, totalItems } = useCart()

  const limit = 10
  const skip = (page - 1) * limit
  const totalPages = Math.ceil(total / limit)

  useEffect(() => {
    fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        setTotal(data.total)
      })
  }, [page, skip])

  const handleFinishOrder = () => {
    setLastOrder([...cart])
    setLastTotal(totalPrice)
    setIsReceiptOpen(true)
    clearCart()
    toast.success("Order placed successfully!", { duration: 1500 })
  }

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product)
    setIsDetailsOpen(true)
  }

  const setPage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
  }

  const getVisiblePages = () => {
    const maxVisible = 5
    let start = Math.max(page - Math.floor(maxVisible / 2), 1)
    let end = Math.min(start + maxVisible - 1, totalPages)
    if (end === totalPages) start = Math.max(end - maxVisible + 1, 1)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground font-medium">Showing {products.length} out of {total} items</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="h-8 w-8 p-0">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('table')} className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Sheet>
            <SheetTrigger>
              <Button variant="outline" className="relative gap-2 border-primary/20 transition-all">
                <ShoppingCart className="h-4 w-4" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> My Cart
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 opacity-50 text-center">
                    <PackageOpen className="h-10 w-10 mb-2" />
                    <p className="text-xs uppercase tracking-widest font-bold">Empty cart</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="group relative flex gap-3 bg-background p-3 rounded-xl border shadow-sm">
                      <img src={item.thumbnail} className="h-12 w-12 rounded-lg object-cover bg-muted" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold line-clamp-1 pr-6">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground">{item.quantity}x ${item.price}</p>
                        <p className="text-xs font-bold text-primary mt-1">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="absolute -right-2 -top-2 h-6 w-6 p-0 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <SheetFooter className="border-t pt-6 flex flex-col gap-4">
                <div className="flex justify-between items-end w-full">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Amount</span>
                    <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2 w-full">
                  {cart.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={clearCart}
                      className="h-11 w-12 border-destructive/20 text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    className="flex-1 h-11 font-bold shadow-sm" 
                    disabled={cart.length === 0} 
                    onClick={handleFinishOrder}
                  >
                    Finish Order
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
        
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden border bg-muted">
                  <img src={selectedProduct.thumbnail} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.images?.slice(0, 4).map((img: string, i: number) => (
                    <div key={i} className="aspect-square rounded-md border overflow-hidden bg-muted">
                      <img src={img} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="flex flex-col gap-4">
                <DialogHeader className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                    {selectedProduct.category}
                  </span>
                  <DialogTitle className="text-2xl font-bold">{selectedProduct.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-bold text-foreground">{selectedProduct.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground border-l pl-2">
                      {selectedProduct.stock} in stock
                    </span>
                  </div>
                </DialogHeader>

                <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                  {selectedProduct.description}
                </DialogDescription>

                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mt-auto pt-6">
                   <Button className="w-full h-12 font-bold gap-2" onClick={() => {
                     addToCart(selectedProduct);
                     toast.success("Added to cart!");
                   }}>
                     <ShoppingCart className="h-4 w-4" /> Add to Cart
                   </Button>
                   <Button variant="outline" className="w-full" onClick={() => setIsDetailsOpen(false)}>
                     Continue Shopping
                   </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl">Purchase Confirmed!</DialogTitle>
            <DialogDescription>Order #ORD-{Math.floor(Math.random() * 10000)}</DialogDescription>
          </DialogHeader>

          <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-muted-foreground/30 space-y-3 my-4">
            <div className="flex items-center gap-2 border-b pb-2 mb-2">
              <ReceiptText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Summary</span>
            </div>
            <div className="max-h-[150px] overflow-y-auto space-y-2">
              {lastOrder.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span>{item.quantity}x {item.title}</span>
                  <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed pt-3 flex justify-between items-center">
              <span className="font-bold text-sm">Total</span>
              <span className="font-bold text-lg text-primary">${lastTotal.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => setIsReceiptOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>

      
      <div className="min-h-[500px]">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => (
              <div key={p.id} className="group flex flex-col rounded-xl border bg-card transition-all hover:shadow-lg hover:border-primary/20 overflow-hidden">
                <div 
                  className="aspect-square bg-muted/50 overflow-hidden relative cursor-pointer"
                  onClick={() => handleViewDetails(p)}
                >
                  <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Info className="h-3 w-3" /> Details
                    </Button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{p.category}</span>
                  <h3 
                    className="font-medium text-sm line-clamp-1 mb-1 text-foreground cursor-pointer hover:text-primary"
                    onClick={() => handleViewDetails(p)}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm font-bold text-foreground mb-4">${p.price.toFixed(2)}</p>
                  <Button 
                    variant="outline" size="sm" className="w-full mt-auto h-9 text-xs font-semibold gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => { addToCart(p); toast.success(`${p.title} added!`); }}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">#{p.id}</TableCell>
                    <TableCell 
                      className="font-medium text-sm cursor-pointer hover:text-primary"
                      onClick={() => handleViewDetails(p)}
                    >
                      {p.title}
                    </TableCell>
                    <TableCell className="capitalize text-xs text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-sm font-semibold">${p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(p)}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => { addToCart(p); toast.success("Added!"); }}>
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

    
      <div className="flex flex-col items-center gap-4 py-10 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-1.5 mx-2">
            {visiblePages.map((p) => (
              <Button key={p} variant={page === p ? "default" : "outline"} size="sm" onClick={() => setPage(p)} className="h-8 w-8 p-0 text-xs">
                {p}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}