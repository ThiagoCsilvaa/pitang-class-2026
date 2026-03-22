import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Package, DollarSign, Tag, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})

function DashboardOverview() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalValue: 0,
    categoriesCount: 0,
    avgPrice: 0
  })
  const [categoriesList, setCategoriesList] = useState<{ name: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=100')
        const data = await response.json()
        
        const totalProducts = data.total
        const totalValue = data.products.reduce((acc: number, p: any) => acc + p.price, 0)
        const avgPrice = totalValue / (data.products.length || 1)

        
        const catMap: Record<string, number> = {}
        data.products.forEach((p: any) => {
          catMap[p.category] = (catMap[p.category] || 0) + 1
        })
        
        const sortedCategories = Object.entries(catMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count) 

        setMetrics({
          totalProducts,
          totalValue,
          categoriesCount: sortedCategories.length,
          avgPrice
        })
        setCategoriesList(sortedCategories)
      } catch (error) {
        console.error("Erro ao buscar métricas:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  if (loading) return <div className="p-6 animate-pulse">Loading dashboard...</div>

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meu Painel de Controle</h2>
      </div>

      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Products" value={metrics.totalProducts} icon={Package} />
        <MetricCard title="Total Amount" value={`$${metrics.totalValue.toLocaleString()}`} icon={DollarSign} />
        <MetricCard title="Categories" value={metrics.categoriesCount} icon={Tag} />
        <MetricCard title="Average Ticket" value={`$${metrics.avgPrice.toFixed(2)}`} icon={AlertCircle} />
      </div>

      
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[70%]">Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoriesList.map((category) => (
                  <TableRow key={category.name} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium capitalize">{category.name.replace('-', ' ')}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {category.count} items
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon }: any) {
  return (
    <Card className="shadow-none border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}