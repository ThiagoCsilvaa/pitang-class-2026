
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  Search,
  ShieldCheck,
  User as UserIcon,
  Loader2
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { z } from 'zod'

const userSearchSchema = z.object({
  page: z.number().catch(1),
  q: z.string().catch(''),
})

export const Route = createFileRoute('/dashboard/users/')({
  validateSearch: userSearchSchema,
  component: UsersComponent,
})

function UsersComponent() {
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const { page, q } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const [searchQuery, setSearchQuery] = useState(q)

  const limit = 10
  const skip = (page - 1) * limit
  const totalPages = Math.ceil(total / limit)

  useEffect(() => {
    const handler = setTimeout(() => {
      navigate({
        search: (prev) => ({ ...prev, q: searchQuery, page: 1 }),
      })
    }, 500)

    return () => clearTimeout(handler)
  }, [searchQuery, navigate])

  useEffect(() => {
    setLoading(true)
    
    const baseUrl = q 
      ? `https://dummyjson.com/users/search?q=${q}&limit=${limit}&skip=${skip}`
      : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`

    fetch(baseUrl)
      .then(res => res.json())
      .then(data => {
        setUsers(data.users)
        setTotal(data.total)
      })
      .finally(() => setLoading(false))
  }, [page, skip, q])

  const setPage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Manage your users.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name, email or username..." 
            className="pl-9 bg-muted/20 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute right-2.5 top-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                   Searching users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground font-medium">
                    No users found for "{q}".
                  </TableCell>
                </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/10 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={user.image} alt={user.firstName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm leading-tight text-foreground">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {user.role === 'admin' ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                      ) : (
                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                        {user.role || 'user'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs capitalize font-medium px-2 py-0.5 rounded-full bg-muted">
                      {user.gender}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                        <Mail className="h-3 w-3" /> {user.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" /> {user.phone}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          {total} Results
        </span>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(page - 1)} 
            disabled={page <= 1 || loading}
            className="h-8 text-xs font-bold"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="text-xs font-bold px-3 py-1 bg-muted rounded-md border">
             {page} / {totalPages || 1}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(page + 1)} 
            disabled={page >= totalPages || loading}
            className="h-8 text-xs font-bold"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
